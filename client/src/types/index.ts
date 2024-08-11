export interface User {
    _id: string;
    fullname: string;
    email: string;
    role: 'principal' | 'teacher' | 'student';
    refreshToken: string
  }
  
  export interface Classroom {
    _id: string;
    name: string;
    teacher: string;
    students: string[];
    schedule: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
  }
  
  export interface Timetable {
    _id: string;
    classroom: string;
    subjects: {
      name: string;
      day: string;
      startTime: string;
      endTime: string;
    }[];
  }