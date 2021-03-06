const functions = require("firebase-functions");
const api = require("./api.js");
const axios = require("axios");

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
  {apiPath: "be", code: "europe-west1", name: "Belgium, BE"},
  {apiPath: "uk", code: "europe-west2", name: "London, UK"},
  {apiPath: "hk", code: "asia-east2", name: "Hong Kong, HK"},
  {apiPath: "jp", code: "asia-northeast1", name: "Tokyo, JP"},
];
for (const {apiPath, code, name} of locations) {
  exports[apiPath] = functions
      .runWith(runtimeOpts)
      .region(code)
      .https.onRequest(function(req, res) {
        const forwardedIps = req.headers["x-forwarded-for"].split(",");
        const clientIp = forwardedIps[0];

        if (!clientIp) {
          return res.status(500).json({error: "Failed to get client IP"});
        }

        axios.get(`http://api.ipstack.com/${clientIp}`, {params: {access_key: "f14a6a34daf6ad670c7fcbc6e9619732"}})
            .then(function(response) {
              return res.json({
                server: {
                  location: name,
                },
                client: response.data,
              });
            })
            .catch(function(error) {
              res.status(500).json({error});
            });
      });
}
