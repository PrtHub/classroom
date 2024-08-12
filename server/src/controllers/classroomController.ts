import { Request, Response } from "express";
import Classroom from "../models/classroom";
import User from "../models/user";
import { AuthRequest } from "../middleware/auth";

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

    const existingStudent = await Classroom.findOne({ teacher: studentId });
    if (existingStudent) {
      return res
        .status(400)
        .send({ message: "Teacher already assigned to classroom" });
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

export const getAllClassrooms = async (req: Request, res: Response) => {
  try {
    const classrooms = await Classroom.find();
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classrooms', error });
  }
};

export const getClassroomById = async (req: Request, res: Response) => {
  try {
    const classroomId = req.params.id;
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classroom', error });
  }
};

export const editClassroom = async (req: Request, res: Response) => {
  try {
    const classroomId = req.params.id;
    const updates = req.body;
    const classroom = await Classroom.findByIdAndUpdate(classroomId, updates, { new: true });
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Error editing classroom', error });
  }
};

export const deleteClassroom = async (req: Request, res: Response) => {
  try {
    const classroomId = req.params.id;
    const classroom = await Classroom.findByIdAndDelete(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting classroom', error });
  }
};

export const getTeacherClassrooms = async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user._id;
    const classrooms = await Classroom.find({ teacher: teacherId })
      .populate('students', 'fullName email')
      .populate('teacher', 'fullName email');
    
    if (!classrooms.length) {
      return res.status(404).json({ message: 'No classrooms assigned to this teacher' });
    }
    
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher classrooms', error });
  }
};

export const getStudentClassroom = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user._id;
    const classroom = await Classroom.find({ students: studentId })
      .populate('students', 'fullName email')
      .populate('teacher', 'fullName email');

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found for this student' });
    }

    res.status(200).json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student classroom', error });
  }
};