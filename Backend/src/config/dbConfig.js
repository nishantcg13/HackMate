import mongoose from "mongoose";
import "dotenv/config";

const URL = process.env.MONGO_URI || "mongodb://localhost:27017/hackmate_db";

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(URL);
    console.log(`MongoDb Connected to ${conn.connection.name} on ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

export default dbConnection;
