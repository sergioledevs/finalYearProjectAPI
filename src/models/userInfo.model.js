const mongoose = require("mongoose");

const { Schema } = mongoose;
const RecipesSchema = require("./recipes.model")

const UserInfoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  weight:{
    type:String,
    required:false
  },
  height:{
    type:String,
    required:false
  },
  age:{
    type:String,
    required:false
  },
  levelOfActivity:{
    type:String,
    required:false
  },
  fitnessGoal:{
    type:String,
    required:false
  },
  recipesUsed:{
    type:Array,
    required:false
  },
  favoriteRecipes:{
    type:Array,
    required:false
  },
  alergicTo:{
    type:Array,
    required:false
  },
  ingredientPreference:{
    type:Array,
    required:false
  },
});


const UserInfoModel = mongoose.model("info",UserInfoSchema);

module.exports = UserInfoModel;
