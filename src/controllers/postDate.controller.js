const controller = {};
const connection = require("../dbConnection/connection");
const BookingModel = require("../models/reservas.model");

controller.postDate = async (req, res) => {
  try {

    await BookingModel.findOneAndUpdate(
      { name: "David" },
      {
       name:"Antonio"
      }
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = controller;
