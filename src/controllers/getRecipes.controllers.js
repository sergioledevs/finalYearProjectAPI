const controller = {};
const connection = require("../dbConnection/connection2");
const RecipesModel = require("../models/recipes.model");

controller.getRecipes = async (req, res) => {
  try {
    await connection();
    const recipes = await RecipesModel.aggregate([
      // Perform a left outer join with the users collection to get the user's info
      {
        '$lookup': {
          'from': 'ingredients', 
          'localField': 'ingredientId', 
          'foreignField': '_id', 
          'as': 'ingredients',
        },
      },
    ])
    res.send(recipes);
  } catch (err) {
    console.error(err);
  }
};

module.exports = controller;