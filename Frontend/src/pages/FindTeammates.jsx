import React, { useState } from "react";
import { Users, Filter, Check } from "lucide-react";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import TeammateCard from "../components/TeammateCard";

export default function FindTeammates({
  teammates = [],
  onConnectTeammate,
  connectedTeammateIds = [],
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedSkill, setSelectedSkill] = useState("ALL");
  const [notification, setNotification] = useState("");

  const roles = [
    "ALL",
    "Frontend Developer",
    "Backend Engineer",
    "UI/UX Designer",
    "AI / ML Specialist",
    "Smart Contract Developer",
    "Mobile App Developer",
  ];

  const popularSkills = ["ALL", "React", "Python", "Node.js", "Figma", "Solidity", "Tailwind CSS"];

  const handleConnect = (teammate) => {
    if (onConnectTeammate) onConnectTeammate(teammate);
    setNotification(`Invitation sent to ${teammate.name}! 🎉`);
    setTimeout(() => setNotification(""), 3000);
  };

  const filteredTeammates = teammates.filter((t) => {
    if (selectedRole !== "ALL" && !t.role.toLowerCase().includes(selectedRole.toLowerCase())) {
      return false;
    }

    if (selectedSkill !== "ALL") {
      const hasSkill = t.skills?.some(
        (s) => s.toLowerCase() === selectedSkill.toLowerCase()
      );
      if (!hasSkill) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchRole = t.role.toLowerCase().includes(q);
      const matchSkills = t.skills?.some((s) => s.toLowerCase().includes(q));
      return matchName || matchRole || matchSkills;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Toast Alert */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1248]">
              Find Hackathon Teammates
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Connect with designers, developers, and data scientists.
            </p>
          </div>
          <span className="text-xs text-gray-500">
            Showing <strong className="text-gray-900">{filteredTeammates.length}</strong> builders
          </span>
        </div>

        {/* Search & Filters */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
              placeholder="Search by name, role, or technical skill..."
              className="flex-1"
            />

            {/* Role dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-semibold text-gray-500 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Role:
              </span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full md:w-48 bg-white border border-gray-300 text-xs text-gray-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Skill Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-gray-200 text-xs">
            <span className="font-semibold text-gray-500 mr-1 shrink-0">Filter Skill:</span>
            {popularSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => setSelectedSkill(skill)}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors shrink-0 ${
                  selectedSkill === skill
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Teammates */}
        {filteredTeammates.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-xl">
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-gray-800">No teammates matched your criteria</h3>
            <p className="text-xs text-gray-500 mt-1 mb-3">Try different keywords or clear your filters.</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedRole("ALL");
                setSelectedSkill("ALL");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeammates.map((teammate) => (
              <TeammateCard
                key={teammate.id}
                teammate={teammate}
                onConnect={handleConnect}
                isConnected={connectedTeammateIds.includes(teammate.id)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
