import { BeforeStep, When, Then } from "@cucumber/cucumber";
import assert from "node:assert";

let _testServerAddress = "";
let _context = {};

function createUser(data) {
  return fetch(`${_testServerAddress}/users`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

BeforeStep(function () {
  _testServerAddress = this.testServerAddress;
});

When(
  "I create a young user with the following details:",
  async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 400);
    _context.errorCreateUser = await response.json();
  }
);

Then(
  "I should receive an error message that the user must be at least 18 years old",
  async function () {
    assert.strictEqual(
      _context.errorCreateUser.message,
      "User must be 18yo or older"
    );
  }
);
