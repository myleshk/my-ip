const functions = require("firebase-functions");
const api = require("./api.js");

exports.api = functions.https.onRequest(api);
