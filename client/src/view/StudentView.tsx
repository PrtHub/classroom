import { useEffect, useState } from "react";
import { User } from "../types";
import api from "../services/api";
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

const StudentView = () => {
  const [classroom, setClassroom] = useState<ClassroomData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [timetable, setTimetable] = useState<TimetableData | null>(null);

  console.log(classroom)
  console.log(students)

  useEffect(() => {
    fetchStudentClassroom()
    fetchClassroomTimetable()
  }, []);

  const fetchStudentClassroom = async (): Promise<void> => {
    try {
      const response = await api.get<ClassroomData[]>("/classroom/students/classroom");
      const classroomData = response.data[0];
      setClassroom(classroomData);
      setStudents(classroomData.students);
    } catch (error) {
      console.error("Error fetching students with classrooms:", error);
    }
  };

  const fetchClassroomTimetable = async (): Promise<void> => {
    try {
      const response = await api.get<TimetableData>("/timetable/student");
      setTimetable(response.data);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };

  return (
    <div className="w-full flex-1 ">
      <span className="flex gap-5 flex-col mb-10">
        <h2 className="text-2xl font-semibold  text-white">
          Student Dashboard
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
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-10 w-full flex flex-col gap-2">
        
          <h3 className="text-xl font-medium mb-2 text-white">Timetable</h3>
          
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
    </div>
  );
};

export default StudentView;
