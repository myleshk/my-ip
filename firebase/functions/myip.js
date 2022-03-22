const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({origin: true}));

app.get("/myip", (req, res) => {
  const clientIp = req.headers["x-forwarded-for"].split(",")[0];

  if (!clientIp) {
    return res.status(500).json({error: "Failed to get client IP"});
  }
  return res.json({
    clientIp,
  });
});

module.exports = app;
