import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/user/login", { email, password });
      localStorage.setItem("token", response.data.accesstoken);
      navigate("/");
      dispatch(login(response.data.user));
    } catch (error) {
      setError("Login failed. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-dark-1">
      <div className="bg-dark-2 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-white">Log in</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="w-full p-2 bg-green-1 text-white font-medium transition rounded hover:bg-green-1/80"
          >
            Log in
          </button>
          <span className="flex gap-2 items-center text-gray-1 mt-2 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-1 font-medium transition hover:text-green-1/80 text-base"
            >
              Register
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
