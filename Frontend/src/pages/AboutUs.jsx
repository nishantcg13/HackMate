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

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-12">
        {/* 1. Hero Section */}
        <section className="bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-12 shadow-xs relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About HackMate</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Empowering Students to Build Winning Hackathon Teams
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed font-normal">
              HackMate is a collaborative team-building platform built for developers, designers, and innovators. We bridge the gap between talented individuals and ambitious hackathon projects, ensuring nobody has to hack alone.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 justify-center md:justify-start">
              <Link
                to="/teams"
                className="bg-[#A54100] hover:bg-[#8A3600] text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-2xs"
              >
                <span>Explore Teams</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/teammates"
                className="bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Find Teammates
              </Link>
            </div>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <div className="w-64 h-48 sm:w-80 sm:h-56 rounded-3xl bg-gradient-to-tr from-purple-100 via-indigo-50 to-amber-50 p-3 border border-purple-100 shadow-xs flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80"
                alt="Hackathon Team Collaboration"
                className="w-full h-full object-cover rounded-2xl shadow-2xs"
              />
            </div>
          </div>

          <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-100/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 2. Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Our Mission</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              To eliminate the frustration of last-minute team scrambles. We empower student hackers to discover compatible partners with complementary skillsets—pairing frontend wizards with backend architects and UI/UX designers for well-rounded squads.
            </p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Rocket className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Our Vision</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              A global collegiate innovation network where every aspiring developer can find their dream team, transform creative ideas into production-ready prototypes, and launch successful open-source projects or tech startups.
            </p>
          </div>
        </section>

        {/* 3. Key Capabilities */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Why Choose HackMate?
            </h2>
            <p className="text-xs text-gray-500 max-w-lg mx-auto">
              Everything you need to discover teammates, coordinate project ideas, and track hackathon timelines in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs hover:border-purple-200 hover:shadow-sm transition-all space-y-3"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${item.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. How It Works */}
        <section className="bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-10 shadow-xs space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              How HackMate Works
            </h2>
            <p className="text-xs text-gray-500">
              Get from solo developer to fully staffed hackathon team in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="relative space-y-2">
                <span className="text-3xl font-black text-purple-200 block">
                  {s.step}
                </span>
                <h3 className="text-sm font-bold text-gray-900">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Tech Stack & Architecture */}
        <section className="bg-[#FAF9F6] border border-gray-200/80 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-700" />
                <h2 className="text-lg font-bold text-gray-900">
                  Built on Modern Web Technologies
                </h2>
              </div>
              <p className="text-xs text-gray-500">
                Robust, fast, and scalable MERN stack architecture designed for high availability.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full Stack MERN</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-3 text-center space-y-1 shadow-2xs"
              >
                <p className="text-xs font-bold text-gray-900">{tech.name}</p>
                <p className="text-[10px] text-gray-400">{tech.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Call to Action Banner */}
        <section className="bg-gradient-to-r from-[#2E1065] to-[#4C1D95] rounded-3xl p-8 sm:p-10 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5 max-w-lg">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready to find your hackathon crew?
            </h2>
            <p className="text-xs text-purple-200 font-normal">
              Join students already finding teammates, building cool projects, and winning hackathons.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/create-team"
              className="bg-white text-purple-900 hover:bg-gray-100 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs"
            >
              Create Team
            </Link>
            <Link
              to="/dashboard"
              className="border border-purple-300 text-white hover:bg-white/10 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              Go to Dashboard
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
          </div>
        </footer>
      </main>
    </div>
  );
}

