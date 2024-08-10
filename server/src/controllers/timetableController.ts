import { Request, Response } from 'express';
import Timetable from '../models/timetable';
import Classroom from '../models/classroom';

export const createTimetable = async (req: Request, res: Response) => {
  try {
    const { classroomId, subjects } = req.body;
    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      return res.status(400).json({ message: 'Invalid classroom' });
    }

    // Validate timetable entries
    for (const subject of subjects) {
      const classDay = classroom.schedule.find(s => s.day === subject.day);
      if (!classDay) {
        return res.status(400).json({ message: `Invalid day: ${subject.day}` });
      }

      if (subject.startTime < classDay.startTime || subject.endTime > classDay.endTime) {
        return res.status(400).json({ message: `Subject time out of classroom hours for ${subject.day}` });
      }
    }

    // Check for overlapping periods
    subjects.sort((a: any, b: any) => a.day.localeCompare(b.day) || a.startTime.localeCompare(b.startTime));
    for (let i = 1; i < subjects.length; i++) {
      if (subjects[i].day === subjects[i-1].day && subjects[i].startTime < subjects[i-1].endTime) {
        return res.status(400).json({ message: 'Overlapping periods detected' });
      }
    }

    const timetable = new Timetable({ classroom: classroomId, subjects });
    await timetable.save();

    res.status(201).json(timetable);
  } catch (error) {
    res.status(400).json({ message: 'Error creating timetable', error });
  }
};