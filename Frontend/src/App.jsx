import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 9 Exact Screens from the reference image
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

import { initialUser } from "./data/dummyData";

export default function App() {
  const [currentUser, setCurrentUser] = useState(initialUser);

  const handleLogin = () => {
    setCurrentUser(initialUser);
  };

  const handleRegister = (newUser) => {
    setCurrentUser({
      ...initialUser,
      ...newUser,
    });
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
        <Routes>
          {/* Screen 1: Login */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Screen 2: Register */}
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />

          {/* Screen 3: Dashboard */}
          <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />

          {/* Screen 4: Find Teammates */}
          <Route path="/teammates" element={<Teammates />} />
          <Route path="/find-teammates" element={<Navigate to="/teammates" replace />} />

          {/* Screen 5: Find Teams */}
          <Route path="/teams" element={<FindTeams />} />

          {/* Screen 6: Team Details */}
          <Route path="/teams/:id" element={<TeamDetails />} />
          <Route path="/team-details" element={<TeamDetails />} />

          {/* Screen 7: My Teams */}
          <Route path="/my-teams" element={<MyTeams />} />

          {/* Create Team */}
          <Route path="/create-team" element={<CreateTeam />} />

          {/* Screen 8: Join Requests */}
          <Route path="/requests" element={<JoinRequests />} />
          <Route path="/join-requests" element={<Navigate to="/requests" replace />} />

          {/* Screen 9: My Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Admin Panel */}
          <Route path="/admin" element={<Admin />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
