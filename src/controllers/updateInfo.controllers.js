const controller = {};
const connection = require("../dbConnection/connection");
const BookingModel = require("../models/reservas.model");

controller.updateInfo = async (req, res) => {
  try {

    await BookingModel.findOneAndUpdate(
      req.name,
      {
       name:"Antonio"
      }
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = controller;