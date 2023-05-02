const mongoose = require("mongoose");

const { Schema } = mongoose;
const RecipesSchema = require("./recipes.model");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: {
    type: String,
    required: false,
  },
  surname: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  weight: {
    type: String,
    required: false,
  },
  height: {
    type: String,
    required: false,
  },
  age: {
    type: String,
    required: false,
  },
  levelOfActive: {
    type: String,
    required: false,
  },
  fitnessGoal: {
    type: String,
    required: false,
  },
  recipesUsed: {
    type: Array,
    required: false,
  },
  favoriteRecipes: {
    type: Array,
    required: false,
  },
  alergicTo: {
    type: Array,
    required: false,
  },
  ingredientPreference: {
    type: Array,
    required: false,
  },
});

const User = mongoose.model("info", userSchema);

module.exports = User;
