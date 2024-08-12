import { useState, useEffect } from "react";
import api from "../services/api";
import { Classroom, User } from "../types";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import Dialog from "../components/Dialog";

interface Teacher extends User {
  _id: string;
  fullName: string;
  email: string;
}

interface Student extends User {
  _id: string;
  fullName: string;
  email: string;
}

interface CurrentUser extends User {
  role: "teacher" | "student";
}

interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
}

interface ClassroomData {
  name: string;
  schedule: ScheduleItem[];
}

const PrincipalView = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isCreateClassroomDialogOpen, setIsCreateClassroomDialogOpen] =
    useState<boolean>(false);
  const [isAssignTeacherDialogOpen, setIsAssignTeacherDialogOpen] =
    useState<boolean>(false);
  const [isAssignStudentDialogOpen, setIsAssignStudentDialogOpen] =
    useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [currentClassroom, setCurrentClassroom] = useState<Classroom | null>(
    null
  );
  const [newClassroom, setNewClassroom] = useState<ClassroomData>({
    name: "",
    schedule: [
      { day: "Monday", startTime: "", endTime: "" },
      { day: "Tuesday", startTime: "", endTime: "" },
      { day: "Wednesday", startTime: "", endTime: "" },
      { day: "Thursday", startTime: "", endTime: "" },
      { day: "Friday", startTime: "", endTime: "" },
      { day: "Saturday", startTime: "", endTime: "" },
    ],
  });

  useEffect(() => {
    fetchTeachers();
    fetchStudents();
    fetchClassrooms();
  }, []);

  const fetchTeachers = async (): Promise<void> => {
    try {
      const response = await api.get<Teacher[]>("/user/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchStudents = async (): Promise<void> => {
    try {
      const response = await api.get<Student[]>("/user/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchClassrooms = async (): Promise<void> => {
    try {
      const response = await api.get<Classroom[]>("/classroom");
      setClassrooms(response.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  const handleEditUser = async (
    id: string,
    data: Partial<User>,
    role: "teacher" | "student"
  ): Promise<void> => {
    try {
      if (role === "teacher") {
        await api.patch(`/user/teachers/${id}`, data);
        fetchTeachers();
      } else if (role === "student") {
        await api.patch(`/user/students/${id}`, data);
        fetchStudents();
      }
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  const handleDeleteUser = async (
    id: string,
    role: "teacher" | "student"
  ): Promise<void> => {
    try {
      if (role === "teacher") {
        await api.delete(`/user/teachers/${id}`);
        fetchTeachers();
      } else if (role === "student") {
        await api.delete(`/user/students/${id}`);
        fetchStudents();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCreateClassroom = async (data: ClassroomData): Promise<void> => {
    try {
      await api.post("/classroom/create", data);
      fetchClassrooms();
      setIsCreateClassroomDialogOpen(false);
    } catch (error) {
      console.error("Error creating classroom:", error);
    }
  };

  const handleScheduleChange = (
    index: number,
    field: keyof ScheduleItem,
    value: string
  ) => {
    setNewClassroom((prev) => {
      const newSchedule = [...prev.schedule];
      newSchedule[index] = { ...newSchedule[index], [field]: value };
      return { ...prev, schedule: newSchedule };
    });
  };

  const handleAssignTeacher = async (
    teacherId: string,
    classroomId: string
  ): Promise<void> => {
    try {
      await api.post("/classroom/assign-teacher", { teacherId, classroomId });
      fetchTeachers();
      fetchClassrooms();
      setIsAssignTeacherDialogOpen(false);
    } catch (error) {
      console.error("Error assigning teacher:", error);
    }
  };

  const handleAssignStudent = async (
    studentId: string,
    classroomId: string
  ): Promise<void> => {
    try {
      await api.post("/classroom/assign-student", { studentId, classroomId });
      fetchStudents();
      fetchClassrooms();
      setIsAssignStudentDialogOpen(false);
    } catch (error) {
      console.error("Error assigning teacher:", error);
    }
  };

  return (
    <div className="w-full flex-1 ">
      <h2 className="text-2xl font-semibold mb-10 text-white">
        Principal Dashboard
      </h2>

      <section className="w-full mb-10 flex flex-col gap-2">
        <div className="w-full flex justify-between items-center gap-10">
          <h3 className="text-xl font-medium mb-2 text-white">Teachers</h3>
          <Link
            to="/register"
            className="bg-green-1 rounded-md px-3 py-2 text-white font-semibold flex items-center gap-1"
          >
            <Plus size={15} /> New Teacher
          </Link>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="">
            <tr className="text-white">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {teachers.map((teacher) => (
              <tr key={teacher._id} className="text-gray-1">
                <td className="border border-gray-300 p-2 text-center">
                  {teacher.fullName}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {teacher.email}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => {
                      setCurrentUser({ ...teacher, role: "teacher" });
                      setIsEditDialogOpen(true);
                    }}
                    className="mr-2 text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(teacher._id, "teacher")}
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
        <div className="w-full flex justify-between items-center gap-10">
          <h3 className="text-xl font-medium mb-2 text-white">Students</h3>
          <Link
            to="/register"
            className="bg-green-1 rounded-md px-3 py-2 text-white font-semibold flex items-center gap-1"
          >
            <Plus size={15} /> New Student
          </Link>
        </div>
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
                <td className="border border-gray-300 p-2 text-center">
                  {student.fullName}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {student.email}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => {
                      setCurrentUser({ ...student, role: "student" });
                      setIsEditDialogOpen(true);
                    }}
                    className="mr-2 text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(student._id, "student")}
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
            <li key={classroom._id} className="mb-2 text-gray-1">
              {classroom.name} -
              <button
                onClick={() => {
                  setCurrentClassroom(classroom);
                  setIsAssignTeacherDialogOpen(true);
                }}
                className="ml-2 text-green-1 font-medium"
              >
                Assign Teacher
              </button>
              <button
                onClick={() => {
                  setCurrentClassroom(classroom);
                  setIsAssignStudentDialogOpen(true);
                }}
                className="ml-2 text-green-1 font-medium"
              >
                Assign Student
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* edit user dialog */}
      <Dialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">
          Edit {currentUser?.role === "teacher" ? "Teacher" : "Student"}
        </h2>
        {currentUser && (
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleEditUser(
                currentUser._id,
                {
                  fullName: currentUser.fullName,
                  email: currentUser.email,
                },
                currentUser.role
              );
            }}
          >
            <input
              type="text"
              value={currentUser.fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentUser({ ...currentUser, fullName: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded outline-none"
            />
            <input
              type="email"
              value={currentUser.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentUser({ ...currentUser, email: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded outline-none"
            />
            <button
              type="submit"
              className="bg-green-1 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </form>
        )}
      </Dialog>

      {/* create classroom dialog*/}
      <Dialog
        isOpen={isCreateClassroomDialogOpen}
        onClose={() => setIsCreateClassroomDialogOpen(false)}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">Create Classroom</h2>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleCreateClassroom(newClassroom);
          }}
        >
          <input
            name="name"
            type="text"
            placeholder="Classroom Name"
            required
            className="w-full p-2 mb-4 border rounded outline-none"
            value={newClassroom.name}
            onChange={(e) =>
              setNewClassroom((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <h3 className="text-lg font-medium mb-2 text-white">Schedule</h3>
          {newClassroom.schedule.map((item, index) => (
            <div key={item.day} className="mb-2 text-gray-1">
              <span className="mr-2">{item.day}:</span>
              <input
                type="time"
                value={item.startTime}
                onChange={(e) =>
                  handleScheduleChange(index, "startTime", e.target.value)
                }
                className="mr-2 p-1 border rounded outline-none"
              />
              <span className="mr-2">to</span>
              <input
                type="time"
                value={item.endTime}
                onChange={(e) =>
                  handleScheduleChange(index, "endTime", e.target.value)
                }
                className="p-1 border rounded outline-none"
              />
            </div>
          ))}

          <button
            type="submit"
            className="bg-green-1 text-white px-4 py-2 rounded mt-4"
          >
            Create
          </button>
        </form>
      </Dialog>

      {/* assign teacher dialog */}
      <Dialog
        isOpen={isAssignTeacherDialogOpen}
        onClose={() => setIsAssignTeacherDialogOpen(false)}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">
          Assign Teacher to {currentClassroom?.name}
        </h2>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            if (currentClassroom) {
              handleAssignTeacher(
                formData.get("teacherId") as string,
                currentClassroom._id
              );
            }
          }}
        >
          <select
            name="teacherId"
            required
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.fullName}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-1 text-white px-4 py-2 rounded"
          >
            Assign
          </button>
        </form>
      </Dialog>
      
      <Dialog
        isOpen={isAssignStudentDialogOpen}
        onClose={() => setIsAssignStudentDialogOpen(false)}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">
          Assign Student to {currentClassroom?.name}
        </h2>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            if (currentClassroom) {
              handleAssignStudent(
                formData.get("studentId") as string,
                currentClassroom._id
              );
            }
          }}
        >
          <select
            name="studentId"
            required
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.fullName}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-1 text-white px-4 py-2 rounded"
          >
            Assign
          </button>
        </form>
      </Dialog>
    </div>
  );
};

export default PrincipalView;
