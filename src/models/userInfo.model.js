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
  calorieIntake: {
    type: String,
    required: false,
  },
  userGoal: {
    type: String,
    required: false,
  },
  proteinIntake: {
    type: String,
    required: false,
  },
  carbsIntake: {
    type: String,
    required: false,
  },
  weeklyPlan: {
    type: Array,
    required: false,
  },
  allergicTo: {
    type: Array,
    required: false,
  },
  
});

const User = mongoose.model("info", userSchema);

module.exports = User;
