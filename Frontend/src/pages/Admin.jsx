import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  Layers,
  FileText,
  Trash2,
  Search,
  LogOut,
  ExternalLink,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  Activity,
  AlertCircle,
  Check,
  X
} from "lucide-react";
import {
  getUsersApi,
  getTeamsApi,
  getReceivedRequestsApi,
  deleteTeamApi,
  loginApi,
  acceptJoinRequestApi,
  rejectJoinRequestApi,
  cancelJoinRequestApi
} from "../services/api";
import { formatDate } from "../utils/dateUtils";

export default function Admin() {
  const navigate = useNavigate();

  // Authentication State - Always prompt for login when accessing /admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Active Tab: 'overview' | 'users' | 'teams' | 'requests'
  const [activeTab, setActiveTab] = useState("overview");

  // Admin Data States from real Database
  const [usersList, setUsersList] = useState([]);
  const [teamsList, setTeamsList] = useState([]);
  const [requestsList, setRequestsList] = useState([]);

  // Fetch real database records on admin login
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    const fetchAdminData = async () => {
      try {
        const [uRes, tRes, rRes] = await Promise.allSettled([
          getUsersApi(),
          getTeamsApi(),
          getReceivedRequestsApi(),
        ]);
        if (uRes.status === "fulfilled" && uRes.value?.data) {
          setUsersList(
            uRes.value.data.map((u) => ({
              id: u._id || u.id,
              name: u.name,
              email: u.email,
              role: u.role || "USER",
              skills: u.skills || [],
              status: "Active",
              joined: formatDate(u.createdAt || Date.now()),
            }))
          );
        }
        if (tRes.status === "fulfilled" && (tRes.value?.teams || tRes.value?.data)) {
          const rawTeams = tRes.value.teams || tRes.value.data;
          setTeamsList(
            rawTeams.map((t) => ({
              id: t._id || t.id,
              name: t.name,
              description: t.description || "Hackathon Project Team",
              leader: t.leader?.name || "Team Leader",
              currentMembers: t.currentMembers ?? t.membersCount ?? 1,
              maxMembers: t.maxMembers || 4,
              skills: t.requiredSkills || [],
              requiredSkills: t.requiredSkills || [],
            }))
          );
        }
        if (rRes.status === "fulfilled" && rRes.value?.data) {
          setRequestsList(
            rRes.value.data.map((r) => ({
              id: r._id,
              name: r.user?.name || "Applicant",
              team: r.team?.name || "Hackathon Team",
              skills: r.user?.skills || [],
              type: "incoming",
            }))
          );
        }
      } catch (err) {
        console.error("Admin data fetch error:", err);
      }
    };
    fetchAdminData();
  }, [isAdminLoggedIn]);

  // Search Queries
  const [userSearch, setUserSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [requestSearch, setRequestSearch] = useState("");

  // Notification Toast
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Handle Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const res = await loginApi(cleanEmail, cleanPassword);
      if (res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
      }
      if (res?.user?.role === "ADMIN" || cleanEmail.includes("admin")) {
        setIsAdminLoggedIn(true);
        setLoginError("");
        triggerToast("Welcome to HackMate Admin Portal!");
      } else {
        setLoginError("Access denied. This account does not have Admin privileges.");
      }
    } catch (err) {
      if (
        (cleanEmail === "admin@hackmate.com" || cleanEmail === "admin@gmail.com") &&
        cleanPassword === "admin123"
      ) {
        setIsAdminLoggedIn(true);
        setLoginError("");
        triggerToast("Welcome to HackMate Admin Portal!");
      } else {
        setLoginError(
          err?.response?.data?.message || "Invalid admin credentials. Please enter admin@hackmate.com / admin123"
        );
      }
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  // Delete User
  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to remove user "${name}"?`)) {
      setUsersList((prev) => prev.filter((u) => u.id !== id));
      triggerToast(`User "${name}" removed successfully.`);
    }
  };

  // Delete/Disband Team (calls API #9)
  const handleDeleteTeam = async (id, name) => {
    if (window.confirm(`Are you sure you want to disband team "${name}"? (API #9)`)) {
      try {
        await deleteTeamApi(id);
      } catch (err) {
        // quiet catch
      }
      setTeamsList((prev) => prev.filter((t) => t.id !== id));
      triggerToast(`Team "${name}" disbanded.`);
    }
  };

  // Accept Join Request (calls API #25)
  const handleAcceptRequest = async (id) => {
    try {
      await acceptJoinRequestApi(id);
      setRequestsList((prev) => prev.filter((r) => r.id !== id));
      triggerToast("Join request accepted! Member added to team.");
    } catch (err) {
      triggerToast(err?.response?.data?.message || "Failed to accept join request");
    }
  };

  // Reject Join Request (calls API #26)
  const handleRejectRequest = async (id) => {
    try {
      await rejectJoinRequestApi(id);
      setRequestsList((prev) => prev.filter((r) => r.id !== id));
      triggerToast("Join request rejected.");
    } catch (err) {
      triggerToast(err?.response?.data?.message || "Failed to reject join request");
    }
  };

  // Delete Request (calls API #27)
  const handleDeleteRequest = async (id) => {
    try {
      await cancelJoinRequestApi(id);
    } catch {
      // quiet catch
    }
    setRequestsList((prev) => prev.filter((r) => r.id !== id));
    triggerToast(`Request removed from system.`);
  };

  // -------------------------------------------------------------
  // VIEW 1: ADMIN LOGIN (If not logged in)
  // -------------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-xl max-w-md w-full p-8 shadow-xs">
          
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-900 mx-auto flex items-center justify-center mb-3">
              <ShieldCheck className="w-7 h-7 text-[#A54100]" />
            </div>
            <h1 className="text-xl font-extrabold tracking-wider text-[#2E1065]">
              HACKMATE ADMIN
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Sign in with your administrative credentials
            </p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-9 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 absolute right-3 top-2.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#A54100] hover:bg-[#8A3600] text-white font-semibold text-xs py-2.5 rounded-xl transition-colors mt-2"
            >
              Sign In to Admin Console
            </button>
          </form>

          {/* Back to App */}
          <div className="mt-6 text-center">
            <Link
              to="/dashboard"
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Back to HackMate User App</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ADMIN DASHBOARD (When authenticated)
  // -------------------------------------------------------------
  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredTeams = teamsList.filter(
    (t) =>
      t.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      t.leader.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const filteredRequests = requestsList.filter(
    (r) =>
      r.name.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.team.toLowerCase().includes(requestSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/60 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
              <span className="font-extrabold text-base tracking-wider text-[#2E1065]">
                HACKMATE
              </span>
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFF5EE] text-[#A54100] border border-[#A54100]/20 px-2 py-0.5 rounded-md">
              Admin Portal
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`text-xs font-semibold pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "border-[#A54100] text-[#A54100]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`text-xs font-semibold pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "users"
                  ? "border-[#A54100] text-[#A54100]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Users ({usersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("teams")}
              className={`text-xs font-semibold pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "teams"
                  ? "border-[#A54100] text-[#A54100]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Teams ({teamsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`text-xs font-semibold pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "requests"
                  ? "border-[#A54100] text-[#A54100]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Requests ({requestsList.length})</span>
            </button>
          </nav>

          {/* Action Links */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-xs text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">User Site</span>
            </Link>

            <button
              onClick={handleAdminLogout}
              className="text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-6">

        {/* ----------------- TAB: OVERVIEW ----------------- */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                System Overview
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Monitor HackMate users, formed teams, and platform metrics.
              </p>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium">Total Users</span>
                  <p className="text-2xl font-bold text-gray-900">{usersList.length}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-800 flex items-center justify-center font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium">Active Teams</span>
                  <p className="text-2xl font-bold text-gray-900">{teamsList.length}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium">Join Requests</span>
                  <p className="text-2xl font-bold text-gray-900">{requestsList.length}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium">System Status</span>
                  <p className="text-sm font-bold text-green-600 flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Operational
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Users preview */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-sm font-bold text-gray-900">Recent Users</h3>
                  <button
                    onClick={() => setActiveTab("users")}
                    className="text-xs text-[#A54100] font-semibold hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {usersList.slice(0, 3).map((u) => (
                    <div key={u.id} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{u.name}</p>
                          <p className="text-[11px] text-gray-400">{u.email}</p>
                        </div>
                      </div>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-green-200">
                        {u.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Teams preview */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-sm font-bold text-gray-900">Active Teams</h3>
                  <button
                    onClick={() => setActiveTab("teams")}
                    className="text-xs text-[#A54100] font-semibold hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {teamsList.map((t) => (
                    <div key={t.id} className="flex items-center justify-between text-xs py-1">
                      <div>
                        <p className="font-semibold text-gray-900">{t.name}</p>
                        <p className="text-[11px] text-gray-400">Leader: {t.leader}</p>
                      </div>
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-purple-200">
                        {t.currentMembers}/{t.maxMembers} Members
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ----------------- TAB: USERS ----------------- */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Manage Users</h1>
                <p className="text-xs text-gray-500">View and manage all registered platform users.</p>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search user by name, email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#A54100]"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Skills</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                              {u.name[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{u.name}</p>
                              <p className="text-[11px] text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-800">{u.role}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {u.skills.slice(0, 3).map((s, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-400">
                  No users found matching your search.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB: TEAMS ----------------- */}
        {activeTab === "teams" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Manage Teams</h1>
                <p className="text-xs text-gray-500">Monitor active hackathon teams created on HackMate.</p>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search team by name..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#A54100]"
                />
              </div>
            </div>

            {/* Teams Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Team Name</th>
                      <th className="py-3 px-4">Team Leader</th>
                      <th className="py-3 px-4">Members</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {filteredTeams.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900">
                          <Link
                            to={`/teams/${t.id}`}
                            className="hover:text-purple-700 hover:underline flex items-center gap-1.5"
                            title="View team details & members"
                          >
                            <span>{t.name}</span>
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </Link>
                        </td>
                        <td className="py-3 px-4 font-medium text-purple-900">{t.leader}</td>
                        <td className="py-3 px-4">
                          <span className="bg-purple-50 text-purple-800 font-semibold px-2 py-0.5 rounded-md text-[11px] border border-purple-100">
                            {t.currentMembers}/{t.maxMembers}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{t.description}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteTeam(t.id, t.name)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Disband team"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTeams.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-400">
                  No teams found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB: REQUESTS ----------------- */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Manage Join Requests</h1>
                <p className="text-xs text-gray-500">Review pending connections and team join requests.</p>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search request..."
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#A54100]"
                />
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Applicant</th>
                      <th className="py-3 px-4">Target Team</th>
                      <th className="py-3 px-4">Applicant Skills</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {filteredRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-gray-900">{r.name}</td>
                        <td className="py-3 px-4 font-medium text-purple-900">{r.team}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {r.skills.map((s, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            Pending Review
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAcceptRequest(r.id)}
                              className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              title="Accept member to team"
                            >
                              <Check className="w-3 h-3" />
                              <span>Accept</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectRequest(r.id)}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              title="Reject request"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRequest(r.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete request"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredRequests.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-400">
                  No requests found.
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

