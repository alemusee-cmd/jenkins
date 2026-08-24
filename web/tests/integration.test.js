const http = require("http");
const apiApp = require("../../api/app");
const webApp = require("../app");

describe("Integration: web talks to api", () => {
  let apiServer, webServer, webPort;

  beforeAll((done) => {
    apiServer = apiApp.server.listen(0, () => {
      process.env.API_URL = `http://localhost:${apiServer.address().port}`;
      webServer = webApp.server.listen(0, () => {
        webPort = webServer.address().port;
        done();
      });
    });
  });

  afterAll((done) => {
    apiServer.close(() => webServer.close(done));
  });

  test("web returns a greeting sourced from api", (done) => {
    http.get(`http://localhost:${webPort}/`, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        const p = JSON.parse(body);
        expect(p.source).toBe("api");
        expect(p.message.length).toBeGreaterThan(0);
        done();
      });
    });
  });
});
