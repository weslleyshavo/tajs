import { Given, AfterAll } from "@cucumber/cucumber";
import { server } from "../src/api.js";
import sinon from "sinon";

let _testServer;

function waitForServerStatus(server) {
  return new Promise((resolve, reject) => {
    server.once("error", (err) => reject(err));
    server.once("listening", () => resolve());
  });
}

AfterAll((done) => {
  sinon.restore();
  server.closeAllConnections(); // encerra mais rápido
  _testServer.close(done);
});

Given("I have a running server", async function () {
  // se o servidor já tiver rodando, usa ele!
  if (!_testServer) {
    _testServer = server.listen();

    await waitForServerStatus(_testServer);
  }

  const serverInfo = _testServer.address();
  this.testServerAddress = `http://localhost:${serverInfo.port}`;
});

Given("The current date is {string}", async function (date) {
  sinon.restore();
  const clock = sinon.useFakeTimers(new Date(date).getTime());
  const d = new Date();
  this.clock = clock;
});
