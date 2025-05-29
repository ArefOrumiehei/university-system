const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://FoodAppAdmin:FoodAppAdmin1404@cluster0.wlxgq.mongodb.net/foodAppDB?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
  }
}

module.exports = connectDB;
