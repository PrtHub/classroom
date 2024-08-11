import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;