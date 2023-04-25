const mongoose = require("mongoose");

const  Schema  = mongoose.Schema;

const RecipesSchema = new Schema({
  location_id: [{ 
    type: Schema.Types.ObjectId, 
    ref: "info" }],
});


const RecipesModel = mongoose.model("recipe", RecipesSchema);

module.exports = RecipesModel;
