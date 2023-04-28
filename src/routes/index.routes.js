const express = require("express");
const { connection } = require("mongoose");
const router = express.Router();
const connections = require("../dbConnection/connection");
const auth0 = require('auth0');

const controllerIndex = require("../controllers/getUserInfo.controllers");
const getRecipesIndex = require("../controllers/getRecipes.controllers");
const getIngredientsIndex= require("../controllers/getIngredients.controller")
const UserInfoModel = require("../models/userInfo.model");
const RecipesModel = require("../models/recipes.model");

router.get("/getDatabase", controllerIndex.index);

router.get("/getRecipes", getRecipesIndex.getRecipes);

router.get("/getIngredients", getIngredientsIndex.getIngredients);

router.post("/getDatabase", (req, res) => {
  console.log(req.body);

  let booking = new UserInfoModel();
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

const auth0Middleware = new auth0.ManagementClient({
  domain: 'dev-s016gihn6cxe73pi.eu.auth0.com',
  clientId: 't7lApWOLfYunn0Yd4rOXEtG9dYnM9vM4',
  clientSecret: 'seyb2qec8-RYMeGkZyGbLlwanLV3d_Inn95yKrJaBRqOW5aB4L5g-Dg4Nc-7f3r4',
  scope: 'sergiusgg01@gmail.com',
});

router.patch('/api/user/:userId', auth0Middleware, async (req, res) => {
  const userId = req.params.userId;
  const { weight, height, levelOfActivity, age, fitnessGoal } = req.body;

  try {
    // Update user profile in Auth0
    await req.auth0.updateUser({
      id: userId,
      user_metadata: { weight, height, levelOfActivity, age, fitnessGoal },
    });

    // Update user profile in database (if using one)
    // ...

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
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
