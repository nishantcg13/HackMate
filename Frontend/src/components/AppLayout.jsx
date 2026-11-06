import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Users,
  UserCheck,
  User,
  LogOut,
  Bell,
  Search,
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

  // Navigation items matching screenshot
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Hackathons", path: "/hackathons", icon: Trophy },
    { name: "Teams", path: "/teams", icon: Users },
    { name: "Join Requests", path: "/join-requests", icon: UserCheck },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex">
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Logo Header */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="HackMate Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Hack<span className="text-[#D9531E]">Mate</span>
              </span>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#FFF1E7] text-[#D9531E] font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#D9531E]" : "text-gray-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button at bottom */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full text-left rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between gap-4">
          {/* Optional Search Bar on Top */}
          <div className="flex-1 max-w-md">
            {searchPlaceholder ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue || ""}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#D9531E] focus:border-[#D9531E]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            ) : (
              <div />
            )}
          </div>

          {/* Right Header Controls (Bell & Avatar) */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D9531E] rounded-full" />
            </button>

            <Link
              to="/profile"
              className="w-9 h-9 rounded-full bg-[#D9531E] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
            >
              {currentUser?.initials || "NG"}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

