const mongoose = require("mongoose");

const { Schema } = mongoose;

const RecipesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  protein: {
    type: String,
    required: true
  },
  carbs: {
    type: String,
    required: true
  },
  calories: {
    type: String,
    required: true
  },
});

RecipesSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const RecipesModel = mongoose.model("ingredients", RecipesSchema);

module.exports = RecipesModel;
