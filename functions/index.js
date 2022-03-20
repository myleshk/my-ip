const functions = require("firebase-functions");
const api = require("./api.js");
const axios = require("axios");
const cors = require("./cors.js");

const runtimeOpts = {
  timeoutSeconds: 5,
  memory: "128MB",
};

exports.api = functions.runWith(runtimeOpts).https.onRequest(api);

/**
 * get client IP from different regions (JSON)
 */
const locations = [
  {apiPath: "us", code: "us-east1", name: "South Carolina, US"},
  {apiPath: "uk", code: "europe-west2", name: "London, UK"},
  {apiPath: "hk", code: "asia-east2", name: "Hong Kong, HK"},
  {apiPath: "jp", code: "asia-northeast1", name: "Tokyo, JP"},
];
for (const {apiPath, code, name} of locations) {
  exports[apiPath] = functions
      .runWith(runtimeOpts)
      .region(code)
      .https.onRequest(function(req, res) {
      // enable CORS
        cors(req, res, function() {
          const clientIp = req.headers["x-forwarded-for"].split(",")[0];

          if (!clientIp) {
            return res.status(500).json({error: "Failed to get client IP"});
          }
          axios
              .get(`http://ip-api.com/json/${clientIp}`)
              .then((response) => {
                return res.json({
                  serverName: name,
                  clientIp,
                  geo: response.data,
                });
              })
              .catch((error) => {
                return res.status(500).json({error});
              });
        });
      });
}
