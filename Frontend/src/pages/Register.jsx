import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Code, Heart } from "lucide-react";
import Button from "../components/Button";

export default function Register({ onRegister }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skillsInput: "React, Node.js, Python",
    interestsInput: "Web Development, AI, FinTech",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const initials = formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const skills = formData.skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const interests = formData.interestsInput
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      if (onRegister) {
        onRegister({
          id: "u_" + Date.now(),
          name: formData.name,
          initials: initials || "NG",
          email: formData.email,
          role: "Hackathon Participant",
          bio: `Hi, I'm ${formData.name}. Excited to form teams and build projects for upcoming hackathons!`,
          skills: skills.length > 0 ? skills : ["React", "JavaScript", "HTML/CSS"],
          interests: interests.length > 0 ? interests : ["Web Development", "AI Solutions"],
          stats: { teamsJoined: 0, teammatesConnected: 0, pendingRequests: 0 },
        });
      }
      navigate("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* Left Branding Panel */}
      <div className="md:w-5/12 bg-[#FFF5EE] p-8 md:p-16 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-orange-100">
        <img
          src="/logo.png"
          alt="HackMate Logo"
          className="w-16 h-16 object-contain mb-3"
        />
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Hack<span className="text-[#A54100]">Mate</span>
        </h1>
        <p className="text-xs text-gray-600 mt-2 font-medium">
          Create your participant profile and connect with teammates.
        </p>
      </div>

      {/* Right Registration Form */}
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-md">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create an Account
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Join fellow hackathon participants
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-50 text-xs text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Nishant Galande"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="you@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
                />
              </div>
            </div>

            {/* Skills selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Technical Skills
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Code className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Figma, Python"
                  value={formData.skillsInput}
                  onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
                  className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">Separate skills with commas</p>
            </div>

            {/* Interests selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hackathon Project Interests
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Heart className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. AI Tools, FinTech, HealthTech, EdTech"
                  value={formData.interestsInput}
                  onChange={(e) => setFormData({ ...formData, interestsInput: e.target.value })}
                  className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">Domains or project topics you enjoy</p>
            </div>

            <Button
              type="submit"
              size="md"
              className="w-full py-2.5 font-semibold mt-2"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#A54100] font-semibold hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}
