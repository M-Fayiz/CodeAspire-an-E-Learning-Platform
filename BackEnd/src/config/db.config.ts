import mongoose from "mongoose";
import { env } from "./env.config";


const URL = env.MONGO_URL as string;

export const dbConnect = async () => {
  try {
    await mongoose.connect(URL);
    console.log("🗳️  DB Connected ");
  } catch (error) {
    console.log('DB ERROR :',error);
  }
};
