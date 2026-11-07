import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Users, Eye, Plus, Sparkles } from "lucide-react";
import { getMyTeamsApi } from "../services/api";

export default function MyTeams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();
  const currentUserId = loggedInUser?._id || loggedInUser?.id;

  useEffect(() => {
    const fetchMyTeams = async () => {
      try {
        setLoading(true);
        const res = await getMyTeamsApi();
        setTeams(res?.teams || []);
      } catch (e) {
        console.error("Error fetching my teams:", e?.message);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTeams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* Header Title & Create Team Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              My Teams
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Teams you have created or joined as a member (API #10).
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

        {/* Loading state */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-xs text-gray-500">
            Loading your teams...
          </div>
        )}

        {/* List of My Teams */}
        {!loading && (
          <div className="space-y-4">
            {teams.map((team) => {
              const teamId = team._id || team.id;
              const isLeader =
                currentUserId &&
                (team.leader?._id === currentUserId ||
                  team.leader === currentUserId ||
                  team.leaderId === currentUserId);

              const roleLabel = isLeader ? "Leader" : "Member";
              const skills = team.requiredSkills || team.skills || [];

              return (
                <div
                  key={teamId}
                  className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-purple-200 hover:shadow-sm transition-all"
                >
                  {/* Left Side: Icon + Details */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900">
                          {team.name}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isLeader
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {roleLabel}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mt-0.5 mb-2.5">
                        {team.description}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill, idx) => (
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

                  {/* Right Side: Members Count & View Team Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <span className="text-xs text-purple-700 font-semibold">
                      Max {team.maxMembers || 4} Members
                    </span>

                    <button
                      type="button"
                      onClick={() => navigate(`/teams/${teamId}`)}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold border border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && teams.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-3">
            <Users className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">You haven't joined or created any teams yet</p>
            <p className="text-xs text-gray-400">
              Create your own team to recruit members, or browse open teams to join!
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                to="/create-team"
                className="bg-[#A54100] hover:bg-[#8A3600] text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Create Team
              </Link>
              <Link
                to="/teams"
                className="border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Browse Teams
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
