const mongoose = require("mongoose");

const User = mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  address: String,
  password: String,
  resetPasswordOTP:Number
});

module.exports = mongoose.model("users", User);
