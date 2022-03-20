const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors({origin: true}));

app.get("/:ip", (req, res) => {
  const ip = req.params.ip;

  if (ip) {
    axios.get(`http://ip-api.com/json/${ip}`).then((response) => {
      return res.json(response.data);
    });
  }
});

module.exports = app;
