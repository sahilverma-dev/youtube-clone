import mongoose from "mongoose";
import { MONGODB_URI } from "../constants/env";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGODB_URI);

    console.log(
      "MongoDB connected on:".green,
      connectionInstance.connection.host.toString().blue
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ".red);
    console.log(error);

    process.exit(1);
  }
};

export default connectDB;
