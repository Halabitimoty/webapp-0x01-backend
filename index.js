const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const tutorialRoute = require("./app/routes/tutorialRoute");
const userAuth = require("./app/routes/userRoutes");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 4001;
const corsOptions = {
  origin: "http://localhost:3000",
};

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Connected to MongoDB Successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:");
    process.exit();
  });

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/home", userAuth);
app.use("/api/tutorials", tutorialRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to WEB APP",
  });
});

app.listen(PORT, () => {
  console.log(`Server Started Succefully http://localhost:${PORT}`);
});
