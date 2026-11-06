import React, { useState } from "react";
import { Users, Plus, Check } from "lucide-react";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";

export default function Teams({
  currentUser,
  teams = [],
  onCreateTeam,
  onJoinTeam,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState("find"); // "find" | "create"
  const [searchQuery, setSearchQuery] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [joinedTeamIds, setJoinedTeamIds] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const created = {
      id: "t_" + Date.now(),
      name: newTeamName.trim(),
      description: "Collaborative project team building innovative solutions.",
      hackathonName: "TechNova Hackathon 2025",
      membersCount: 1,
      extraCount: 0,
      members: [currentUser ? currentUser.name : "Nishant"],
    };

    if (onCreateTeam) onCreateTeam(created);
    setNewTeamName("");
    setActiveTab("find");
    setToastMessage(`Team "${created.name}" created! 🚀`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleJoin = (teamId, teamName) => {
    if (!joinedTeamIds.includes(teamId)) {
      setJoinedTeamIds([...joinedTeamIds, teamId]);
    }
    if (onJoinTeam) onJoinTeam(teamId);
    setToastMessage(`Requested to join "${teamName}"! 🎉`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const filteredTeams = teams.filter((t) => {
    if (!searchQuery.trim()) return true;
    return (
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <AppLayout
      currentUser={currentUser}
      onLogout={onLogout}
      searchPlaceholder={activeTab === "find" ? "Search teams..." : ""}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="max-w-4xl space-y-6">
        
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Switcher: Find Teams vs Create a Team */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("find")}
            className={`text-sm font-bold pb-2 transition-colors border-b-2 -mb-2.5 ${
              activeTab === "find"
                ? "border-[#D9531E] text-[#D9531E]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Find Teams
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`text-sm font-bold pb-2 transition-colors border-b-2 -mb-2.5 ml-4 ${
              activeTab === "create"
                ? "border-[#D9531E] text-[#D9531E]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Create a Team
          </button>
        </div>

        {/* TAB 1: FIND TEAMS (SCREEN 7) */}
        {activeTab === "find" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Teams</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Explore teams and join the ones that match your interests.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredTeams.map((team) => {
                const isJoined = joinedTeamIds.includes(team.id);

                return (
                  <div
                    key={team.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">
                        {team.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                        {team.description}
                      </p>

                      {/* Member Avatars Stack matching Screenshot 7 */}
                      <div className="flex items-center gap-1.5 mb-5">
                        <div className="flex -space-x-2">
                          <span className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-700">
                            N
                          </span>
                          <span className="w-7 h-7 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-amber-700">
                            S
                          </span>
                          <span className="w-7 h-7 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-green-700">
                            A
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gray-500">
                          +{team.extraCount || 2}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full text-xs font-semibold"
                      variant={isJoined ? "secondary" : "primary"}
                      onClick={() => handleJoin(team.id, team.name)}
                      icon={isJoined ? Check : null}
                    >
                      {isJoined ? "Requested" : "Join Team"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CREATE A TEAM (SCREEN 6) */}
        {activeTab === "create" && (
          <div className="flex justify-center pt-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full shadow-xs text-center">
              
              {/* Illustration / Icons matching Screenshot 6 */}
              <div className="flex items-center justify-center gap-2 mb-4 text-[#D9531E]">
                <div className="w-12 h-12 rounded-full bg-[#FFF1E7] flex items-center justify-center text-[#D9531E]">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Create a Team
              </h2>
              <p className="text-xs text-gray-500 mt-1 mb-6">
                Start a new team and find your teammates.
              </p>

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Team Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter team name..."
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#D9531E] focus:border-[#D9531E]"
                  />
                </div>

                <Button
                  type="submit"
                  size="md"
                  className="w-full py-2.5 font-semibold text-xs"
                >
                  Create Team
                </Button>
              </form>

            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
