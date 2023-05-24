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
    await connections(); // Establish a connection to the database
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

    await connections(); // Establish a connection to the database

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
  await connections(); // Establish a connection to the database

  const secretOrPrivateKey = "mysecretkey"; // Secret key used for JWT token verification

  // Destructure the required fields from the request body
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
    allergicTo,
    gender,
  } = req.body;

  try {
    // Verify the access token using the secret key
    const decoded = jwt.verify(accessToken, secretOrPrivateKey);

    const userId = decoded.userId; // Extract the user ID from the decoded token

    // Update the user data associated with the userId in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        height,
        weight,
        levelOfActive,
        age,
        userGoal,
        calorieIntake,
        proteinIntake,
        carbsIntake,
        allergicTo,
        gender,
      },
      { new: true } // Return the updated user document
    );

    // Respond with a success status and the updated user object
    res.status(200).json({ success: true, updatedUser });
  } catch (err) {
    console.error(err); // Log any errors to the console

    // Respond with an unauthorized status and an error message
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});






router.get("/userData", async (req, res) => {
  await connections(); // Establish a connection to the database

  const secretOrPrivateKey = "mysecretkey"; // Secret key used for JWT token verification

  const accessToken = req.headers.authorization.split(" ")[1]; // Extract the access token from the authorization header

  try {
    // Verify the access token using the secret key
    const decoded = jwt.verify(accessToken, secretOrPrivateKey);

    const userId = decoded.userId; // Extract the user ID from the decoded token

    // Find the user data associated with the userId in the database
    const user = await User.findById(userId);

    // If the user is not found, respond with a not found status and an error message
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Destructure the user object to extract required fields
    const {
      height,
      weight,
      age,
      levelOfActive,
      userGoal,
      email,
      calorieIntake,
      carbsIntake,
      proteinIntake,
      allergicTo,
      gender,
    } = user;

    // Respond with a success status and the user data
    res.status(200).json({
      success: true,
      data: {
        height,
        weight,
        age,
        levelOfActive,
        userGoal,
        email,
        calorieIntake,
        carbsIntake,
        proteinIntake,
        allergicTo,
        gender,
      },
    });
  } catch (err) {
    console.error(err); // Log any errors to the console

    // Respond with an unauthorized status and an error message
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});







router.post("/saveCalendarData", async (req, res) => {
  // Establish database connection
  await connections();

  // Retrieve the token and selected recipes from the request body
  const token = req.body.token;
  const weeklyPlan = req.body.selectedRecipes;

  // Set the secret or private key for JWT verification
  const secretOrPrivateKey = "mysecretkey";

  try {
    // Verify the token using the secret or private key
    const decoded = jwt.verify(token, secretOrPrivateKey);
    const userId = decoded.userId;

    // Check if the decoded token contains a valid user ID
    if (!userId) {
      return res.status(401).send({ error: "Invalid token" });
    }

    // Update the user's selected recipes in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { weeklyPlan },
      { new: true }
    );

    // Respond with a success status and the updated user object
    res.status(200).json({ success: true, updatedUser });
    console.log(userId, weeklyPlan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});






router.get("/getCalendarData", async (req, res) => {
  await connections(); // Establish a connection to the database 

  const secretOrPrivateKey = "mysecretkey"; // Secret key used for JWT token verification

  const accessToken = req.headers.authorization.split(" ")[1]; // Extract the access token from the authorization header

  try {
    // Verify the access token using the secret key
    const decoded = jwt.verify(accessToken, secretOrPrivateKey);

    const userId = decoded.userId; // Extract the user ID from the decoded token

    // Find the user data associated with the userId in the database
    const user = await User.findById(userId);

    // If the user is not found, respond with a not found status and an error message
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { weeklyPlan } = user; // Extract the weeklyPlan field from the user object

    // Respond with a success status and the weekly plan data
    res.status(200).json({
      success: true,
      data: { weeklyPlan },
    });
  } catch (err) {
    console.error(err); // Log any errors to the console

    // Respond with an unauthorized status and an error message
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});








router.post("/saveAllergies", async (req, res) => {
  await connections(); // Establish a connection to the database (assuming connections() is a function for that)

  const token = req.body.token; // Extract the token from the request body
  const allergicTo = req.body.arrayAllergies; // Extract the array of allergies from the request body

  const secretOrPrivateKey = "mysecretkey"; // Secret key used for JWT token verification

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, secretOrPrivateKey);
    const userId = decoded.userId; // Extract the user ID from the decoded token

    if (!userId) {
      // If the user ID is not valid, respond with an unauthorized status and an error message
      return res.status(401).send({ error: "Invalid token" });
    }

    // Update the allergicTo field for the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { allergicTo },
      { new: true } // Return the updated user document
    );

    // Respond with a success status and the updated user object
    res.status(200).json({ success: true, updatedUser });
  } catch (err) {
    console.error(err); // Log any errors to the console

    // Respond with a server error status and an error message
    res.status(500).json({ success: false, message: "Server Error" });
  }
});







router.get("/getAllergies", async (req, res) => {
  await connections(); // Establish a connection to the database

  const secretOrPrivateKey = "mysecretkey"; // Secret key used for JWT token verification

  const accessToken = req.headers.authorization.split(" ")[1]; // Extract the access token from the authorization header

  try {
    // Verify the access token using the secret key
    const decoded = jwt.verify(accessToken, secretOrPrivateKey);

    const userId = decoded.userId; // Extract the user ID from the decoded token

    // Find the user data associated with the userId in the database
    const user = await User.findById(userId);

    // If the user is not found, respond with a not found status and an error message
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { allergicTo } = user; // Extract the allergicTo field from the user object

    // Respond with a success status and the allergicTo data
    res.status(200).json({
      success: true,
      data: { allergicTo },
    });
  } catch (err) {
    console.error(err); // Log any errors to the console

    // Respond with an unauthorized status and an error message
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});




//middleware in case some page need previous authorization to access it
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




router.get("/getDatabase", controllerIndex.index);

router.get("/getRecipes", (req, res) => {
  getRecipesIndex.getRecipes(req, res);
});

router.get("/getIngredients", getIngredientsIndex.getIngredients);

module.exports = router;
