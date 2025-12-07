import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2,  // Maintain at least 2 connections
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
