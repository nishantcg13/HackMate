import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "./Button";

export default function Navbar({ currentUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Teammates", path: "/find-teammates" },
    { name: "Teams", path: "/teams" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="HackMate Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Hack<span className="text-[#A54100]">Mate</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden sm:flex items-center gap-8 text-xs font-semibold text-gray-600">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={active ? "text-[#A54100]" : "hover:text-gray-900"}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <Link to="/dashboard">
                <Button size="sm">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2 text-xs">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-gray-700 font-medium hover:text-[#A54100]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 flex gap-2">
            <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" size="sm" className="w-full">
                Login
              </Button>
            </Link>
            <Link to="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
