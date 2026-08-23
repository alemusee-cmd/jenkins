const { server } = require("../app");

describe("API Service Comprehensive Coverage Tests", () => {
  test("should return status ok on valid health request", (done) => {
    const req = { url: "/health" };
    const res = {
      writeHead: (status, headers) => {
        expect(status).toBe(200);
      },
      end: (data) => {
        const parsed = JSON.parse(data);
        expect(parsed.status).toBe("ok");
        done();
      },
    };
    server.emit("request", req, res);
  });

  test("should return 404 on invalid route request", (done) => {
    const req = { url: "/unknown" };
    const res = {
      writeHead: (status, headers) => {
        expect(status).toBe(404);
      },
      end: (data) => {
        const parsed = JSON.parse(data);
        expect(parsed.error).toBe("Not Found");
        done();
      },
    };
    server.emit("request", req, res);
  });
});
