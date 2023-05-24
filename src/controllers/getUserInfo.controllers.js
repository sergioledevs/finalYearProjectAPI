const controller = {};
const connection = require("../dbConnection/connection2");
const UserModel = require("../models/userInfo.model");

controller.index = async (req, res) => {
  try {
    await connection();
    const userInfo = await UserModel.find();
    res.send(userInfo);
  } catch (err) {
    console.error(err);
  }
};

module.exports = controller;


