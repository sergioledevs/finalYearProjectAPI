const mongoose = require("mongoose");

const { Schema } = mongoose;

const BookingSchema = new Schema({
  name: {
    type: String,
    required: false
  },
  surname: {
    type: String,
    required: false
  },
  dates_booked: [{
    date_start: {
      type: Date,
      required: true
    },
    date_finish: {
      type: Date,
      required: true
    },
    date_title: {
      type: String,
      required: true
    },
  }]
});

const BookingModel = mongoose.model("reservas", BookingSchema);

module.exports = BookingModel;
