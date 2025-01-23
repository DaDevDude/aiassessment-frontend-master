import { CircleHelp } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-4 left-4 right-4 flex justify-between items-center p-4 bg-white rounded-xl shadow-md">
      <img
        alt="Dashboard Logo"
        src="/dashboard-logo.svg"
        className="w-32 h-9"
      />
      <a
        href="#"
        aria-label="Help"
        className="flex items-center gap-2 font-medium cursor-pointer text-primary-500"
      >
        Help <CircleHelp size="18" />
      </a>
    </nav>
  );
};

export default Navbar;
