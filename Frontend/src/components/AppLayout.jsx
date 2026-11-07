import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserCheck,
  User,
  LogOut,
  Bell,
  Search,
  PlusCircle,
} from "lucide-react";

export default function AppLayout({
  children,
  currentUser,
  onLogout,
  searchPlaceholder,
  searchValue,
  onSearchChange,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation focused purely on Teammates, Teams, and Requests
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Find Teammates", path: "/find-teammates", icon: UserPlus },
    { name: "My Teams", path: "/teams", icon: Users },
    { name: "Create Team", path: "/create-team", icon: PlusCircle },
    { name: "Connection Requests", path: "/requests", icon: UserCheck },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="HackMate Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Hack<span className="text-[#A54100]">Mate</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#FFF5EE] text-[#A54100] font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#A54100]" : "text-gray-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full text-left rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. RIGHT MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            {searchPlaceholder ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue || ""}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            ) : (
              <div className="text-xs text-gray-500 font-medium">
                Hackathon Teammate Finder
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/requests"
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
              title="Connection Requests"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#A54100] rounded-full" />
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 pl-2"
            >
              <div className="w-8 h-8 rounded-full bg-[#A54100] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser?.initials || "NG"}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-gray-800">
                {currentUser?.name || "Nishant"}
              </span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
