const User = require("../models/User");
const Reservation = require("../models/Reservation");


// لاگین ساده (برای مثال فقط نام کاربری و رمز عبور ساده)
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "mysecretkey"; // از .env بخون

async function loginUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "نام کاربری و رمز عبور لازم است" });
  }

  try {
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "کاربر یافت نشد" });
    } else {
      if (user.password !== password) {
        return res.status(401).json({ error: "رمز عبور اشتباه است" });
      }
    }

    // ساخت توکن
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: "7d" } // مثلاً ۷ روز اعتبار
    );

    res.json({
      message: "ورود موفق",
      userId: user._id,
      balance: user.balance,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "خطای سرور" });
  }
}

const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "همه‌ی فیلدها الزامی هستند" });
  }

  try {
    // بررسی تکراری نبودن یوزرنیم یا ایمیل
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: "کاربری با این نام یا ایمیل وجود دارد" });
    }

    const newUser = new User({
      username,
      email,
      password,
      balance: 0,
    });

    await newUser.save();

    // ساخت توکن پس از ثبت‌نام
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "ثبت‌نام موفق",
      userId: newUser._id,
      balance: newUser.balance,
      token,
    });

  } catch (err) {
    res.status(500).json({ error: "خطای سرور در ثبت‌نام" });
  }
};

// GET /users/:userId
async function getUserInfo(req, res) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "کاربر یافت نشد" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطای سرور" });
  }
}

// update profile PUT /users/:userId
async function updateUserProfile(req, res) {
  try {
    const { username, profileImage, birthDate } = req.body;

    // ساخت آبجکت برای به‌روزرسانی فقط فیلدهای موجود
    const updates = {};
    if (username && username.trim() !== "") {
      updates.username = username.trim();
    }
    if (profileImage && profileImage.trim() !== "") {
      updates.profileImage = profileImage.trim();
    }
    if (birthDate && birthDate.trim() !== "") {
      updates.birthDate = birthDate.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "هیچ داده‌ای برای به‌روزرسانی ارسال نشده است." });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updates,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "کاربر یافت نشد" });
    }

    res.json({ message: "پروفایل کاربر با موفقیت به‌روزرسانی شد", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطای سرور" });
  }
}




// گرفتن موجودی کاربر
async function getBalance(req, res) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "کاربر یافت نشد" });

    res.json({ balance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطای سرور" });
  }
}


// افزایش موجودی کاربر
async function increaseBalance(req, res) {
  const { amount, userId } = req.body;
  const user = await User.findById(userId);
  console.log(user);
  if (!user) return res.status(404).json({ error: 'کاربر پیدا نشد' });

  user.balance += amount;
  await user.save();

  res.json({ balance: user.balance });
}

// گرفتن لیست رزروهای کاربر
async function getReservations(req, res) {
  const userId = req.params.userId || req.body.userId;

  if (!userId) {
    return res.status(400).json({ error: "شناسه کاربر ارسال نشده است" });
  }

  try {
    const reservations = await Reservation.find({ userId });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: "خطای سرور" });
  }
}




const foodPrices = {
  'ماکارونی': 60000,
  'چلوکباب': 80000,
  'زرشک‌پلو': 70000,
  // Other foods
};

async function makeReservation(req, res) {
  const { userId, date, foodName, restaurant, foodPrice } = req.body;

  const price = foodPrices[foodName];
  if (!price) {
    return res.status(400).json({ error: "غذا نامعتبر است" });
  }

  try {
    const exists = await Reservation.findOne({ userId, date });
    if (exists) {
      return res.status(400).json({ error: "برای این تاریخ قبلا رزرو ثبت شده است" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "کاربر پیدا نشد" });
    }

    if (user.balance < price) {
      return res.status(400).json({ error: "موجودی کافی نیست" });
    }

    const reservation = new Reservation({ userId, date, restaurant, foodName, foodPrice });
    await reservation.save();

    user.balance -= price;
    await user.save();

    res.json({ message: "رزرو با موفقیت ثبت شد", reservation });
  } catch (err) {
    console.error("خطا در ذخیره رزرو:", err);
    res.status(500).json({ error: "خطای سرور" });
  }
}



// حذف رزرو بر اساس یوزر و تاریخ
async function deleteReservation(req, res) {
  const { userId, date } = req.params;

  try {
    const reservation = await Reservation.findOne({ userId, date });

    if (!reservation) {
      return res.status(404).json({ error: "رزرو یافت نشد" });
    }

    const refundAmount = reservation.foodPrice;
    await Reservation.deleteOne({ _id: reservation._id });

    // افزایش موجودی کاربر
    const updateResult = await User.findByIdAndUpdate(
      userId,
      { $inc: { balance: refundAmount } },
      { new: true }
    );

    console.log(">> user after update:", updateResult);

    res.json({ message: "رزرو حذف شد و مبلغ بازگردانده شد" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطای سرور" });
  }
}


module.exports = {
  loginUser,
  signupUser,
  getUserInfo,
  updateUserProfile,
  getBalance,
  increaseBalance,
  getReservations,
  makeReservation,
  deleteReservation,
};
