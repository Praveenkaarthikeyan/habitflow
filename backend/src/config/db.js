import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  // Fail after 8 seconds instead of hanging forever if Atlas can't be reached.
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}