const functions = require("firebase-functions");
const api = require("./api.js");

exports.api = functions.https.onRequest(api);

/**
 * get client IP from different regions (JSON)
 */
const locations = [
  {apiPath: "us", code: "us-east1", name: "South Carolina, US"},
  {apiPath: "be", code: "europe-west1", name: "Belgium, BE"},
  {apiPath: "uk", code: "europe-west2", name: "London, UK"},
  {apiPath: "hk", code: "asia-east2", name: "Hong Kong, HK"},
  {apiPath: "jp", code: "asia-northeast1", name: "Tokyo, JP"},
];
for (const {apiPath, code, name} of locations) {
  exports[apiPath] = functions
      .region(code)
      .https.onRequest(function(req, res) {
        const forwardedIps = req.headers["x-forwarded-for"].split(",");
        return res.json({
          clientIp: forwardedIps[0],
          location: name,
        });
      });
}
