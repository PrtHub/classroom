import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import StudentView from '../view/StudentView';
import TeacherView from '../view/TeacherView';
import PrincipalView from '../view/PrincipalView';

const Dashboard = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pl-3 sm:pl-32 md:pl-56 xl:pl-72 pr-3 sm:pr-5 md:pr-10 pt-20 w-full">
      {currentUser?.role === 'principal' && <PrincipalView />}
      {currentUser?.role === 'teacher' && <TeacherView />}
      {currentUser?.role === 'student' && <StudentView />}
    </div>
  );
};

export default Dashboard;