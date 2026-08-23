const http = require("http");

const greets = [
  "שלום עולם",
  "ברוכים הבאים",
  "יום מקסים",
  "בהצלחה בלימודים",
  "עבודה מעולה",
];

function randomGreets() {
  const index = Math.floor(Math.random() * greets.length);
  return greets[index];
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", message: randomGreets() }));
});

const PORT = 8080;

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`Web Service is running on port ${PORT}`);
  });
}

module.exports = { greets, randomGreets, server };
