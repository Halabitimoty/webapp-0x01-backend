const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config;

const { userCollection } = require("../schema/userSchema");
/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 *
 * REGISTER CONTROLLER
 */
const register = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "User Details Cannot be Empty!",
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashpassword = bcrypt.hashSync(req.body.password, salt);
  const role = req.body.role;

  try {
    await userCollection.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashpassword,
      role: role.toLowerCase(),
    });
    res.status(201).send({ message: "Created Successfully" });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while Registrying.",
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 *
 * LOGIN CONTROLLER
 */
const login = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "User Details Cannot be Empty!",
    });
  }

  const { email, password } = req.body;

  try {
    const userDetail = await userCollection.findOne({ email });

    if (!userDetail) return res.status(404).send("user-not-found");

    const doesPasswordMatch = bcrypt.compareSync(password, userDetail.password);

    if (!doesPasswordMatch) return res.status(400).send("Invalid-Credentials");

    const { email: userEmail, _id, role } = userDetail;

    const token = jwt.sign(
      {
        email: userEmail,
        userId: _id,
        role: role,
      },
      process.env.secret
    );

    res.send({
      message: "Sign in Succesfull",
      token,
      id: _id,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while Logging In.",
    });
  }
};

const profile = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "User Details Cannot be Empty!",
    });
  }

  try {
    const { userId } = req.decoded;
    const user = await userCollection.findById(userId, "-password");
    res.send({ user: user, userId });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while Logging In.",
    });
  }
};

module.exports = {
  register,
  login,
  profile,
};
