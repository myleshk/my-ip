const express = require("express");
const cors = require("cors");
const {fetchGeoInfo} = require("./lib/ipApi");

const app = express();
app.use(cors({origin: true}));

app.get("/geo/:ip", (req, res) => {
  const ip = req.params.ip;

  if (ip) {
    return fetchGeoInfo(ip)
        .then((geoInfo) => res.json(geoInfo))
        .catch(() => {
          return res.status(500).json({error: "Failed to get geo info"});
        });
  }
  return res.status(400).json({error: "IP is required"});
});

module.exports = app;
