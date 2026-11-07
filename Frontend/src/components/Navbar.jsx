import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, UserCheck, Layers, Bell, Shield, LogOut } from "lucide-react";
import { getReceivedRequestsApi, logoutApi } from "../services/api";

export default function Navbar({ requestCount: propCount }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [incomingCount, setIncomingCount] = useState(propCount ?? 0);

  const loggedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const userInitial = (loggedUser?.name || "U")[0].toUpperCase();

  // Load actual incoming join request count if not provided
  useEffect(() => {
    if (propCount !== undefined) {
      setIncomingCount(propCount);
      return;
    }
    const fetchRequests = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await getReceivedRequestsApi();
        if (res?.data) {
          const pendingCount = res.data.filter(
            (r) => r.status === "Pending" || !r.status
          ).length;
          setIncomingCount(pendingCount);
        }
      } catch {
        // quiet catch
      }
    };
    fetchRequests();
  }, [propCount]);

  const handleLogout = () => {
    logoutApi();
    navigate("/login");
  };

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

        {/* Right: Notifications, Profile Avatar & Logout */}
        <div className="flex items-center gap-3">
          {/* Admin link visible ONLY to logged-in ADMIN users */}
          {loggedUser?.role === "ADMIN" && (
            <Link
              to="/admin"
              className="px-2.5 py-1 text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1"
              title="Admin Console"
            >
              <Shield className="w-3.5 h-3.5 text-[#A54100]" />
              <span>Admin</span>
            </Link>
          )}

          <Link
            to="/requests"
            className="p-1.5 text-gray-500 hover:text-gray-800 relative rounded-full hover:bg-gray-100 transition-colors"
            title="Join Requests"
          >
            <Bell className="w-4 h-4" />
            {incomingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1" />
            )}
          </Link>

          {/* User Avatar Circle */}
          <Link
            to="/profile"
            className="w-7 h-7 rounded-full bg-[#4C1D95] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:opacity-90"
            title={loggedUser?.name ? `Profile: ${loggedUser.name}` : "My Profile"}
          >
            {userInitial}
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
