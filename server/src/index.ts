import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import classroomRoutes from "./routes/classroomRoutes";
import timetableRoutes from "./routes/timetableRoutes";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/api/user", userRoutes);
app.use("/api/classroom", classroomRoutes);
app.use("/api/timetable", timetableRoutes);


const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});