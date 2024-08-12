import React, { useEffect, useState } from "react";
import { User } from "../types";
import api from "../services/api";
import Dialog from "../components/Dialog";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { convertTo12Hour } from "../utils/format";

interface Student {
  _id: string;
  fullName: string;
  email: string;
}

interface ClassroomData {
  _id: string;
  name: string;
  students: Student[];
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  teacher: User;
  __v: number;
}

interface Subject {
  name: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface TimetableData {
  _id: string;
  classroom: string;
  subjects: Subject[];
}

const TeacherView: React.FC = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isTimetableDialogOpen, setIsTimetableDialogOpen] = useState<boolean>(false);
  const [classroom, setClassroom] = useState<ClassroomData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [timetable, setTimetable] = useState<TimetableData | null>(null);
  const [newSubject, setNewSubject] = useState<Subject>({ name: "", day: "", startTime: "", endTime: "" });

  const user = useSelector((state: RootState) => state.user)

  useEffect(() => {
    fetchTeacherClassroom()
  }, []);

  useEffect(() => {
    if (classroom) {
      fetchTimetable(classroom._id);
    }
  }, [classroom]);

  console.log(user)

  console.log(classroom)

  console.log(students)

  const fetchTeacherClassroom = async (): Promise<void> => {
    try {
      const response = await api.get<ClassroomData[]>("/classroom/teacher/classrooms");
      const classroomData = response.data[0];
      setClassroom(classroomData);
      setStudents(classroomData.students);
    } catch (error) {
      console.error("Error fetching students with classrooms:", error);
    }
  };

  const fetchTimetable = async (classroomId: string): Promise<void> => {
    try {
      const response = await api.get<TimetableData>(`/timetable/classrooms/${classroomId}/timetable`);
      setTimetable(response.data);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };


  const handleEditUser = async (
    id: string,
    data: Partial<Student>
  ): Promise<void> => {
    try {
      await api.patch(`/user/students/${id}`, data);
      fetchTeacherClassroom();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  const handleDeleteUser = async (id: string): Promise<void> => {
    try {
      await api.delete(`/user/students/${id}`);
      fetchTeacherClassroom();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCreateTimetable = async (): Promise<void> => {
    try {
      const response = await api.post("/timetable/create", {
        classroomId: classroom?._id,
        subjects: timetable ? [...timetable.subjects, newSubject] : [newSubject]
      });
      setTimetable(response.data);
      setIsTimetableDialogOpen(false);
      setNewSubject({ name: "", day: "", startTime: "", endTime: "" });
    } catch (error) {
      console.error("Error creating timetable:", error);
    }
  };


  return (
    <div className="w-full flex-1 ">
      <span className="flex gap-5 flex-col mb-10">
      <h2 className="text-2xl font-semibold  text-white">
        Teacher Dashboard
      </h2>
      <h3 className="text-xl font-semibold  text-gray-1">My Classroom: {classroom?.name}</h3>
      </span>

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
                <td className="border border-gray-300 p-2 text-center">
                  {student.fullName}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {student.email}
                </td>
                
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => {
                      setCurrentUser({ ...student });
                      setIsEditDialogOpen(true);
                    }}
                    className="mr-2 text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(student._id)}
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-medium mb-2 text-white">Timetable</h3>
          <button
            onClick={() => setIsTimetableDialogOpen(true)}
            className="bg-green-1 text-white px-4 py-2 rounded"
          >
            Add Subject
          </button>
        </div>
        {timetable && timetable.subjects.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="text-white">
                <th className="border border-gray-300 p-2">Subject</th>
                <th className="border border-gray-300 p-2">Day</th>
                <th className="border border-gray-300 p-2">Start Time</th>
                <th className="border border-gray-300 p-2">End Time</th>
              </tr>
            </thead>
            <tbody>
              {timetable.subjects.map((subject, index) => (
                <tr key={index} className="text-gray-1">
                  <td className="border border-gray-300 p-2 text-center">{subject.name}</td>
                  <td className="border border-gray-300 p-2 text-center">{subject.day}</td>
                  <td className="border border-gray-300 p-2 text-center">{convertTo12Hour(subject.startTime)}</td>
                  <td className="border border-gray-300 p-2 text-center">{convertTo12Hour(subject.endTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-1">No timetable available. Add subjects to create a timetable.</p>
        )}
      </section>

      <Dialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">Edit Student</h2>
        {currentUser && (
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleEditUser(currentUser._id, {
                fullName: currentUser.fullName,
                email: currentUser.email,
              });
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


      <Dialog
        isOpen={isTimetableDialogOpen}
        onClose={() => setIsTimetableDialogOpen(false)}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">Add Subject to Timetable</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleCreateTimetable();
        }}>
          <input
            type="text"
            placeholder="Subject Name"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            className="w-full p-2 mb-4 border rounded outline-none"
          />
          <select
            value={newSubject.day}
            onChange={(e) => setNewSubject({ ...newSubject, day: e.target.value })}
            className="w-full p-2 mb-4 border rounded outline-none"
          >
            <option value="">Select Day</option>
            {classroom?.schedule.map((scheduleItem) => (
              <option key={scheduleItem.day} value={scheduleItem.day}>{scheduleItem.day}</option>
            ))}
          </select>
          <input
            type="time"
            value={newSubject.startTime}
            onChange={(e) => setNewSubject({ ...newSubject, startTime: e.target.value })}
            className="w-full p-2 mb-4 border rounded outline-none"
          />
          <input
            type="time"
            value={newSubject.endTime}
            onChange={(e) => setNewSubject({ ...newSubject, endTime: e.target.value })}
            className="w-full p-2 mb-4 border rounded outline-none"
          />
          <button
            type="submit"
            className="bg-green-1 text-white px-4 py-2 rounded"
          >
            Add Subject
          </button>
        </form>
      </Dialog>
    </div>
  );
};

export default TeacherView;