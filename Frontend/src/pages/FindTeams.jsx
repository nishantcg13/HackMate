import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { initialTeams } from "../data/dummyData";
import { Search, ChevronDown, Users, Check, Plus } from "lucide-react";
import { getTeamsApi, sendJoinRequestApi } from "../services/api";

export default function FindTeams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState(initialTeams);
  const [searchName, setSearchName] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All Skills");
  const [requestedTeamIds, setRequestedTeamIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get current logged-in user to check ownership
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = loggedInUser?._id || loggedInUser?.id;
  const currentUserName = loggedInUser?.name || "Nishant Galande";

  // Fetch real teams from MongoDB
  useEffect(() => {
    const fetchTeamsFromDb = async () => {
      try {
        setLoading(true);
        const res = await getTeamsApi();
        if (res?.data && res.data.length > 0) {
          const dbTeams = res.data.map((t) => ({
            id: t._id || t.id,
            _id: t._id || t.id,
            name: t.name,
            description: t.description || "Hackathon team",
            leader: t.leader || "Team Leader",
            currentMembers: t.currentMembers || 1,
            maxMembers: t.maxMembers || 5,
            skills: t.skills || t.requiredSkills || ["Web Development"],
            requiredSkills: t.requiredSkills || [],
          }));
          setTeams(dbTeams);
        }
      } catch (err) {
        console.log("Using initial teams fallback:", err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsFromDb();
  }, []);

  const skillsList = ["All Skills", "React", "Node.js", "MongoDB", "Java", "Spring Boot", "MySQL", "DevOps", "UI/UX"];

  const handleRequestJoin = async (e, teamId) => {
    e.stopPropagation(); // Prevent card navigation
    if (!requestedTeamIds.includes(teamId)) {
      setRequestedTeamIds([...requestedTeamIds, teamId]);
    }
    try {
      await sendJoinRequestApi(teamId, "I would like to join this team.");
    } catch (err) {
      console.log("Team join request logged:", err?.message);
    }
  };

  const filteredTeams = teams.filter((t) => {
    const matchName = t.name.toLowerCase().includes(searchName.toLowerCase());
    const matchSkill =
      selectedSkill === "All Skills" ||
      t.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());
    return matchName && matchSkill;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* Header Title & Create Team Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Find Teams
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Browse teams looking for members.
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

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by team name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-2xs"
            />
          </div>

          {/* Skill Dropdown */}
          <div className="relative min-w-[140px]">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 pr-8 text-xs text-gray-700 appearance-none focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-2xs cursor-pointer"
            >
              {skillsList.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Teams List Rows */}
        <div className="space-y-4">
          {filteredTeams.map((team) => {
            const isRequested = requestedTeamIds.includes(team.id);

            // Check if user is the leader of this team
            const isLeader =
              (currentUserId && (team.leaderId === currentUserId || team.leader?._id === currentUserId || team.leader === currentUserId)) ||
              (currentUserName && (team.leader === currentUserName || team.leader?.name === currentUserName)) ||
              team.userRole === "Leader";

            return (
              <div
                key={team.id}
                onClick={() => navigate(`/teams/${team.id}`)}
                className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer"
              >
                {/* Left: Icon + Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 hover:text-purple-900 transition-colors">
                      {team.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 mb-2.5">
                      {team.description}
                    </p>

                    {/* Skill Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {team.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium border border-purple-100/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Member Count & Action Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <span className="text-xs text-purple-700 font-semibold">
                    {team.currentMembers}/{team.maxMembers} Members
                  </span>

                  {isLeader ? (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                      Your Team (Leader)
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleRequestJoin(e, team.id)}
                      disabled={isRequested}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isRequested
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

        {filteredTeams.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-xs text-gray-400">
            No teams found matching your search.
          </div>
        )}

      </main>
    </div>
  );
}
