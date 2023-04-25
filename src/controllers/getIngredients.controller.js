const controller = {};
const connection = require("../dbConnection/connection2");
const IngredientsModel = require("../models/ingredients.model");

controller.getIngredients = async (req, res) => {
  try {
    await connection();
    const allBookings = await IngredientsModel.find();
    console.log(allBookings);
    res.send(allBookings);
  } catch (err) {
    console.error(err);
  }
};

module.exports = controller;