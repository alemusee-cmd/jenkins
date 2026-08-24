const http = require("http");

const greets = [
  "שלום עולם",
  "ברוכים הבאים",
  "יום מקסים",
  "בהצלחה בלימודים",
  "עבודה מעולה",
];

function randomGreet() {
  return greets[Math.floor(Math.random() * greets.length)];
}

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        build: process.env.BUILD_ID || "0",
        commit: process.env.COMMIT_HASH || "unknown",
      }),
    );
  } else if (req.url === "/greeting") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ greeting: randomGreet() }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => console.log(`API Service on port ${PORT}`));
}

module.exports = { server, greets, randomGreet };
