const http = require("http");

const server = http.createServer((req, res) => {
  // בדיקה האם מדובר בנתיב ה-health המבוקש
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "api-service" }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`API Service is running on port ${PORT}`);
  });
}

module.exports = { server };
