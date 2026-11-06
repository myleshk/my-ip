const axios = require("axios");
const {isIP} = require("node:net");

/**
 * Fetch geolocation details for an IP address from ip-api.com.
 * @param {string} ip
 * @return {Promise<object>}
 */
async function fetchGeoInfo(ip) {
  if (!isIP(ip)) {
    throw Object.assign(new Error("Invalid IP address"), {httpStatus: 400});
  }
  try {
    const response = await axios.get(
        `http://ip-api.com/json/${encodeURIComponent(ip)}`,
        {timeout: 3000},
    );
    if (!response.data || response.data.status !== "success") {
      throw new Error("Geolocation provider returned non-success data");
    }
    return response.data;
  } catch (error) {
    const timedOut = ["ECONNABORTED", "ETIMEDOUT"].includes(error.code);
    console.error("Geolocation provider request failed", {
      code: error.code || "INVALID_RESPONSE",
      upstreamStatus: error.response ? error.response.status : null,
    });
    throw Object.assign(new Error(timedOut ?
      "Geolocation provider timed out" :
      "Geolocation provider unavailable"), {
      httpStatus: timedOut ? 504 : 502,
    });
  }
}

module.exports = {
  fetchGeoInfo,
};
