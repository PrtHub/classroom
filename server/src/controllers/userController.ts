import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { AuthRequest } from "../middleware/auth";

export const createTeacher = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== "principal") {
      return res
        .status(403)
        .send({ error: "Only principals can create teacher accounts" });
    }

    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingTeacher = await User.findOne({ email });

    if (existingTeacher) {
      return res.status(400).send({ error: "Teacher already exists" });
    }

    const teacher = new User({
      email,
      password: hashedPassword,
      role: "teacher",
    });

    await teacher.save();
    res.status(201).send(teacher);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== "principal" && req.user.role !== "teacher") {
      return res.status(403).send({
        error: "Only principals and teachers can create student accounts",
      });
    }

    const { email, password } = req.body;

    const existingStudent = await User.findOne({ email });

    if (existingStudent) {
      return res.status(400).send({ error: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new User({
      email,
      password: hashedPassword,
      role: "student",
    });

    await student.save();
    res.status(201).send(student);
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