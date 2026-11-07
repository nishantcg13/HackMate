import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Lightbulb, AlertCircle } from "lucide-react";
import { loginApi } from "../services/api";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("nishant@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form submit handler with Backend API Integration
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Try real Backend Auth API
      const response = await loginApi(email, password);
      if (onLogin && response?.user) {
        onLogin(response.user);
      } else if (onLogin) {
        onLogin();
      }
      navigate("/dashboard");
    } catch (err) {
      console.warn("Backend Login Error or Server Offline. Falling back to local demo login:", err?.message);
      // If backend returns 401 or invalid password, display message
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        // Backend might be offline; allow smooth demo fallback
        if (onLogin) onLogin();
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Main Login Card */}
      <div className="bg-white border border-gray-200 rounded-3xl max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-sm">
        
        {/* Left Side: Brand & Collaboration Illustration */}
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

          {/* Clean Illustration of 3 Teammates with Laptop & Lightbulb */}
          <div className="my-6 relative">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-1 animate-pulse">
              <Lightbulb className="w-4 h-4" />
            </div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80"
              alt="Students Collaborating"
              className="w-56 h-36 object-cover rounded-2xl shadow-xs"
            />
          </div>

          <p className="text-[11px] text-gray-400">
            Find your teammates & build something great.
          </p>
        </div>

        {/* Right Side: Simple Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Login
          </h2>

          {errorMsg && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
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

            {/* Login Button in Terracotta/Brown */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A54100] hover:bg-[#8A3600] text-white font-semibold text-xs py-2.5 rounded-lg transition-colors mt-2 disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-xs text-gray-500 mt-5">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#A54100] font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
