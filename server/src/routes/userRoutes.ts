import express from 'express'
import { auth, authorizeRole } from '../middleware/auth';
import { deleteStudent, deleteTeacher, editStudent, editTeacher, getAllStudents, getAllStudentsWithClassrooms, getAllTeachers, getClassroomForStudent, getStudentsForClassroom, login, logout, registerUser } from '../controllers/userController';

const router = express.Router()

router.post('/login', login),
router.post('/logout', logout),
router.post('/register', auth, registerUser);
router.get('/teachers', auth, authorizeRole(['principal']), getAllTeachers);
router.get('/students', auth, authorizeRole(['principal', 'teacher']), getAllStudents);
router.get('/classroom/:id/students', auth, authorizeRole(['teacher']), getStudentsForClassroom);
router.get('/student/classroom', auth, authorizeRole(['student']), getClassroomForStudent);
router.patch('/teachers/:id', auth, authorizeRole(['principal']), editTeacher);
router.patch('/students/:id', auth, authorizeRole(['principal', 'teacher']), editStudent);
router.delete('/teachers/:id', auth, authorizeRole(['principal']), deleteTeacher);
router.delete('/students/:id', auth, authorizeRole(['principal', 'teacher']), deleteStudent);
router.get('/students-with-classrooms', auth, authorizeRole(['teacher']), getAllStudentsWithClassrooms);

export default router