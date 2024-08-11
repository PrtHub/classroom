import { LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <section className="w-full max-w-[250px] bg-dark-4 h-screen flex flex-col justify-between pt-40 px-10 fixed top-0 left-0 z-20 overflow-y-scroll">
      <section className="w-full flex flex-col gap-4">
        <Link
          to="/"
          className={`flex items-center gap-2 p-5 rounded-md font-medium ${
            pathname === "/" ? "bg-dark-1 text-white" : "text-gray-1"
          }`}
        >
          <LayoutDashboard />
          <p>Dashboard</p>
        </Link>
      </section>
    </section>
  );
};

export default Sidebar;