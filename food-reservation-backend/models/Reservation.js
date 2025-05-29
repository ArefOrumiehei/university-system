const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  foodName: { type: String, required: true },
  foodPrice: { type: Number, required: true },
  restaurant: { type: String, required: true },
  date: { type: String, required: true } // e.g. "2025-05-30"
});

module.exports = mongoose.model("Reservation", ReservationSchema);
