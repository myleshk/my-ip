const functions = require("firebase-functions");
const myip = require("./myip.js");
const geo = require("./geo.js");

const runtimeOpts = {
  timeoutSeconds: 5,
  memory: "128MB",
};

exports.geo = functions
    .runWith(runtimeOpts)
    .region("asia-east2")
    .https.onRequest(geo);

/**
 * get client IP from different regions (JSON)
 */
const locations = [
  // Must be us-central1 in order to be used by hosting rewrite,
  // because Firebase Hosting supports Cloud Functions in us-central1 only.
  // https://firebase.google.com/docs/hosting/full-config#rewrite-functions
  {apiPath: "us", regionCode: "us-central1"},
  {apiPath: "uk", regionCode: "europe-west2"},
  {apiPath: "hk", regionCode: "asia-east2"},
  {apiPath: "jp", regionCode: "asia-northeast1"},
];
for (const {apiPath, regionCode} of locations) {
  exports[apiPath] = functions
      .runWith(runtimeOpts)
      .region(regionCode)
      .https.onRequest(myip);
}
