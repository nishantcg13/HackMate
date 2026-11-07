import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../components/Button";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "nishant@example.com",
    password: "password123",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onLogin) {
        onLogin({
          id: "u1",
          name: "Nishant Galande",
          initials: "NG",
          email: formData.email,
          role: "Full Stack Developer",
          bio: "Passionate developer, always eager to learn and build innovative solutions. Looking for motivated teammates for hackathons.",
          skills: ["React", "Node.js", "Java", "MongoDB", "Python"],
          interests: ["Web Development", "AI Applications", "FinTech", "Open Source"],
          stats: { teamsJoined: 2, teammatesConnected: 6, pendingRequests: 3 },
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
          Connect with participants. Build your hackathon team.
        </p>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 p-8 md:p-20 flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-sm">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome Back!
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Login to view your teams and connection requests
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-50 text-xs text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
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
                className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg pl-9 pr-9 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              size="md"
              className="w-full py-2.5 font-semibold"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#A54100] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}
