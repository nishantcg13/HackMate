import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Teammates from "./pages/Teammates";
import FindTeams from "./pages/FindTeams";
import TeamDetails from "./pages/TeamDetails";
import MyTeams from "./pages/MyTeams";
import JoinRequests from "./pages/JoinRequests";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import CreateTeam from "./pages/CreateTeam";

import { getMeApi } from "./services/api";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Fetch logged in user details on load if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await getMeApi();
          if (res?.user) {
            setCurrentUser(res.user);
            localStorage.setItem("user", JSON.stringify(res.user));
          }
        } catch {
          // If token invalid, clear
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setCurrentUser(null);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const handleRegister = (user) => {
    // Optionally set state on register
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
        <Routes>
          {/* Auth Screens */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />

          {/* Core App Screens */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
          <Route path="/teammates" element={<Teammates />} />
          <Route path="/find-teammates" element={<Navigate to="/teammates" replace />} />
          <Route path="/teams" element={<FindTeams />} />
          <Route path="/teams/:id" element={<TeamDetails />} />
          <Route path="/my-teams" element={<MyTeams />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/requests" element={<JoinRequests />} />
          <Route path="/join-requests" element={<Navigate to="/requests" replace />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Portal */}
          <Route path="/admin" element={<Admin />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
