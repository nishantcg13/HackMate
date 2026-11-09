import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Users,
  Target,
  Sparkles,
  Rocket,
  Code2,
  Award,
  Heart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Laptop,
  Layers,
  Calendar,
} from "lucide-react";

export default function AboutUs() {
  const features = [
    {
      icon: Users,
      title: "Smart Teammate Matching",
      desc: "Search for fellow developers, designers, and innovators filtered by specific skills like React, Node.js, Python, or UI/UX.",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      icon: Layers,
      title: "Effortless Team Building",
      desc: "Create your team in seconds or explore open squads that are actively recruiting for upcoming hackathons.",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      icon: Calendar,
      title: "Clear Event Timelines",
      desc: "Track registration deadlines, start dates, and submission cutoffs so you never miss a hackathon milestone.",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    {
      icon: ShieldCheck,
      title: "Live Join Requests",
      desc: "Manage team rosters seamlessly with instant notifications, approval workflows, and leadership delegation.",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Create Your Profile",
      desc: "Highlight your technical skills, portfolio bio, and past hackathon interests so recruiters and leaders can discover you.",
    },
    {
      step: "02",
      title: "Discover Teams or Talent",
      desc: "Search through active hackathon squads or filter available teammates by domain expertise and programming languages.",
    },
    {
      step: "03",
      title: "Send Join Request",
      desc: "Request to join an open team or invite talented candidates with a single click. Leaders review and approve in real time.",
    },
    {
      step: "04",
      title: "Build, Hack & Win",
      desc: "Collaborate with your balanced dream squad, build impactful projects, and conquer your next hackathon competition!",
    },
  ];

  const techStack = [
    { name: "React 18 & Vite", category: "Frontend Framework" },
    { name: "Tailwind CSS", category: "Modern UI Styling" },
    { name: "Node.js & Express", category: "Backend REST API" },
    { name: "MongoDB & Mongoose", category: "NoSQL Database" },
    { name: "JWT Authentication", category: "Secure User Auth" },
    { name: "Bcrypt.js", category: "Password Encryption" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        {/* 1. Hero Section - Solid Clean Card */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-purple-800">
              About The Project
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              HackMate: Student Hackathon Team Formation Platform
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              HackMate is a web-based platform built to help students and developers connect with peers, discover complementary skill sets, and form balanced hackathon teams.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/teams"
                className="bg-[#A54100] hover:bg-[#8A3600] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <span>Browse Teams</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/teammates"
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Find Teammates
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Our Mission</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              To eliminate the difficulty of finding reliable hackathon teammates. We help developers discover compatible partners with complementary skills—pairing frontend developers with backend programmers and UI/UX designers.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Rocket className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Our Vision</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              A collaborative network where every student developer can easily find the right teammates, build innovative software prototypes, and participate effectively in hackathon competitions.
            </p>
          </div>
        </section>

        {/* 3. Key Capabilities */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">
            Core Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center font-bold">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. How It Works */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-7 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              How the System Works
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Four simple steps from creating a profile to joining a hackathon team.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, idx) => (
              <div key={idx} className="border-t-2 border-purple-800 pt-3 space-y-1">
                <span className="text-xs font-bold text-purple-800 block">
                  Step {s.step}
                </span>
                <h3 className="text-xs font-bold text-gray-900">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Tech Stack & Architecture */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Technology Stack
              </h2>
              <p className="text-xs text-gray-500">
                Full-stack MERN architecture with RESTful API integration.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200 self-start sm:self-auto">
              MERN Stack
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center space-y-0.5"
              >
                <p className="text-xs font-bold text-gray-900">{tech.name}</p>
                <p className="text-[10px] text-gray-500">{tech.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Call to Action Banner - Solid Style */}
        <section className="bg-[#2E1065] rounded-xl p-6 sm:p-7 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-lg font-bold">
              Ready to collaborate?
            </h2>
            <p className="text-xs text-purple-200">
              Browse existing open teams or register your own hackathon team.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/create-team"
              className="bg-[#A54100] hover:bg-[#8A3600] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Create Team
            </Link>
            <Link
              to="/dashboard"
              className="border border-purple-400 text-white hover:bg-white/10 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </section>

        {/* 7. Footer */}
        <footer className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="HackMate" className="w-5 h-5 object-contain" />
            <span className="font-extrabold text-gray-700 tracking-wider">HACKMATE</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <Link to="/dashboard" className="hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link to="/teammates" className="hover:text-gray-900 transition-colors">
              Teammates
            </Link>
            <Link to="/teams" className="hover:text-gray-900 transition-colors">
              Teams
            </Link>
            <Link to="/my-teams" className="hover:text-gray-900 transition-colors">
              My Teams
            </Link>
            <Link to="/contact" className="hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

