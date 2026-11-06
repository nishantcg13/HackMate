import React from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, ShieldCheck, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

export default function Home({ currentUser }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar currentUser={currentUser} />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 sm:px-12 py-16 sm:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Text Content */}
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF5EE] border border-orange-200 text-xs font-semibold text-[#A54100]">
              <Users className="w-3.5 h-3.5" />
              <span>Hackathon Teammate Finder</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
              Find your teammates. <br />
              <span className="text-[#A54100]">Build something great together.</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-lg">
              HackMate is built specifically for hackathon participants. Create your skill profile, discover fellow builders with complementary talents, and form balanced teams ready to win.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-7" icon={UserPlus}>
                  Sign Up Free
                </Button>
              </Link>
              <Link to="/find-teammates" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-7" icon={ArrowRight}>
                  Explore Participants
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="w-full max-w-md bg-[#FFF5EE]/60 border border-orange-200/60 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-orange-100">
              <div className="w-10 h-10 rounded-full bg-[#A54100] text-white flex items-center justify-center font-bold text-sm">
                HM
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">How HackMate Works</p>
                <p className="text-[11px] text-gray-500">Form your team in 3 steps</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900 mb-0.5">1. Build Your Profile</p>
                <p className="text-gray-600 text-[11px]">List your core technical skills, framework proficiencies, and project interests.</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900 mb-0.5">2. Find Complementary Builders</p>
                <p className="text-gray-600 text-[11px]">Search for UI/UX designers, backend developers, or mobile specialists to fill skill gaps.</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900 mb-0.5">3. Assemble & Compete</p>
                <p className="text-gray-600 text-[11px]">Send join requests, finalize your squad roster, and participate together.</p>
              </div>
            </div>
          </div>

        </section>

        {/* Value Proposition Highlights */}
        <section className="bg-gray-50 border-t border-b border-gray-200 py-12">
          <div className="max-w-6xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#A54100] mb-2.5" />
              <h3 className="text-sm font-bold text-gray-900 mb-1">Skill-Based Matching</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Filter participants by exact tech stacks like React, Figma, Python, or Node.js to find the ideal match.
              </p>
            </div>

            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
              <Users className="w-5 h-5 text-[#A54100] mb-2.5" />
              <h3 className="text-sm font-bold text-gray-900 mb-1">Easy Team Creation</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Create a squad, define required roles, and manage invitations directly from your dashboard.
              </p>
            </div>

            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
              <UserPlus className="w-5 h-5 text-[#A54100] mb-2.5" />
              <h3 className="text-sm font-bold text-gray-900 mb-1">Direct Connection Requests</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Send and receive join requests with personalized introduction notes before committing to a team.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
