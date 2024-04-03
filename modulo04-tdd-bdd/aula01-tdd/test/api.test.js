import { describe, it, expect, jest, beforeAll, afterAll } from "@jest/globals";
import { server } from "../src/api.js";

/*
 - Deve cadastrar usuários e definir uma categoria onde:
    - Jovens Adultos:
      - Usuarios de 18-25
    - Adultos:
      - Usuarios de 26-50
    - Idosos:
      - 51+
    - Menor:
      - Estoura um erro!
 */

describe("API Users E2E Suite", () => {
  function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
      server.once("error", (err) => reject(err));
      server.once("listening", () => resolve());
    });
  }

  function createUser(data) {
    return fetch(`${_testServerAddress}/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async function findUserById(id) {
    const user = await fetch(`${_testServerAddress}/users/${id}`);
    return user.json();
  }

  let _testServer;
  let _testServerAddress;
  beforeAll(async () => {
    _testServer = server.listen();

    await waitForServerStatus(_testServer);

    const serverInfo = _testServer.address();
    _testServerAddress = `http://localhost:${serverInfo.port}`;

    jest.useFakeTimers({ now: new Date('2023-11-23T00:00') })
  });

  afterAll((done) => {
    server.closeAllConnections(); // encerra mais rápido
    _testServer.close(done);
  });
  it("sould register a new user with young-adult category", async () => {
    const expectedCategory = "young-adult";
    const response = await createUser({
      name: "Xuxa da Silva",
      birthDay: "2000-01-01", // 24 anos
    });
    expect(response.status).toBe(201); // 201 - created
    const result = await response.json();
    expect(result.id).not.toBeUndefined();

    const user = await findUserById(result.id);
    expect(user.category).toBe(expectedCategory);
  });
  it("sould register a new user with adult category", async () => {
    const expectedCategory = "adult";
    const response = await createUser({
      name: "Xuxa da Silva",
      birthDay: "1990-01-01", // 33 anos
    });
    expect(response.status).toBe(201); // 201 - created
    const result = await response.json();
    expect(result.id).not.toBeUndefined();

    const user = await findUserById(result.id);
    expect(user.category).toBe(expectedCategory);
  });
  it("sould register a new user with senior category", async () => {
    const expectedCategory = "senior";
    const response = await createUser({
      name: "Xuxa da Silva",
      birthDay: "1972-01-01", // 51 anos
    });
    expect(response.status).toBe(201); // 201 - created
    const result = await response.json();
    expect(result.id).not.toBeUndefined();

    const user = await findUserById(result.id);
    expect(user.category).toBe(expectedCategory);
  });
  it("sould throw an error when registering a under-age user", async () => {
    const response = await createUser({
      name: "Xuxa da Silva",
      birthDay: "2018-01-01",
    });

    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result).toEqual({ message: "User must be 18yo or older" });
  });
});
