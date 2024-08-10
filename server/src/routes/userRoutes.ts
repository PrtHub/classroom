import express from 'express'
import { auth, authorizeRole } from '../middleware/auth';
import {createStudent, createTeacher, login, logout } from '../controllers/userController';

const router = express.Router()

router.post('/login', login),
router.post('/logout', logout),
router.post('/register-teacher', auth, authorizeRole(['principal']), createTeacher)
router.post('/register-student', auth, authorizeRole(['principal', 'teacher']), createStudent)

export default router