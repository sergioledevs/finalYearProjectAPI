const express = require("express");
const { connection } = require("mongoose");
const router = express.Router();
const connections = require("../dbConnection/connection2");
const { ManagementClient } = require("auth0");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const controllerIndex = require("../controllers/getUserInfo.controllers");
const getRecipesIndex = require("../controllers/getRecipes.controllers");
const getIngredientsIndex = require("../controllers/getIngredients.controller");
const User = require("../models/userInfo.model");
const RecipesModel = require("../models/recipes.model");

router.post("/register", async (req, res) => {
  try {
    await connections();
    const { email, password, confirmPassword } = req.body;

    console.log(req.body);
    console.log(password);

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      console.log("user doesnt exist");
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    // Generate JSON Web Token
    const secretOrPrivateKey = "mysecretkey";
    const token = jwt.sign({ userId: newUser._id }, secretOrPrivateKey);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    await connections();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JSON Web Token
    const secretOrPrivateKey = "mysecretkey";
    const token = jwt.sign({ userId: user._id }, secretOrPrivateKey);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/logout", (req, res) => {
  const secretOrPrivateKey = "mysecretkey";
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, secretOrPrivateKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }
    // Clear token from client-side storage
    res.clearCookie("token");
    res.status(200).send({ message: "Logged out successfully" });
  });
});

router.post("/userData", async (req, res) => {
  await connections();
  const secretOrPrivateKey = "mysecretkey";

  console.log(req.body)

  const { height, weight, levelOfActive, age, accessToken } = req.body;
  try {
    const decoded = jwt.verify(accessToken, secretOrPrivateKey);
    const userId = decoded.userId;

    // Update the user data associated with the userId
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { height, weight, levelOfActive, age },
      { new: true }
    );

    res.status(200).json({ success: true, updatedUser });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

router.get("/userData", async (req, res) => {
  await connections();
  const secretOrPrivateKey = "mysecretkey";
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(accessToken, secretOrPrivateKey);
    const userId = decoded.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const { height, weight, age, levelOfActive, email } = user;
    console.log(levelOfActive)
    res.status(200).json({ success: true, data: { height, weight, age, levelOfActive, email } });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Authorization denied" });
  }

  const secretOrPrivateKey = "mysecretkey";

  try {
    const decoded = jwt.verify(token, secretOrPrivateKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

router.get("/getDatabase", authMiddleware, controllerIndex.index);

router.get("/getRecipes", authMiddleware, getRecipesIndex.getRecipes);

router.get(
  "/getIngredients",
  authMiddleware,
  getIngredientsIndex.getIngredients
);

router.post("/getDatabase", (req, res) => {
  console.log(req.body);

  let booking = new User();
  let hello = new RecipesModel();

  booking.weight = req.body.weight;
  booking.height = req.body.height;
  booking.levelOfActivity = req.body.levelOfActive;
  booking.age = req.body.age;
  booking.fitnessGoal = req.body.userGoal;

  booking.save((err, BookingStored) => {
    if (err) {
      return res
        .status(500)
        .send({ message: `Error al salvar la base de datos: ${err}` });
    }
    return res.status(200).send({ booking: BookingStored });
  });
});

router.post("/postDate", async (req, res) => {
  try {
    const updateDocument = {
      $set: { dates_booked: "dateTitle" },
    };
    await connections();
    await BookingModel.findOneAndUpdate({ name: req.name }, { updateDocument });
    return res.status(200).send("success");
  } catch (err) {
    console.error(err);
  }
});

router.put("/personalInfo", async (req, res) => {
  try {
    console.log({ body: req.body });
    await BookingModel.findOneAndUpdate(
      { name: req.body.previousName },
      {
        name: req.body.newName,
      }
    );
    return res.status(200).send({ previousName: "fede", newName: "jose" });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
