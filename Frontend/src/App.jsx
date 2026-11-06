import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages matching uploaded design
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Hackathons from "./pages/Hackathons";
import Teams from "./pages/Teams";
import JoinRequests from "./pages/JoinRequests";
import Profile from "./pages/Profile";

// Data
import {
  initialCurrentUser,
  initialHackathons,
  initialTeams,
  initialRequests,
} from "./data/dummyData";

export default function App() {
  const [currentUser, setCurrentUser] = useState(initialCurrentUser);
  const [hackathons, setHackathons] = useState(initialHackathons);
  const [teams, setTeams] = useState(initialTeams);
  const [requests, setRequests] = useState(initialRequests);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateProfile = (updatedProfile) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
  };

  const handleCreateTeam = (newTeam) => {
    setTeams((prev) => [newTeam, ...prev]);
    // increment stats
    setCurrentUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        teams: (prev.stats?.teams || 0) + 1,
      },
    }));
  };

  const handleJoinTeam = (teamId) => {
    // increment request stats
    setCurrentUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        requests: (prev.stats?.requests || 0) + 1,
      },
    }));
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />

          {/* In-App Pages using shared Sidebar layout */}
          <Route
            path="/dashboard"
            element={
              <Dashboard
                currentUser={currentUser}
                hackathons={hackathons}
                teams={teams}
                requests={requests}
                onLogout={handleLogout}
              />
            }
          />

          <Route
            path="/hackathons"
            element={
              <Hackathons
                currentUser={currentUser}
                hackathons={hackathons}
                onLogout={handleLogout}
              />
            }
          />

          <Route
            path="/teams"
            element={
              <Teams
                currentUser={currentUser}
                teams={teams}
                onCreateTeam={handleCreateTeam}
                onJoinTeam={handleJoinTeam}
                onLogout={handleLogout}
              />
            }
          />

          <Route
            path="/join-requests"
            element={
              <JoinRequests
                currentUser={currentUser}
                requests={requests}
                onLogout={handleLogout}
              />
            }
          />

          <Route
            path="/profile"
            element={
              <Profile
                currentUser={currentUser}
                onUpdateProfile={handleUpdateProfile}
                onLogout={handleLogout}
              />
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
