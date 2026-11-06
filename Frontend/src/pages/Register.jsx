import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import Button from "../components/Button";

export default function Register({ onRegister }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
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

      if (onRegister) {
        onRegister({
          id: "u_" + Date.now(),
          name: formData.name,
          initials: initials || "NG",
          email: formData.email,
          role: "Developer",
          experienceLevel: "Student / Intermediate",
          bio: "Passionate developer, always eager to learn and build cool things.",
          skills: ["Java", "React", "MongoDB", "C++"],
          avatar: initials || "NG",
          stats: { hackathons: 0, teams: 0, requests: 0 },
        });
      }
      navigate("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* LEFT BRANDING PANEL */}
      <div className="md:w-5/12 bg-gradient-to-br from-[#FFF1E7] via-[#FFEADB] to-[#FFF6F0] p-8 md:p-16 flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <img
            src="/logo.png"
            alt="HackMate Logo"
            className="w-16 h-16 object-contain mb-3"
          />
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Hack<span className="text-[#D9531E]">Mate</span>
          </h1>
          <p className="text-xs text-gray-600 mt-2 font-medium tracking-wide">
            Connect. Collaborate. Innovate.
          </p>
        </div>
      </div>

      {/* RIGHT REGISTRATION FORM */}
      <div className="flex-1 p-8 md:p-20 flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-sm">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create an Account
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Join HackMate to build projects with teammates
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-50 text-xs text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Full Name (e.g. Nishant Galande)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#D9531E] focus:border-[#D9531E]"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#D9531E] focus:border-[#D9531E]"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#D9531E] focus:border-[#D9531E]"
              />
            </div>

            <Button
              type="submit"
              size="md"
              className="w-full py-2.5 font-semibold"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#D9531E] font-semibold hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}
