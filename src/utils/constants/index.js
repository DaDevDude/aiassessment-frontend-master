import {
  BadgePlus,
  Contact,
  LayoutDashboard,
  Settings,
  SquareGanttChart,
  UsersRound,
} from "lucide-react";

export const sideBarLinks = [
  { name: "Dashboard", link: "/dashboard", icon: LayoutDashboard },
  {
    name: "Create Assessment",
    link: "/dashboard/create-assessment",
    icon: BadgePlus,
  },
  {
    name: "Manage Assessment",
    link: "/dashboard/manage-assessment",
    icon: SquareGanttChart,
  },
  {
    name: "User Management",
    link: "/dashboard/user-management",
    icon: UsersRound,
  },
  { name: "Settings", link: "/dashboard/settings", icon: Settings },
];

export const dashboardButtons = [
  {
    label: "Create Assessment",
    icon: BadgePlus,
    link: "/dashboard/create-assessment",
  },
  {
    label: "View Reports",
    icon: Contact,
    link: "/dashboard/reports",
  },
  {
    label: "Manage Users",
    icon: UsersRound,
    link: "/dashboard/user-management",
  },
];
