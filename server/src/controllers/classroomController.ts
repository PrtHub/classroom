import { Request, Response } from "express";
import Classroom from "../models/classroom";
import User from "../models/user";

export const createClassroom = async (req: Request, res: Response) => {
  try {
    const { name, schedule } = req.body;

   const existingName = await Classroom.findOne({ name });
    if (existingName) {
      return res.status(400).send({ message: "Classroom already exists" });
    }

    const classroom = new Classroom({ name, schedule });

    await classroom.save();
    res.status(201).json(classroom);
  } catch (error) {
    res.status(404).send({ message: "Error creating classroom", error });
  }
};

export const assignTeacher = async (req: Request, res: Response) => {
  try {
    const { classroomId, teacherId } = req.body;
    const classroom = await Classroom.findById(classroomId);
    const teacher = await User.findById(teacherId);

    if (!classroom || !teacher || teacher.role !== "teacher") {
      return res
        .status(404)
        .send({ message: "Classroom or teacher not found" });
    }

    const existingTeacher = await Classroom.findOne({ teacher: teacherId });

    if (existingTeacher) {
      return res
        .status(400)
        .send({ message: "Teacher already assigned to classroom" });
    }

    classroom.teacher = teacherId;
    await classroom.save();
    res.status(200).json(classroom);
  } catch (error) {
    res
      .status(404)
      .send({ message: "Error assigning teacher to classroom", error });
  }
};

export const assignStudent = async (req: Request, res: Response) => {
  try {
    const { classroomId, studentId } = req.body;
    const classroom = await Classroom.findById(classroomId);
    const student = await User.findById(studentId);

    if (!classroom || !student || student.role !== "student") {
      return res
        .status(404)
        .send({ message: "Classroom or student not found" });
    }

    if (!classroom.students.includes(studentId)) {
      classroom.students.push(studentId);
      await classroom.save();
    }

    res.status(200).json(classroom);
  } catch (error) {
    res.status(404).send({ message: "Error assigning student", error });
  }
};