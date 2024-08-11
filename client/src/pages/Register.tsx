import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/user/register", { fullName, email, password, role });
      navigate("/");
    } catch (error) {
      setError("You don't have the access to register!")
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-dark-1">
      <div className="bg-dark-2 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-white">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 space-y-1">
            <label className="block text-white font-medium">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 outline-none text-gray-1 rounded bg-dark-1"
              required
            />
          </div>
          <div className="mb-4 space-y-1">
            <label className="block text-white font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 outline-none text-gray-1 rounded bg-dark-1"
              required
            />
          </div>
          <div className="mb-4 space-y-1">
            <label className="block text-white font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 outline-none text-gray-1 rounded bg-dark-1"
              required
            />
          </div>
          <div className="mb-4 space-y-1">
            <label className="block text-white font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 outline-none text-gray-1 rounded bg-dark-1"
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-green-1 text-white font-medium transition rounded hover:bg-green-1/80"
          >
            Register
          </button>
          <span className="flex gap-2 items-center text-gray-1 mt-2 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-1 font-medium transition hover:text-green-1/80 text-base"
            >
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
