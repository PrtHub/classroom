import express from 'express'
import { auth, authorizeRole } from '../middleware/auth';
import { assignStudent, assignTeacher, createClassroom } from '../controllers/classroomController';

const router = express.Router()

router.post("/create", auth, authorizeRole(['principal']), createClassroom)
router.post("/assign-teacher", auth, authorizeRole(['principal']), assignTeacher)
router.post("/assign-student", auth, authorizeRole(['principal']), assignStudent)

export default router