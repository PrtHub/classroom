# Classroom Management System

A full-stack web application designed to manage classroom activities efficiently, with role-based access for Principals, Teachers, and Students.

## Features

### User Roles
1. **Principal**
   - Create classrooms with specified schedules.
   - Assign teachers and students to classrooms.
   - Manage teacher and student accounts.

2. **Teacher**
   - Manage students within their assigned classroom.
   - Create and manage the timetable for their classroom.

3. **Student**
   - View their classroom timetable.
   - Access details of fellow students in their classroom.

### Login/Signup Process
- A default Principal account is created at app start:
  - **Email:** principal@classroom.com
  - **Password:** Admin
- Principals can create accounts for Teachers and Students.

### Classroom Management
- Classrooms are created with a name, start time, end time, and the days in session.
- Timetables are created by Teachers within the classroom's schedule.

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express, MongoDB, TypeScript

## Installation

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up environment variables.
4. Start the backend: `npm run dev` for development or `npm start` for production.
5. Start the frontend: `npm run dev`.

## License

This project is licensed under the MIT License.
