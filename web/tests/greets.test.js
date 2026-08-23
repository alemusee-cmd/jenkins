const { greets, randomGreets, server } = require("../app");

describe("Web Service Unit & Coverage Tests", () => {
  test("should verify greets array contains at least 5 items", () => {
    expect(greets.length).toBeGreaterThanOrEqual(5);
  });

  test("should verify all elements in greets are valid strings", () => {
    for (const greet of greets) {
      expect(typeof greet).toBe("string");
      expect(greet.trim().length).toBeGreaterThan(0);
    }
  });

  test("should return a random greeting included in the array", () => {
    const result = randomGreets();
    expect(greets).toContain(result);
  });

  test("should trigger server request handler logic for coverage", (done) => {
    const req = {};
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
});
