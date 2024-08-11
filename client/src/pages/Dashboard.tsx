import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import StudentView from '../view/StudentView';
import TeacherView from '../view/TeacherView';
import PrincipalView from '../view/PrincipalView';

const Dashboard = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <div className="pl-72 pr-10 pt-20 w-full">
      {/* <h1 className="text-2xl font-bold mb-6 text-white">Dashboard</h1> */}
      {currentUser?.role === 'principal' && <PrincipalView />}
      {currentUser?.role === 'teacher' && <TeacherView />}
      {currentUser?.role === 'student' && <StudentView />}
    </div>
  );
};

export default Dashboard;