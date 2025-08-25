const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

connectDB();

app.use("/api", require("./routes/api"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
