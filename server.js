const express = require("express");
const next = require("next");

const PORT = parseInt(process.env.PORT, 10) || 3364;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("*", (req, res) => handle(req, res));

  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`🐎 => Ready on http://localhost:${PORT}`);
  });
});