import { Request, Response } from "express";
import Timetable from "../models/timetable";
import Classroom from "../models/classroom";
import { AuthRequest } from "../middleware/auth";
import { CreateTimetableRequestBody } from "../types";

export interface CreateTimetableRequest extends Request {
  body: CreateTimetableRequestBody;
}

export const createTimetable = async (
  req: CreateTimetableRequest,
  res: Response
) => {
  try {
    const { classroomId, subjects } = req.body;
    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      return res.status(400).json({ message: "Invalid classroom" });
    }

    // Check for overlapping periods
    subjects.sort(
      (a: any, b: any) =>
        a.day.localeCompare(b.day) || a.startTime.localeCompare(b.startTime)
    );
    for (let i = 1; i < subjects.length; i++) {
      if (
        subjects[i].day === subjects[i - 1].day &&
        subjects[i].startTime < subjects[i - 1].endTime
      ) {
        return res
          .status(400)
          .json({ message: "Overlapping periods detected" });
      }
    }

    let timetable = await Timetable.findOne({ classroom: classroomId });

    if (timetable) {
      const newSubjects = subjects.filter((newSubject) => {
        return !timetable!.subjects.some(
          (existingSubject) =>
            existingSubject.name === newSubject.name &&
            existingSubject.day === newSubject.day &&
            existingSubject.startTime === newSubject.startTime &&
            existingSubject.endTime === newSubject.endTime
        );
      });

      timetable.subjects.push(...newSubjects);
      await timetable.save();
    } else {
      timetable = new Timetable({ classroom: classroomId, subjects });
      await timetable.save();
    }
    res.status(201).json(timetable);
  } catch (error) {
    res.status(400).json({ message: "Error creating timetable", error });
  }
};

export const getTimetableForClassroom = async (req: Request, res: Response) => {
  try {
    const classroomId = req.params.id;
    const timetable = await Timetable.findOne({ classroom: classroomId });
    if (!timetable) {
      return res
        .status(404)
        .json({ message: "Timetable not found for this classroom" });
    }
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: "Error fetching timetable", error });
  }
};

export const editTimetable = async (req: Request, res: Response) => {
  try {
    const classroomId = req.params.id;
    const updates = req.body;
    const timetable = await Timetable.findOneAndUpdate(
      { classroom: classroomId },
      updates,
      { new: true }
    );
    if (!timetable) {
      return res
        .status(404)
        .json({ message: "Timetable not found for this classroom" });
    }
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: "Error editing timetable", error });
  }
};

export const getStudentTimetable = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user._id;
    const classroom = await Classroom.findOne({ students: studentId });

    if (!classroom) {
      return res
        .status(404)
        .json({ message: "Classroom not found for this student" });
    }

    const timetable = await Timetable.findOne({ classroom: classroom._id });

    if (!timetable) {
      return res
        .status(404)
        .json({ message: "Timetable not found for this classroom" });
    }

    res.status(200).json(timetable);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching student timetable", error });
  }
};
