import express from 'express'
import { auth, authorizeRole } from '../middleware/auth';
import { assignStudent, assignTeacher, createClassroom, deleteClassroom, editClassroom, getAllClassrooms, getClassroomById } from '../controllers/classroomController';

const router = express.Router()

router.post("/create", auth, authorizeRole(['principal']), createClassroom)
router.post("/assign-teacher", auth, authorizeRole(['principal']), assignTeacher)
router.post("/assign-student", auth, authorizeRole(['principal']), assignStudent)
router.get('/', auth, authorizeRole(['principal']), getAllClassrooms);
router.get('/:id', auth, authorizeRole(['principal', 'teacher']), getClassroomById);
router.patch('/:id', auth, authorizeRole(['principal']), editClassroom);
router.delete('/:id', auth, authorizeRole(['principal']), deleteClassroom);

export default router