import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, UserCheck, Layers, Bell, Shield } from "lucide-react";

// Top navigation bar used on all main pages
export default function Navbar({ requestCount = 2 }) {
  const location = useLocation();

  // Navigation tabs matching the screenshot
  const navTabs = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Teammates", path: "/teammates", icon: Users },
    { name: "Teams", path: "/teams", icon: Layers },
    { name: "My Teams", path: "/my-teams", icon: UserCheck },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Logo & Brand Name */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" alt="HackMate Logo" className="w-7 h-7 object-contain" />
          <span className="font-extrabold text-base tracking-wider text-[#2E1065]">
            HACKMATE
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden sm:flex items-center gap-6">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              location.pathname === tab.path ||
              (tab.path === "/teams" && location.pathname.startsWith("/team-details"));

            return (
              <Link
                key={tab.name}
                to={tab.path}
                className={`flex items-center gap-1.5 text-xs font-semibold pb-1 transition-colors border-b-2 ${
                  isActive
                    ? "border-purple-800 text-purple-900"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Admin Link, Notifications & Profile Avatar */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/admin"
            className="p-1.5 text-gray-400 hover:text-[#A54100] rounded-full hover:bg-orange-50 transition-colors"
            title="Admin Console"
          >
            <Shield className="w-4 h-4" />
          </Link>

          <Link
            to="/requests"
            className="p-1.5 text-gray-500 hover:text-gray-800 relative rounded-full hover:bg-gray-100 transition-colors"
            title="Join Requests"
          >
            <Bell className="w-4 h-4" />
            {requestCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1" />
            )}
          </Link>

          {/* User Avatar Circle with initial 'N' */}
          <Link
            to="/profile"
            className="w-7 h-7 rounded-full bg-[#4C1D95] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:opacity-90"
            title="My Profile"
          >
            N
          </Link>
        </div>

      </div>
    </header>
  );
}
