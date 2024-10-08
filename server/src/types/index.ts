import { Schema, Types } from "mongoose";

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  role: "principal" | "teacher" | "student";
  refreshToken?: string 
}

export interface IClassroom {
  _id: string;
  name: string;
  teacher: Schema.Types.ObjectId;
  students: Schema.Types.ObjectId[];
  schedule: [{
    day: string;
    startTime: string;
    endTime: string
  }]
}

export interface ITimetable {
  _id: string;
  classroom: Schema.Types.ObjectId;
  subjects: {
    name: string;
    day: string;
    startTime: string;
    endTime: string;
  }[];
}


interface Subject {
  name: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface CreateTimetableRequestBody {
  classroomId: Types.ObjectId;
  subjects: Subject[];
}