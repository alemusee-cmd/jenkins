jest.mock("axios");
const axios = require("axios");
const { server } = require("../app");

describe("Web Service Tests", () => {
  test("health returns ok with build and commit", (done) => {
    const req = { url: "/health" };
    const res = {
      writeHead: (s) => expect(s).toBe(200),
      end: (data) => {
        const p = JSON.parse(data);
        expect(p.status).toBe("ok");
        expect(p).toHaveProperty("build");
        expect(p).toHaveProperty("commit");
        done();
      },
    };
    server.emit("request", req, res);
  });

  test("root pulls greeting from api", (done) => {
    axios.get.mockResolvedValue({ data: { greeting: "שלום עולם" } });
    const req = { url: "/" };
    const res = {
      writeHead: (s) => expect(s).toBe(200),
      end: (data) => {
        const p = JSON.parse(data);
        expect(p.message).toBe("שלום עולם");
        expect(p.source).toBe("api");
        done();
      },
    };
    server.emit("request", req, res);
  });

  test("returns 502 when api is unreachable", (done) => {
    axios.get.mockRejectedValue(new Error("refused"));
    const req = { url: "/" };
    const res = {
      writeHead: (s) => expect(s).toBe(502),
      end: (data) => {
        expect(JSON.parse(data).status).toBe("error");
        done();
      },
    };
    server.emit("request", req, res);
  });
});
