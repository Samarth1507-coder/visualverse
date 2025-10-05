import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  User,
  Users,
  Award,
  Brush,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <Home /> },
    { path: "/profile", name: "Profile", icon: <User /> },
    { path: "/community", name: "Community", icon: <Users /> },
    { path: "/challenges", name: "Challenges", icon: <Award /> },
    { path: "/drawing", name: "Doodles", icon: <Brush /> },
    { path: "/settings", name: "Settings", icon: <Settings /> },
  ];

  return (
    <div
      className={`h-screen bg-blue-700 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 text-center hover:bg-blue-600"
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      {/* Menu */}
      <nav className="flex-1 mt-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 rounded-lg"
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600"
      >
        <LogOut />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;
