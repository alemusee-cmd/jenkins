const http = require("http");
const axios = require("axios");

const server = http.createServer(async (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        build: process.env.BUILD_ID || "0",
        commit: process.env.COMMIT_HASH || "unknown",
      }),
    );
    return;
  }

  const apiUrl = process.env.API_URL || "http://api:3000";
  try {
    const response = await axios.get(`${apiUrl}/greeting`);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        message: response.data.greeting,
        source: "api",
      }),
    );
  } catch (err) {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "error", message: "cannot reach api" }));
  }
});

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => console.log(`Web Service on port ${PORT}`));
}

module.exports = { server };
