import dotenv from 'dotenv'
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/user";

dotenv.config()

const initializeDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("Connected to MongoDB");

    const existingPrinciple = await User.findOne({
      email: "principal@classroom.com",
    });

    if (!existingPrinciple) {
      const hashedPassword = await bcrypt.hash("Admin", 10);
      const principal = new User({
        name: "Principal",
        email: "principal@classroom.com",
        password: hashedPassword,
        role: "principal",
      });

      await principal.save();
      console.log('Principal account created');
    } else {
      console.log('Principal account already exists');
    }

    mongoose.disconnect()
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initializeDB()