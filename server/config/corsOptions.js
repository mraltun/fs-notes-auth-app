// External list of urls
const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  // Access-Control-Allow-Origin header
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // First argument is error, second is the allowed boolean
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  // Access-Control-Allow-Credentials header.
  credentials: true,
  // Status code to use for successful OPTIONS requests. 204 is bad for old browsers
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
