import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb } from "lucide-react";
import Button from "../components/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 1. TOP NAVBAR */}
      <header className="h-16 border-b border-gray-150 px-6 sm:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="HackMate Logo" className="w-7 h-7 object-contain" />
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            Hack<span className="text-[#D9531E]">Mate</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden sm:flex items-center gap-8 text-xs font-semibold text-gray-600">
          <Link to="/" className="text-[#D9531E]">Home</Link>
          <Link to="/hackathons" className="hover:text-gray-900">Hackathons</Link>
          <Link to="/teams" className="hover:text-gray-900">Teams</Link>
        </div>

        {/* Right Login Button */}
        <div>
          <Link to="/login">
            <Button size="sm" className="px-5 rounded-full">
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION MATCHING SCREENSHOT */}
      <main className="flex-1 max-w-6xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-12 py-12 md:py-20 relative">
        
        {/* Left Content */}
        <div className="max-w-xl space-y-6 z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
            Find your people. <br />
            <span className="text-gray-900">Build something </span> <br />
            <span className="text-gray-900">great.</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-md leading-relaxed">
            Discover hackathons, connect with teammates, and turn ideas into projects.
          </p>

          <div>
            <Link to="/hackathons">
              <Button size="md" className="px-6 rounded-lg text-sm" icon={ArrowRight}>
                Explore Hackathons
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Hero Visual / Illustration */}
        <div className="relative w-full max-w-md flex items-center justify-center">
          {/* Soft warm peach background curve */}
          <div className="absolute -top-10 -right-10 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-[#FFF1E7] to-[#FFE4D5] -z-10 blur-xl opacity-80" />

          {/* Clean Vector Collaboration Graphic */}
          <div className="relative bg-white/70 backdrop-blur-xs border border-orange-100 rounded-3xl p-6 shadow-xl shadow-orange-950/5">
            <div className="flex justify-center mb-2">
              <span className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
                <Lightbulb className="w-5 h-5 animate-pulse" />
              </span>
            </div>
            
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80"
              alt="Team Collaboration"
              className="w-full h-56 object-cover rounded-2xl shadow-sm"
            />

            <div className="mt-4 flex items-center justify-between text-xs text-gray-600 px-1">
              <span className="font-semibold text-gray-900">HackMate Community</span>
              <span className="text-[#D9531E] font-medium">950+ Active Teams</span>
            </div>
          </div>
        </div>

      </main>

      {/* Footer minimal */}
      <footer className="border-t border-gray-150 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} HackMate. Find your hackathon team.
      </footer>
    </div>
  );
}
