const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  // Look for either lowercase or uppercase "authorization"
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // It should always start with "Bearer "
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Take out "Bearer" and get the token after space
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
