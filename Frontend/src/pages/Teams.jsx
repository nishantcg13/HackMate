import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Users, PlusCircle, UserPlus, LogOut, Check } from "lucide-react";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";

export default function Teams({
  currentUser,
  teams = [],
  onLeaveTeam,
  onLogout,
}) {
  const [toastMessage, setToastMessage] = useState("");

  // Teams the user is a part of (as leader or member)
  const myTeams = teams.filter(
    (t) =>
      t.leaderName === currentUser?.name ||
      t.members?.some((m) => m.name === currentUser?.name)
  );

  const handleLeave = (teamId, teamName) => {
    if (onLeaveTeam) onLeaveTeam(teamId);
    setToastMessage(`Left team "${teamName}".`);
    setTimeout(() => setToastMessage(""), 2500);
  };

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="max-w-4xl space-y-6">
        
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Teams</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage hackathon teams you have created or joined.
            </p>
          </div>

          <Link to="/create-team">
            <Button size="md" icon={PlusCircle} className="text-xs font-semibold">
              Create a Team
            </Button>
          </Link>
        </div>

        {/* Teams List */}
        {myTeams.length === 0 ? (
          <div className="text-center py-14 bg-white border border-gray-200 rounded-2xl p-6">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900">You haven't joined any teams yet</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5 max-w-sm mx-auto">
              Start your own squad and recruit teammates, or connect with participants on HackMate.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/create-team">
                <Button size="sm">Create a Team</Button>
              </Link>
              <Link to="/find-teammates">
                <Button variant="secondary" size="sm">Find Teammates</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {myTeams.map((team) => {
              const isLeader = team.leaderName === currentUser?.name;

              return (
                <div
                  key={team.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5"
                >
                  {/* Team Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-150">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-lg font-bold text-gray-900">
                          {team.name}
                        </h2>
                        {isLeader && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FFF5EE] text-[#A54100] border border-orange-200">
                            Team Leader
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 max-w-xl">
                        {team.description}
                      </p>
                    </div>

                    <div className="text-xs font-semibold text-gray-500">
                      Capacity: {team.members.length} / {team.maxMembers} Members
                    </div>
                  </div>

                  {/* Required Skills & Interests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-bold text-gray-700 mb-1">Target Skills Needed:</p>
                      <div className="flex flex-wrap gap-1">
                        {team.requiredSkills?.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {team.interests && (
                      <div>
                        <p className="font-bold text-gray-700 mb-1">Project Domains:</p>
                        <div className="flex flex-wrap gap-1">
                          {team.interests.map((int, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-[#FFF5EE] text-[#A54100] font-medium"
                            >
                              {int}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Team Roster / Members List */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 mb-2">
                      Team Roster ({team.members.length} Members)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {team.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#A54100] text-white flex items-center justify-center font-bold text-[10px]">
                              {member.initials || member.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-900">{member.name}</span>
                          </div>
                          <span className="text-[11px] text-gray-500">{member.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <Link to="/find-teammates">
                      <Button variant="secondary" size="sm" icon={UserPlus} className="text-xs">
                        Invite More Teammates
                      </Button>
                    </Link>

                    {!isLeader && (
                      <button
                        type="button"
                        onClick={() => handleLeave(team.id, team.name)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        Leave Team
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
