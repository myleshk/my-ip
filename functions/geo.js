const express = require("express");
const cors = require("cors");
const {fetchGeoInfo} = require("./lib/ipApi");

const app = express();
app.use(cors({origin: true}));

app.get("/geo/:ip", (req, res) => {
  const ip = req.params.ip;

  if (ip) {
    return fetchGeoInfo(ip)
        .then((geoInfo) => {
          res.set("Cache-Control", "public, max-age=86400");
          return res.json(geoInfo);
        })
        .catch((error) => {
          res.set("Cache-Control", "no-store");
          return res.status(error.httpStatus || 500).json({
            error: error.httpStatus ? error.message : "Failed to get geo info",
          });
        });
  }
  return res.status(400).json({error: "IP is required"});
});

module.exports = app;
