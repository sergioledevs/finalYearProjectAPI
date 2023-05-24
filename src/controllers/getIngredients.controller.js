const controller = {};
const connection = require("../dbConnection/connection2");
const IngredientsModel = require("../models/ingredients.model");

controller.getIngredients = async (req, res) => {
  try {
    await connection();
    const allIngredients = await IngredientsModel.find();
    res.send(allIngredients);
  } catch (err) {
    console.error(err);
  }
};

module.exports = controller;