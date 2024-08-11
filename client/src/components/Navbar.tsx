import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { logout } from "../store/userSlice";
import { Plus } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      navigate("/login");
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="w-full h-20 bg-dark-4 px-10 sticky top-0 z-40">
      <section className="flex flex-1 justify-between items-center h-full">
        <Link to="/" className="text-3xl font-bold text-white">
          Clasroom
        </Link>
        <section className="flex items-center gap-5">
          {!currentUser ? (
            <Link
              to="/login"
              className="bg-green-1 rounded-md px-5 py-2 text-white font-semibold"
            >
              Log in
            </Link>
          ) : (
            <span className="text-xl font-semibold text-white capitalize flex items-end gap-1">
              <p className="text-base text-gray-1 not-italic">Hello,</p>{" "}
              {currentUser?.fullName}
            </span>
          )}
          {currentUser?.role !== "principal" ? (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-green-1 rounded-md px-5 py-2 text-white font-semibold w-full"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/register"
              className="bg-green-1 rounded-md px-5 py-2 text-white font-semibold w-full flex items-center gap-1"
            >
              <Plus size={15} /> New Member
            </Link>
          )}
        </section>
      </section>
    </nav>
  );
};

export default Navbar;
