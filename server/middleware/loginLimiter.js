const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
  // 1 minute
  windowMs: 60 * 1000,
  // Limit each IP to 5 login requests per `window` per minute
  max: 5,
  message: {
    message:
      "Too many login attempts from this IP, please try again after a 60 second pause",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  // Return rate limit info in the `RateLimit-*` headers
  standardHeaders: true,
  // Disable the `X-RateLimit-*` headers
  legacyHeaders: false,
});

module.exports = loginLimiter;
