const express = require("express");
const cors = require("cors");

const app = express();
// eslint-disable-next-line new-cap
const router = express.Router();

app.use(cors({origin: true}));
app.use("/api", router);

router.get("/", (req, res) => {
  const forwardedIps = req.headers["x-forwarded-for"].split(",");
  return res.send(forwardedIps[0]);
});

router.get("/test", (_, res) => {
  return res.json({hey: "good"});
});

module.exports = app;
