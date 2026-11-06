import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import Button from "./Button";

export default function Navbar({ currentUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation Links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hackathons", path: "/hackathons" },
    { name: "Find Teammates", path: "/find-teammates" },
    { name: "Teams", path: "/teams" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo with HackMate Image */}
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="HackMate Logo"
              className="w-9 h-9 object-contain"
            />
            <span className="text-xl font-bold text-[#1E1248] tracking-tight">
              HACK<span className="text-blue-600">MATE</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    active
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-800 transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold">
                    {currentUser.name}
                  </span>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  icon={LogOut}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive(link.path)
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
            {currentUser ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                icon={LogOut}
              >
                Log Out
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
