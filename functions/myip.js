const express = require("express");
const cors = require("cors");
const {fetchGeoInfo} = require("./lib/ipApi");

const app = express();

app.use(cors({origin: true}));

const getClientIp = (req) => {
  const xForwardedFor = req.headers["x-forwarded-for"];
  return xForwardedFor ? xForwardedFor.split(",")[0].trim() : "";
};

app.get("/myip", (req, res) => {
  const clientIp = getClientIp(req);
  if (!clientIp) {
    return res.status(500).json({error: "Failed to get client IP"});
  }

  res.set("Cache-Control", "private, max-age=10");
  return res.json({clientIp});
});

app.get("/mygeo", (req, res) => {
  const clientIp = getClientIp(req);
  if (!clientIp) {
    return res.status(500).json({error: "Failed to get client IP"});
  }

  fetchGeoInfo(clientIp)
      .then((geoInfo) => {
        res.set("Cache-Control", "private, max-age=10");
        return res.json(Object.assign({clientIp}, geoInfo));
      })
      .catch(() => {
        return res.status(500).json({
          error: "Failed to get geo info",
          clientIp,
        });
      });
});

module.exports = app;
