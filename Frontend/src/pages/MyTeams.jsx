import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { initialTeams } from "../data/dummyData";
import { Users, Eye, Plus } from "lucide-react";
import { getTeamsApi } from "../services/api";

export default function MyTeams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState(initialTeams);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await getTeamsApi();
        if (res?.data && res.data.length > 0) {
          setTeams(res.data);
        }
      } catch (e) {
        console.log("Using initial teams fallback:", e?.message);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* Header Title & Create Team Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              My Teams
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Teams you have created or joined.
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

        {/* List of My Teams */}
        <div className="space-y-4">
          {teams.map((team) => (
            <div
              key={team.id || team._id}
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
                    {/* Role Badge: Leader or Member */}
                    <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full border border-green-200">
                      {team.userRole || "Member"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-0.5 mb-2.5">
                    {team.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {(team.skills || team.requiredSkills || []).map((skill, idx) => (
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
                  {team.currentMembers || 1}/{team.maxMembers || 5} Members
                </span>

                <button
                  type="button"
                  onClick={() => navigate(`/teams/${team.id || team._id}`)}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold border border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Team</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
