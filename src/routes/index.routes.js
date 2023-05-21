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

  console.log(req.body);

  const {
    height,
    weight,
    levelOfActive,
    age,
    accessToken,
    userGoal,
    calorieIntake,
    proteinIntake,
    carbsIntake,
    allergicTo
  } = req.body;
  try {
    const decoded = jwt.verify(accessToken, secretOrPrivateKey);
    const userId = decoded.userId;

    // Update the user data associated with the userId
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { height, weight, levelOfActive, age, userGoal, calorieIntake, proteinIntake, carbsIntake, allergicTo },
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { height, weight, age, levelOfActive, userGoal, email, calorieIntake, carbsIntake, proteinIntake } = user;
    res.status(200).json({
      success: true,
      data: { height, weight, age, levelOfActive, userGoal, email, calorieIntake, carbsIntake, proteinIntake },
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

router.post("/saveCalendarData", async (req, res) => {
  await connections();
  const token = req.body.token;
  const weeklyPlan = req.body.selectedRecipes;

  const secretOrPrivateKey = "mysecretkey";

  try {
    const decoded = jwt.verify(token, secretOrPrivateKey);
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).send({ error: "Invalid token" });
    }

    // store selected recipes for user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { weeklyPlan },
      { new: true }
    );

    res.status(200).json({ success: true, updatedUser });
    console.log(userId, weeklyPlan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/getCalendarData", async (req, res) => {
  await connections();
  const secretOrPrivateKey = "mysecretkey";
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(accessToken, secretOrPrivateKey);
    const userId = decoded.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { weeklyPlan } = user;
    res.status(200).json({
      success: true,
      data: { weeklyPlan },
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

router.post("/saveAllergies", async (req, res) => {
  await connections();
  const token = req.body.token;
  const allergicTo = req.body.arrayAllergies;

  const secretOrPrivateKey = "mysecretkey";

  try {
    const decoded = jwt.verify(token, secretOrPrivateKey);
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).send({ error: "Invalid token" });
    }

    // store selected recipes for user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { allergicTo },
      { new: true }
    );

    res.status(200).json({ success: true, updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/getAllergies", async (req, res) => {
  await connections();
  const secretOrPrivateKey = "mysecretkey";
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(accessToken, secretOrPrivateKey);
    const userId = decoded.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { allergicTo } = user;
    res.status(200).json({
      success: true,
      data: { allergicTo },
    });
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

router.get("/getRecipes", (req, res) => {

  getRecipesIndex.getRecipes(req, res);
});

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
        .send({ message: `Error saving database: ${err}` });
    }
    return res.status(200).send({ booking: BookingStored });
  });
});



module.exports = router;
