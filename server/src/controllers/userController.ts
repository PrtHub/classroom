import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { AuthRequest } from "../middleware/auth";
import Classroom from "../models/classroom";

export const registerUser = async (req: AuthRequest, res: Response) => {
  try {
    const {fullName, email, password, role } = req.body;

    if (role === 'teacher' && req.user?.role !== 'principal') {
      return res.status(403).send({ error: "Only principals can create teacher accounts" });
    }
    if (role === 'student' && !['principal', 'teacher'].includes(req.user?.role || '')) {
      return res.status(403).send({ error: "Only principals and teachers can create student accounts" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: `User with role ${role} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ error: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({ error: "Invalid login credentials" });
    }

    const accesstoken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.send({ user, accesstoken, refreshToken });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(400).send({ error: "user not found" });
    }

    user.refreshToken = "";
    await user.save();
    res.status(200).send({ message: "logged out" });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await User.find({ role: 'teacher' });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving teachers', error });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await User.find({ role: 'student' });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students', error });
  }
};

export const getStudentsForClassroom = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.findById(req.params.id).populate('students');
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.status(200).json(classroom.students);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students', error });
  }
};

export const getClassroomForStudent = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user._id;
    const classroom = await Classroom.findOne({ students: studentId });
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found for student' });
    }
    res.status(200).json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving classroom for student', error });
  }
}

export const editTeacher = async (req: Request, res: Response) => {
  try {
    const teacherId = req.params.id;
    const updates = req.body;
    const teacher = await User.findByIdAndUpdate(teacherId, updates, { new: true });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error editing teacher', error });
  }
};

export const editStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const updates = req.body;
    const student = await User.findByIdAndUpdate(studentId, updates, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error editing student', error });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const teacherId = req.params.id;
    const teacher = await User.findByIdAndDelete(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher', error });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const student = await User.findByIdAndDelete(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error });
  }
};