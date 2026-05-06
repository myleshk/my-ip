const axios = require("axios");

/**
 * Fetch geolocation details for an IP address from ip-api.com.
 * @param {string} ip
 * @return {Promise<object>}
 */
function fetchGeoInfo(ip) {
  return axios.get(`http://ip-api.com/json/${ip}`)
      .then((response) => response.data);
}

module.exports = {
  fetchGeoInfo,
};
