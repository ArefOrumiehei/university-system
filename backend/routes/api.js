const express = require("express");
const router = express.Router();
const { loginUser, getBalance, increaseBalance, makeReservation, getReservations, deleteReservation, signupUser, getUserInfo, updateUserProfile } = require("../controllers/apiController");

// ورود
router.post("/login", loginUser);
router.post("/signup", signupUser);


router.get("/users/:userId", getUserInfo);
router.put("/users/:userId", updateUserProfile);

// موجودی
router.get("/users/:userId/balance", getBalance);
router.post("/users/:userId/increase", increaseBalance);

// رزرو غذا
router.get("/reservations/:userId", getReservations);
router.post("/reservations", makeReservation);
router.delete("/reservations/:userId/:date", deleteReservation);

module.exports = router;
