const express = require("express");
const route = express.Router();
const {
  create,
  deleteAll,
  deletes,
  findAll,
  findAllpublished,
  findOne,
  update,
} = require("../controllers/tutorialController");
const {
  isUserLoggedIn,
  adminsOnly,
} = require("../middlewares/userAuthMiddleware");

route.delete("/", adminsOnly, deleteAll);

route.post("/", create);

route.get("/", findAll);

route.get("/published", findAllpublished);

route.get("/:id", findOne);

route.put("/:id", update);

route.delete("/:id", deletes);

module.exports = route;
