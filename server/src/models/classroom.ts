import mongoose, { Schema } from "mongoose";
import { IClassroom } from "../types";

const classroomSchema = new Schema<IClassroom>({
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  schedule: [
    {
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
});

export default mongoose.model<IClassroom>("Classroom", classroomSchema);
