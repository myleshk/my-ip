const cors = require("cors");

const corsOptions = {
  origin: function(origin, callback) {
    if (
      // localhost
      /localhost(:\d+)?$/.test(origin)||
      // myles.hk
      /myles.hk$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = cors(corsOptions);
