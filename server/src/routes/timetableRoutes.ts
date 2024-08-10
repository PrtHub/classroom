import express from 'express'
import { auth, authorizeRole } from '../middleware/auth';
import { createTimetable, editTimetable, getTimetableForClassroom } from '../controllers/timetableController';

const router = express.Router()

router.post("/create", auth, authorizeRole(['teacher']), createTimetable)
router.get('/classrooms/:id/timetable', auth, authorizeRole(['teacher', 'student']), getTimetableForClassroom);
router.patch('/classrooms/:id/timetable', auth, authorizeRole(['principal', 'teacher']), editTimetable);

export default router