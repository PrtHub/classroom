these are the three task for teacher view:
1. See the list of Students in their classroom in table form. 
2. Teacher can change the detail of Student or delete them as well 
3. Can create time table for their classroom within time period of the classroom (set by principal)
and make a mistake in creating timetable: 
this is not a create timetable route: /classroom/${selectedClassroom._id}/timetable
real one is: router.post("/create", auth, authorizeRole(['teacher']), createTimetable)

and this is the controller,
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
}