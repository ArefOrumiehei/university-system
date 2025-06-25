const express = require("express");
const router = express.Router();
const { loginUser, getBalance, increaseBalance, makeReservation, getReservations, deleteReservation, signupUser, getUserInfo, updateUserProfile } = require("../controllers/apiController");

// Auth
router.post("/login", loginUser);
router.post("/signup", signupUser);

// User
router.get("/users/:userId", getUserInfo);
router.put("/users/:userId", updateUserProfile);

// Balance
router.get("/users/:userId/balance", getBalance);
router.post("/users/:userId/increase", increaseBalance);

// Food Reservation
router.get("/reservations/:userId", getReservations);
router.post("/reservations", makeReservation);
router.delete("/reservations/:userId/:date", deleteReservation);

module.exports = router;
