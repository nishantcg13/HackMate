import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { initialTeams } from "../data/dummyData";
import { ArrowLeft, Users, Check } from "lucide-react";
import { sendJoinRequestApi, getTeamByIdApi } from "../services/api";

export default function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requested, setRequested] = useState(false);
  const [team, setTeam] = useState(
    () => initialTeams.find((t) => t.id === parseInt(id)) || initialTeams[0]
  );

  // Check if current logged-in user is the team leader
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = loggedInUser?._id || loggedInUser?.id;
  const currentUserName = loggedInUser?.name || "Nishant Galande";

  const isLeader =
    (currentUserId && (team.leaderId === currentUserId || team.leader?._id === currentUserId || team.leader === currentUserId)) ||
    (currentUserName && (team.leader === currentUserName || team.leader?.name === currentUserName)) ||
    team.userRole === "Leader";

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await getTeamByIdApi(id);
        if (res?.data) {
          setTeam({
            id: res.data._id,
            _id: res.data._id,
            name: res.data.name,
            description: res.data.description,
            leader: res.data.leader?.name || res.data.leaderId?.name || "Team Leader",
            currentMembers: res.data.members?.length || 1,
            maxMembers: res.data.maxMembers || 5,
            skills: res.data.requiredSkills || ["DevOps", "UI/UX"],
            requiredSkills: res.data.requiredSkills || ["DevOps", "UI/UX"],
            members: res.data.members?.map((m) => ({
              name: m.user?.name || m.userId?.name || "Member",
              role: m.role || "Member",
              initial: (m.user?.name || m.userId?.name || "M")[0].toUpperCase(),
            })) || initialTeams[0].members,
          });
        }
      } catch (err) {
        // Fallback to initial
      }
    };
    if (id) fetchTeam();
  }, [id]);

  const handleRequestJoin = async () => {
    if (isLeader) return;
    setRequested(true);
    try {
      await sendJoinRequestApi(team._id || team.id, "Hi, I want to join your team!");
    } catch (err) {
      console.log("Join request handled in demo state:", err?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate("/teams")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Team Details</span>
        </button>

        {/* Team Header Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {team.name}
              </h1>
              <p className="text-xs text-gray-500 mt-1 mb-3">
                {team.description}
              </p>

              {/* Skill Badges */}
              <div className="flex flex-wrap gap-1.5">
                {team.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-md font-medium border border-purple-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Meta Info in Header Card */}
          <div className="bg-purple-50/40 border border-purple-100/60 rounded-xl p-4 min-w-[180px] space-y-2 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                Team Leader
              </span>
              <span className="font-bold text-purple-900 text-xs">
                {team.leader}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                Members
              </span>
              <span className="font-bold text-purple-900 text-xs">
                {team.currentMembers}/{team.maxMembers}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Team Members (Left) and Required Skills / CTA (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Team Members */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900">
              Team Members
            </h2>

            <div className="space-y-3">
              {team.members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {member.initial}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-800">
                      {member.name}
                    </span>
                    {member.role === "Leader" && (
                      <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full border border-green-200">
                        Leader
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Required Skills & Action */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {team.requiredSkills.map((reqSkill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-medium border border-purple-100"
                  >
                    {reqSkill}
                  </span>
                ))}
              </div>
            </div>

            {/* Request to Join button or Leader badge */}
            {isLeader ? (
              <div className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center bg-green-50 text-green-700 border border-green-200">
                You are the Leader of this Team
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRequestJoin}
                disabled={requested}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                  requested
                    ? "bg-green-600 text-white cursor-default"
                    : "bg-[#A54100] hover:bg-[#8A3600] text-white"
                }`}
              >
                {requested ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Request Sent Successfully</span>
                  </>
                ) : (
                  "Request to Join"
                )}
              </button>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}

