import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return new Error("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      _id: string;
    };
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};


export const authorizeRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).send({ error: 'Access denied.' });
        }
        next()
    }
}