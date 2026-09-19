import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn("⚠️  MONGO_URI not set — skipping database connection.");
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("============== MONGODB ERROR ==============");
    console.error("Message:", error.message);
    console.error("===========================================");
    console.warn("Server will continue running without a database connection.");
  }
}