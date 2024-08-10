import mongoose, { Schema } from "mongoose";
import { ITimetable } from "../types";

const TimeTableSchema = new mongoose.Schema<ITimetable>({
    classroom: {
        type: Schema.Types.ObjectId, ref: 'Classroom', required: true
    },
    subjects: [
        {
            name: {
                type: String,
                required: true,
            },
            day: {
                type: String,
                required: true,
            },
            startTime: {
                type: String,
                required: true,
            },
            endTime: {
                type: String,
                required: true
            }
        }
    ]
});

export default mongoose.model<ITimetable>("Timetable", TimeTableSchema)