import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Layout = () => {
  return (
    <main className="flex flex-col relative bg-dark-5">
      <Navbar />
      <section className="flex gap-10 min-h-screen relative">
        <Sidebar />
        <Outlet />
      </section>
    </main>
  );
};

export default Layout;
