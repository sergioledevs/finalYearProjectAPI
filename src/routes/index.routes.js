const express = require("express");
const { connection } = require("mongoose");
const router = express.Router();
const connections = require("../dbConnection/connection");

const controllerIndex = require("../controllers/index.controllers");
const controllerPostDate = require("../controllers/postDate.controller");
const BookingModel = require("../models/reservas.model");

router.get("/getDatabase", controllerIndex.index);

router.post("/getDatabase", (req, res) => {
  console.log(req.body);

  let booking = new BookingModel();

  let name = booking.name;

  booking.name = req.body.name;
  booking.surname = req.body.surname;

  booking.save((err, BookingStored) => {
    if (err) {
      return res
        .status(500)
        .send({ message: `Error al salvar la base de datos: ${err}` });
    }
    return res.status(200).send({ booking: BookingStored });
  });
});

router.post("/postDate", async (req, res) => {
  try {
    const updateDocument = {
      $set: { dates_booked: "dateTitle" },
    };
    await connections();
    await BookingModel.findOneAndUpdate({ name: req.name }, { updateDocument });
    return res.status(200).send("success");
  } catch (err) {
    console.error(err);
  }
});

router.put("/personalInfo", async (req, res) => {
  try {
    console.log({ body: req.body });
    await BookingModel.findOneAndUpdate(
      { name: req.body.previousName },
      {
        name: req.body.newName,
      }
    );
    return res.status(200).send({ previousName: "fede", newName: "jose" });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
