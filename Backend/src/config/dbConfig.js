import mongoose from "mongoose";
import "dotenv/config";

const URL = process.env.MONGO_URI;

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(
     "mongodb://localhost:27017/hackmate_db"
    );
    console.log(`MongoDb Connected from ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default dbConnection;
