const jwt = require("jsonwebtoken");

require("dotenv").config;

function isUserLoggedIn(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send("no-authorization-header");
    return;
  }

  const value = authHeader.split(" ");
  const tokenType = value[0];
  const tokenValue = value[1];

  if (tokenType === "Bearer") {
    try {
      const decoded = jwt.verify(tokenValue, process.env.secret);
      req.decoded = decoded;
      next();
    } catch (error) {
      res.status(401).send("not-authorised");
    }
    return;
  }
}

function adminsOnly(req, res, next) {
  if (req.decoded.role === "admin") {
    next();
  } else {
    res.status(401).send("You are not an Admin!!!");
  }
}

module.exports = {
  isUserLoggedIn,
  adminsOnly,
};
