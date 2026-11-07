import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="HackMate Logo" className="w-6 h-6 object-contain" />
            <span className="font-bold text-gray-900">
              Hack<span className="text-[#A54100]">Mate</span>
            </span>
            <span className="text-gray-400">|</span>
            <span>Hackathon Teammate Finder</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/find-teammates" className="hover:text-gray-900">Find Teammates</Link>
            <Link to="/teams" className="hover:text-gray-900">My Teams</Link>
            <Link to="/create-team" className="hover:text-gray-900">Create Team</Link>
            <Link to="/login" className="hover:text-gray-900">Login</Link>
          </div>

          <div>
            © {new Date().getFullYear()} HackMate. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
