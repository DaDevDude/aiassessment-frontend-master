import { Button } from "@/lib/ui/button";
import { sideBarLinks } from "@/utils/constants";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <section className="bg-white w-[300px] h-screen sticky top-0 left-0 pt-[90px] flex gap-1 flex-col border border-dashed p-4">
      {sideBarLinks.map((item) => {
        return (
          <NavLink end key={item.name} to={item.link}>
            {({ isActive }) => (
              <Button
                size="lg"
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-2 p-4 h-12  ${
                  isActive ? "" : "text-gray-500"
                }`}
              >
                <item.icon />
                {item.name}
              </Button>
            )}
          </NavLink>
        );
      })}
    </section>
  );
};

export default SideBar;
