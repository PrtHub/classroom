import { useState, useEffect } from "react";
import api from "../services/api";
import { Classroom, User } from "../types";
import { Plus } from "lucide-react";
import Dialog from "./Dialog"; // You'll need to create this component

const PrincipalView = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateClassroomDialogOpen, setIsCreateClassroomDialogOpen] = useState(false);
  const [isAssignTeacherDialogOpen, setIsAssignTeacherDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentClassroom, setCurrentClassroom] = useState(null);

  useEffect(() => {
    fetchTeachers();
    fetchStudents();
    fetchClassrooms();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/user/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/user/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const response = await api.get("/classroom");
      setClassrooms(response.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  const handleEditUser = async (id, data, role) => {
    try {
      if (role === 'teacher') {
        await api.patch(`/user/teachers/${id}`, data);
        fetchTeachers();
      } else if (role === 'student') {
        await api.patch(`/user/students/${id}`, data);
        fetchStudents();
      }
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  const handleDeleteUser = async (id, role) => {
    try {
      if (role === 'teacher') {
        await api.delete(`/user/teachers/${id}`);
        fetchTeachers();
      } else if (role === 'student') {
        await api.delete(`/user/students/${id}`);
        fetchStudents();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCreateClassroom = async (data) => {
    try {
      await api.post('/classroom/create', data);
      fetchClassrooms();
      setIsCreateClassroomDialogOpen(false);
    } catch (error) {
      console.error('Error creating classroom:', error);
    }
  };

  const handleAssignTeacher = async (teacherId, classroomId) => {
    try {
      await api.post('/classroom/assign-teacher', { teacherId, classroomId });
      fetchTeachers();
      fetchClassrooms();
      setIsAssignTeacherDialogOpen(false);
    } catch (error) {
      console.error('Error assigning teacher:', error);
    }
  };

  return (
    <div className="w-full flex-1 ">
      <h2 className="text-2xl font-semibold mb-10 text-white">
        Principal Dashboard
      </h2>

      <section className="w-full mb-10 flex flex-col gap-2">
        <h3 className="text-xl font-medium mb-2 text-white">Teachers</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="text-white">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id} className="text-gray-1">
                <td className="border border-gray-300 p-2 text-center">{teacher.fullName}</td>
                <td className="border border-gray-300 p-2 text-center">{teacher.email}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => {
                      setCurrentUser({...teacher, role: 'teacher'});
                      setIsEditDialogOpen(true);
                    }}
                    className="mr-2 text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(teacher._id, 'teacher')}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-10 w-full flex flex-col gap-2">
        <h3 className="text-xl font-medium mb-2 text-white">Students</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="text-white">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="text-gray-1">
                <td className="border border-gray-300 p-2 text-center">{student.fullName}</td>
                <td className="border border-gray-300 p-2 text-center">{student.email}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => {
                      setCurrentUser({...student, role: 'student'});
                      setIsEditDialogOpen(true);
                    }}
                    className="mr-2 text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(student._id, 'student')}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <div className="w-full flex justify-between items-center gap-10">
          <h3 className="text-xl font-medium mb-2 text-white">Classrooms</h3>
          <button
            onClick={() => setIsCreateClassroomDialogOpen(true)}
            className="bg-green-1 text-white px-4 py-2 rounded mb-4 font-semibold"
          >
            Create Classroom
          </button>
        </div>
        <ul>
          {classrooms.map((classroom) => (
            <li key={classroom._id} className="mb-2 text-white">
              {classroom.name} -
              <button
                onClick={() => {
                  setCurrentClassroom(classroom);
                  setIsAssignTeacherDialogOpen(true);
                }}
                className="ml-2 text-blue-500"
              >
                Assign Teacher
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Edit User Dialog */}
      <Dialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Edit {currentUser?.role === 'teacher' ? 'Teacher' : 'Student'}</h2>
        {currentUser && (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleEditUser(currentUser._id, {
              fullName: currentUser.fullName,
              email: currentUser.email
            }, currentUser.role);
          }}>
            <input
              type="text"
              value={currentUser.fullName}
              onChange={(e) => setCurrentUser({...currentUser, fullName: e.target.value})}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="email"
              value={currentUser.email}
              onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
              className="w-full p-2 mb-4 border rounded"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </form>
        )}
      </Dialog>

      {/* Create Classroom Dialog */}
      <Dialog isOpen={isCreateClassroomDialogOpen} onClose={() => setIsCreateClassroomDialogOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Create Classroom</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleCreateClassroom({
            name: formData.get('name'),
          });
        }}>
          <input name="name" type="text" placeholder="Classroom Name" required className="w-full p-2 mb-4 border rounded" />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Create</button>
        </form>
      </Dialog>

      {/* Assign Teacher Dialog */}
      <Dialog isOpen={isAssignTeacherDialogOpen} onClose={() => setIsAssignTeacherDialogOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Assign Teacher to {currentClassroom?.name}</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleAssignTeacher(formData.get('teacherId'), currentClassroom._id);
        }}>
          <select name="teacherId" required className="w-full p-2 mb-4 border rounded">
            <option value="">Select a teacher</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>{teacher.fullName}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Assign</button>
        </form>
      </Dialog>
    </div>
  );
};

export default PrincipalView;