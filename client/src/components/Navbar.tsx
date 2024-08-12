import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      toast.success("Logged out!");
      navigate("/login");
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="w-full h-20 bg-dark-4 px-3 sm:px-5 md:px-10 sticky top-0 z-40">
      <section className="flex flex-1 justify-between items-center h-full">
        <Link to="/" className="text-2xl sm:text-3xl font-bold text-white">
          Clasroom
        </Link>
        <section className="flex items-center gap-2 sm:gap-5">
          {!currentUser ? (
            <Link
              to="/login"
             className="bg-green-1 rounded-md px-3 py-2 text-white text-sm sm:text-base font-semibold w-full"
            >
              Log in
            </Link>
          ) : (
            <span className="text-base sm:text-xl font-semibold text-white capitalize flex flex-col sm:flex-row items-start sm:items-end sm:gap-1">
              <p className="text-sm sm:text-base text-gray-1 not-italic">Hello,</p>{" "}
              {currentUser?.fullName}
            </span>
          )}
          {currentUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-green-1 rounded-md px-3 py-2 text-white text-sm sm:text-base font-semibold w-full"
            >
              Log out
            </button>
          )}
        </section>
      </section>
    </nav>
  );
};

export default Navbar;
