import express from 'express'
import { auth, authorizeRole } from '../middleware/auth';
import {createStudent, createTeacher, deleteStudent, deleteTeacher, editStudent, editTeacher, getAllStudents, getAllTeachers, getClassroomForStudent, getStudentsForClassroom, login, logout } from '../controllers/userController';

const router = express.Router()

router.post('/login', login),
router.post('/logout', logout),
router.post('/register-teacher', auth, authorizeRole(['principal']), createTeacher)
router.post('/register-student', auth, authorizeRole(['principal', 'teacher']), createStudent)
router.get('/teachers', auth, authorizeRole(['principal']), getAllTeachers);
router.get('/students', auth, authorizeRole(['principal']), getAllStudents);
router.get('/classroom/:id/students', auth, authorizeRole(['teacher']), getStudentsForClassroom);
router.get('/student/classroom', auth, authorizeRole(['student']), getClassroomForStudent);
router.patch('/teachers/:id', auth, authorizeRole(['principal']), editTeacher);
router.patch('/students/:id', auth, authorizeRole(['principal', 'teacher']), editStudent);
router.delete('/teachers/:id', auth, authorizeRole(['principal']), deleteTeacher);
router.delete('/students/:id', auth, authorizeRole(['principal', 'teacher']), deleteStudent);

export default router