import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 9 Focused Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FindTeammates from "./pages/FindTeammates";
import Teams from "./pages/Teams";
import CreateTeam from "./pages/CreateTeam";
import Profile from "./pages/Profile";
import JoinRequests from "./pages/JoinRequests";

// Teammate and Team Dummy Data
import {
  initialCurrentUser,
  initialParticipants,
  initialTeams,
  initialRequests,
} from "./data/dummyData";

export default function App() {
  const [currentUser, setCurrentUser] = useState(initialCurrentUser);
  const [participants, setParticipants] = useState(initialParticipants);
  const [teams, setTeams] = useState(initialTeams);
  const [requests, setRequests] = useState(initialRequests);
  const [sentRequestIds, setSentRequestIds] = useState([]);

  // Auth Handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Profile Update
  const handleUpdateProfile = (updatedProfile) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
  };

  // Team Creation
  const handleCreateTeam = (newTeam) => {
    setTeams((prev) => [newTeam, ...prev]);
  };

  // Leave Team
  const handleLeaveTeam = (teamId) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            members: t.members.filter((m) => m.name !== currentUser?.name),
          };
        }
        return t;
      })
    );
  };

  // Connect / Send Request to Participant
  const handleRequestConnect = (participant) => {
    if (!sentRequestIds.includes(participant.id)) {
      setSentRequestIds([...sentRequestIds, participant.id]);
    }

    // Add to requests list as outgoing
    const newReq = {
      id: "req_" + Date.now(),
      name: participant.name,
      role: participant.role,
      skills: participant.skills,
      initials: participant.initials,
      message: `Request sent to connect for upcoming hackathons.`,
      teamName: "General Connection",
      type: "outgoing",
    };

    setRequests((prev) => [newReq, ...prev]);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
        <Routes>
          {/* 1. Landing Page */}
          <Route path="/" element={<Home currentUser={currentUser} />} />

          {/* 2. Login Page */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* 3. Sign Up Page */}
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />

          {/* 4. Dashboard */}
          <Route
            path="/dashboard"
            element={
              <Dashboard
                currentUser={currentUser}
                participants={participants}
                teams={teams}
                requests={requests}
                onLogout={handleLogout}
              />
            }
          />

          {/* 5. Find Teammates Page */}
          <Route
            path="/find-teammates"
            element={
              <FindTeammates
                currentUser={currentUser}
                participants={participants}
                onRequestConnect={handleRequestConnect}
                sentRequestIds={sentRequestIds}
                onLogout={handleLogout}
              />
            }
          />

          {/* 6. My Teams Page */}
          <Route
            path="/teams"
            element={
              <Teams
                currentUser={currentUser}
                teams={teams}
                onLeaveTeam={handleLeaveTeam}
                onLogout={handleLogout}
              />
            }
          />

          {/* 7. Create Team Page */}
          <Route
            path="/create-team"
            element={
              <CreateTeam
                currentUser={currentUser}
                onCreateTeam={handleCreateTeam}
                onLogout={handleLogout}
              />
            }
          />

          {/* 8. Profile Page */}
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

          {/* 9. Connection Requests Page */}
          <Route
            path="/requests"
            element={
              <JoinRequests
                currentUser={currentUser}
                requests={requests}
                onLogout={handleLogout}
              />
            }
          />
          <Route path="/join-requests" element={<Navigate to="/requests" replace />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
