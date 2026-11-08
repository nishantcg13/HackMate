import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, Check } from "lucide-react";
import { registerApi } from "../services/api";

export default function Register({ onRegister }) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password should be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await registerApi({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        skills: skillsArray,
        bio: bio.trim(),
      });

      setSuccessMsg("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      const message =
        err.response?.data?.message ||
        (!err.response
          ? "Cannot connect to server. Please check if Backend is running (port 3000) and MongoDB is started."
          : "Registration failed. Please try again.");
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-3xl max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-sm">
        
        {/* Left Side: Brand */}
        <div className="p-8 sm:p-10 flex flex-col justify-between items-center text-center border-b md:border-b-0 md:border-r border-gray-100 bg-[#FAF9F6]/40">
          <div>
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain mx-auto mb-2" />
            <h1 className="text-xl font-extrabold tracking-wider text-[#2E1065]">
              HACKMATE
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Hackathon Team Finder
            </p>
          </div>

          <div className="my-6 relative">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-1 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=80"
              alt="Students High-Fiving"
              className="w-56 h-36 object-cover rounded-2xl shadow-xs"
            />
          </div>

          <p className="text-[11px] text-gray-400">
            Join thousands of students finding hackathon teams.
          </p>
        </div>

        {/* Right Side: Create Account Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Create Account
          </h2>

          {errorMsg && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
            </div>

            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Skills (comma separated, e.g. React, Node, Python)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-9 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 absolute right-3 top-2.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-9 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600 absolute right-3 top-2.5"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A54100] hover:bg-[#8A3600] text-white font-semibold text-xs py-2.5 rounded-lg transition-colors mt-2 disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5">
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
