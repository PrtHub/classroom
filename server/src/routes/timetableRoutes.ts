import express from 'express'
import { auth, authorizeRole } from '../middleware/auth';
import { createTimetable } from '../controllers/timetableController';

const router = express.Router()

router.post("/create", auth, authorizeRole(['teacher']), createTimetable)

export default router