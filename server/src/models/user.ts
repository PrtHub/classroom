import mongoose from "mongoose";
import { IUser } from "../types";

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["principal", "teacher", "student"],
    required: true,
  },
  refreshToken: {
    type: String
  }
});

export default mongoose.model<IUser>("User", UserSchema);