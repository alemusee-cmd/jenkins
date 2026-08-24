const { server, greets, randomGreet } = require("../app");

describe("API Service Tests", () => {
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

  test("greeting returns an item from the list", (done) => {
    const req = { url: "/greeting" };
    const res = {
      writeHead: (s) => expect(s).toBe(200),
      end: (data) => {
        expect(greets).toContain(JSON.parse(data).greeting);
        done();
      },
    };
    server.emit("request", req, res);
  });

  test("404 on unknown route", (done) => {
    const req = { url: "/nope" };
    const res = {
      writeHead: (s) => expect(s).toBe(404),
      end: (data) => {
        expect(JSON.parse(data).error).toBe("Not Found");
        done();
      },
    };
    server.emit("request", req, res);
  });

  test("randomGreet returns a valid item", () => {
    expect(greets).toContain(randomGreet());
  });
});
