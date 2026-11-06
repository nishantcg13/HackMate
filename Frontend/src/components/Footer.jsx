import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="HackMate Logo" className="w-8 h-8 object-contain" />
              <span className="text-lg font-bold text-[#1E1248]">
                HACK<span className="text-blue-600">MATE</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Find hackathons, connect with skilled teammates, and build innovative projects together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/hackathons" className="hover:text-blue-600">Browse Hackathons</Link></li>
              <li><Link to="/find-teammates" className="hover:text-blue-600">Find Teammates</Link></li>
              <li><Link to="/teams" className="hover:text-blue-600">Explore Teams</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-600">My Dashboard</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              About
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><span className="cursor-pointer hover:text-blue-600">How It Works</span></li>
              <li><span className="cursor-pointer hover:text-blue-600">Team Guidelines</span></li>
              <li><span className="cursor-pointer hover:text-blue-600">Contact Us</span></li>
            </ul>
          </div>

          {/* Academic Info for Invigilators */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Project Details
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-2">
              Final Year Web Project: HackMate Hackathon Team Finder.
            </p>
            <span className="inline-block text-[11px] font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-200">
              React • Tailwind CSS • Node.js
            </span>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} HackMate. All rights reserved.</p>
          <p>Clean & Minimalist Web Platform</p>
        </div>
      </div>
    </footer>
  );
}
