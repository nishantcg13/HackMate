import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Lightbulb, AlertCircle } from "lucide-react";
import { loginApi } from "../services/api";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await loginApi(email, password);
      if (onLogin && response?.user) {
        onLogin(response.user);
      }
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-300 rounded-xl max-w-md w-full p-8 shadow-sm">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain mx-auto mb-2" />
          <h1 className="text-xl font-bold tracking-tight text-[#2E1065]">
            HACKMATE
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to access your hackathon teams
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-700 focus:border-purple-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-9 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-700 focus:border-purple-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 absolute right-3 top-2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A54100] hover:bg-[#8A3600] text-white font-semibold text-xs py-2.5 rounded-lg transition-colors mt-2 disabled:opacity-70 cursor-pointer shadow-xs"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-gray-100">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#A54100] font-semibold hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}
