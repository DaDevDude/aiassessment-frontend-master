import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/lib/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/auth/thunk";
import { clearState } from "@/redux/slices/auth";

const NavBar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    // bug: clear state not working after dispatching logout
    dispatch(clearState());
  };

  return (
    <nav className="bg-white fixed top-0 left-0 z-10 w-full flex justify-between items-center gap-2 p-4 border border-dashed">
      <img alt="Logo" src="/dashboard-logo.svg" className="w-32 h-9" />
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Avatar className="capitalize">
            <AvatarFallback>
              {user && user.name ? user.name[0] : ""}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4">
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default NavBar;
