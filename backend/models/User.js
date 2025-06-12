const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  balance: { type: Number, default: 0 },
  birthDate: { type: Date, default: null },
  profileImage: { type: String, default: "" }
});

module.exports = mongoose.model("User", userSchema);
