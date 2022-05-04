const controller = {};
const connection = require("../dbConnection/connection");
const BookingModel = require("../models/reservas.model");

controller.index = async (req, res) => {
  try {
    await connection();
    const allBookings = await BookingModel.find();
    console.log(allBookings);
    res.send(allBookings);
  } catch (err) {
    console.error(err);
  }
};

module.exports = controller;


