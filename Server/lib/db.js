import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

//function to connect to mongoDB
export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/ProjectIX`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
