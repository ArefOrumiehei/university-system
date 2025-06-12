const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// وارد کردن مسیر ها
app.use("/api", require("./routes/api"));



const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
