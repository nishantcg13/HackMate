import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Search, Users, Check, Plus, Calendar, Star } from "lucide-react";
import {
  getTeamsApi,
  searchTeamsApi,
  getRecommendedTeamsApi,
  sendJoinRequestApi,
  getSentRequestsApi,
  getMyTeamsApi,
} from "../services/api";
import { formatDate } from "../utils/dateUtils";

export default function FindTeams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [viewMode, setViewMode] = useState("all"); // 'all' or 'recommended'
  const [requestedTeamIds, setRequestedTeamIds] = useState([]);
  const [myMemberTeamIds, setMyMemberTeamIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestMsg, setRequestMsg] = useState("");

  // Get current logged-in user
  const loggedInUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();
  const currentUserId = loggedInUser?._id || loggedInUser?.id;

  const fetchSentRequestsAndTeams = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const [sentRes, myTeamsRes] = await Promise.allSettled([
        getSentRequestsApi(),
        getMyTeamsApi(),
      ]);

      if (sentRes.status === "fulfilled" && sentRes.value?.data) {
        const pendingIds = sentRes.value.data
          .filter((r) => r.status === "Pending")
          .map((r) => (r.team?._id || r.team || r.teamId)?.toString())
          .filter(Boolean);
        setRequestedTeamIds(pendingIds);
      }

      if (myTeamsRes.status === "fulfilled" && myTeamsRes.value?.teams) {
        const memberIds = myTeamsRes.value.teams
          .map((t) => (t._id || t.id)?.toString())
          .filter(Boolean);
        setMyMemberTeamIds(memberIds);
      }
    } catch (err) {
      console.error("Error fetching sent requests or user teams:", err);
    }
  };

  const fetchTeams = async (searchTerm = searchName) => {
    try {
      setLoading(true);
      if (viewMode === "recommended") {
        const res = await getRecommendedTeamsApi();
        setTeams(res?.teams || []);
      } else if (searchTerm.trim()) {
        const res = await searchTeamsApi({ q: searchTerm.trim() });
        setTeams(res?.teams || []);
      } else {
        const res = await getTeamsApi();
        setTeams(res?.teams || res?.data || []);
      }
    } catch (err) {
      console.error("Error fetching teams:", err?.message);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchSentRequestsAndTeams();
  }, [viewMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTeams();
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchName(val);
    if (!val.trim()) {
      fetchTeams("");
    }
  };

  const handleRequestJoin = async (e, teamId) => {
    e.stopPropagation();
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    const teamIdStr = teamId?.toString();
    if (requestedTeamIds.includes(teamIdStr)) return;
    if (myMemberTeamIds.map(String).includes(teamIdStr)) {
      setRequestMsg("You are already a member of this team!");
      setTimeout(() => setRequestMsg(""), 3000);
      return;
    }

    try {
      setRequestedTeamIds((prev) => [...prev, teamIdStr]);
      await sendJoinRequestApi(teamId, "I would like to join this team.");
      setRequestMsg("Request sent successfully!");
      setTimeout(() => setRequestMsg(""), 3000);
    } catch (err) {
      console.error("Team join request error:", err?.response?.data?.message || err?.message);
      const errMsg = err?.response?.data?.message || err?.message || "";
      if (
        errMsg.toLowerCase().includes("already a member") ||
        errMsg.toLowerCase().includes("already member")
      ) {
        setMyMemberTeamIds((prev) => (prev.includes(teamIdStr) ? prev : [...prev, teamIdStr]));
        setRequestedTeamIds((prev) => prev.filter((id) => id !== teamIdStr));
        setRequestMsg("You are already a member of this team!");
        setTimeout(() => setRequestMsg(""), 3000);
      } else if (
        err?.response?.status === 409 ||
        errMsg.toLowerCase().includes("already have a pending request")
      ) {
        setRequestedTeamIds((prev) =>
          prev.includes(teamIdStr) ? prev : [...prev, teamIdStr]
        );
      } else {
        setRequestedTeamIds((prev) => prev.filter((id) => id !== teamIdStr));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">

        {/* Header Title & Create Team Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Find Teams
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Browse teams looking for members or discover skill-matched recommendations.
            </p>
          </div>

          <Link
            to="/create-team"
            className="bg-[#A54100] hover:bg-[#8A3600] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Team</span>
          </Link>
        </div>

        {/* Success toast */}
        {requestMsg && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{requestMsg}</span>
          </div>
        )}

        {/* View mode toggle: All Teams vs Recommended (API #13) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "all"
                ? "bg-[#2E1065] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All Teams
          </button>
          <button
            type="button"
            onClick={() => setViewMode("recommended")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "recommended"
                ? "bg-purple-800 text-white"
                : "bg-white text-purple-800 border border-purple-200 hover:bg-purple-50"
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Recommended</span>
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by team name, skill, or keyword..."
              value={searchName}
              onChange={handleSearchChange}
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-700 focus:border-purple-700 shadow-2xs"
            />
          </div>

          <button
            type="submit"
            className="bg-[#2E1065] hover:bg-[#1f0a44] text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors shadow-2xs shrink-0"
          >
            Search
          </button>
        </form>

        {/* Teams List */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-xs text-gray-500">
            Loading teams from database...
          </div>
        ) : (
          <div className="space-y-3">
            {teams.map((team) => {
              const teamId = (team._id || team.id)?.toString();
              const isRequested = requestedTeamIds.map(String).includes(teamId);
              const isMember = Boolean(team.isMember || myMemberTeamIds.map(String).includes(teamId));

              // Check if user is the leader of this team
              const isLeader =
                currentUserId &&
                (team.leader?._id?.toString() === currentUserId?.toString() ||
                  team.leader?.toString() === currentUserId?.toString() ||
                  team.leaderId?.toString() === currentUserId?.toString());

              const skills = team.requiredSkills || team.skills || [];

              return (
                <div
                  key={teamId}
                  onClick={() => navigate(`/teams/${teamId}`)}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-gray-300 transition-all cursor-pointer"
                >
                  {/* Left: Icon + Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <Users className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-900">
                          {team.name}
                        </h3>
                        {team.status && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${team.status === "OPEN"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}>
                            {team.status}
                          </span>
                        )}
                        {(team.startDate || team.endDate) && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-purple-600" />
                            {team.startDate ? formatDate(team.startDate) : ""}
                            {team.startDate && team.endDate ? " - " : ""}
                            {team.endDate ? formatDate(team.endDate) : ""}
                          </span>
                        )}
                        {team.registrationDeadline && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-600" />
                            Reg Closes: {formatDate(team.registrationDeadline)}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-1 mb-2">
                        {team.description}
                      </p>

                      {/* Skill Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded-md font-medium border border-purple-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Member Count & Action Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <span className="text-xs text-gray-600 font-semibold">
                      Max {team.maxMembers || 4} Members
                    </span>

                    {isLeader ? (
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                        Your Team (Leader)
                      </span>
                    ) : isMember ? (
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        Member
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleRequestJoin(e, teamId)}
                        disabled={isRequested}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${isRequested
                          ? "bg-green-50 text-green-700 border-green-200 cursor-default"
                          : "bg-white text-[#A54100] border-[#A54100] hover:bg-[#A54100] hover:text-white"
                          }`}
                      >
                        {isRequested ? ( 
                          <span className="flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Requested
                          </span>
                        ) : (
                          "Request to Join"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && teams.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center space-y-3">
            <Users className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">No teams found</p>
            <p className="text-xs text-gray-400">
              {viewMode === "recommended"
                ? "No teams match your current profile skills yet. Try browsing all teams or updating your skills!"
                : "No teams matched your search criteria. Be the first to create one!"}
            </p>
            <Link
              to="/create-team"
              className="inline-flex items-center gap-1.5 bg-[#A54100] hover:bg-[#8A3600] text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create a Team</span>
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
