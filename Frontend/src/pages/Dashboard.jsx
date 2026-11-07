import React from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, UserCheck, ArrowRight, PlusCircle } from "lucide-react";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";

export default function Dashboard({
  currentUser,
  participants = [],
  teams = [],
  requests = [],
  onLogout,
}) {
  // Recommended participants looking for teammates
  const recommendedParticipants = participants.slice(0, 3);

  // User's teams
  const userTeams = teams.filter(
    (t) =>
      t.leaderName === currentUser?.name ||
      t.members?.some((m) => m.name === currentUser?.name)
  );

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="max-w-5xl space-y-8">
        
        {/* 1. Welcome & User Summary */}
        <div className="bg-[#FFF5EE] border border-orange-200/80 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#A54100] text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              {currentUser?.initials || "NG"}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Welcome back, {currentUser?.name || "Nishant"}!
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">
                {currentUser?.role || "Hackathon Participant"} • Ready to build
              </p>
              
              {/* User's skills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {currentUser?.skills?.slice(0, 4).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-gray-700 border border-orange-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Link to="/find-teammates" className="w-full sm:w-auto">
              <Button size="sm" icon={UserPlus} className="w-full sm:w-auto">
                Find Teammates
              </Button>
            </Link>
            <Link to="/create-team" className="w-full sm:w-auto">
              <Button variant="secondary" size="sm" icon={PlusCircle} className="w-full sm:w-auto">
                Create Team
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Key Metrics for Hackathon Collaboration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-3xl font-extrabold text-gray-900">
                {userTeams.length}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">My Teams</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#FFF5EE] text-[#A54100] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-3xl font-extrabold text-gray-900">
                {participants.length}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">Available Teammates</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#FFF5EE] text-[#A54100] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-3xl font-extrabold text-gray-900">
                {requests.length}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">Pending Requests</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#FFF5EE] text-[#A54100] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* 3. Recommended Participants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Recommended Participants
              </h2>
              <p className="text-xs text-gray-500">
                Hackathon builders looking for teammates with complementary skills
              </p>
            </div>
            <Link
              to="/find-teammates"
              className="text-xs font-semibold text-[#A54100] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendedParticipants.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-800 font-bold flex items-center justify-center text-xs shrink-0">
                      {p.initials}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{p.name}</h3>
                      <p className="text-[11px] text-[#A54100] font-medium">{p.role}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                    {p.bio}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {p.skills.slice(0, 3).map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <Link to="/find-teammates">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Profile
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 4. My Active Teams Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">My Teams</h2>
              <p className="text-xs text-gray-500">Squads you have created or joined</p>
            </div>
            <Link
              to="/teams"
              className="text-xs font-semibold text-[#A54100] hover:underline flex items-center gap-1"
            >
              <span>Manage Teams</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userTeams.map((team) => (
              <div
                key={team.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{team.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{team.description}</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {team.members.length} / {team.maxMembers} members • Lead: {team.leaderName}
                  </p>
                </div>
                <Link to="/teams">
                  <Button variant="secondary" size="sm" className="text-xs">
                    View Team
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
