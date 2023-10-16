const express = require("express");
const route = express.Router();

require("dotenv").config;

const { login, profile, register } = require("../controllers/userController");
const { isUserLoggedIn } = require("../middlewares/userAuthMiddleware");

route.post("/register", register);
route.post("/login", login);
route.get("/profile", isUserLoggedIn, profile);

module.exports = route;
