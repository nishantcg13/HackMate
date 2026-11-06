import React, { useState } from "react";
import { UserPlus, Check, Filter } from "lucide-react";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";

export default function FindTeammates({
  currentUser,
  participants = [],
  onRequestConnect,
  sentRequestIds = [],
  onLogout,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("ALL");
  const [toastMessage, setToastMessage] = useState("");

  const skillFilters = [
    "ALL",
    "React",
    "Node.js",
    "Python",
    "Figma",
    "Java",
    "Flutter",
    "Docker",
    "PostgreSQL",
  ];

  const handleConnect = (participant) => {
    if (onRequestConnect) {
      onRequestConnect(participant);
    }
    setToastMessage(`Connection request sent to ${participant.name}!`);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const filteredParticipants = participants.filter((p) => {
    // Skill filter
    if (selectedSkill !== "ALL") {
      const hasSkill = p.skills.some(
        (s) => s.toLowerCase() === selectedSkill.toLowerCase()
      );
      if (!hasSkill) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchRole = p.role.toLowerCase().includes(q);
      const matchBio = p.bio.toLowerCase().includes(q);
      const matchSkills = p.skills.some((s) => s.toLowerCase().includes(q));
      const matchInterests = p.interests?.some((i) => i.toLowerCase().includes(q));
      return matchName || matchRole || matchBio || matchSkills || matchInterests;
    }

    return true;
  });

  return (
    <AppLayout
      currentUser={currentUser}
      onLogout={onLogout}
      searchPlaceholder="Search participants by name, skill, interest..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="max-w-5xl space-y-6">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Find Hackathon Teammates
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Discover participants based on technical skills and project interests.
            </p>
          </div>
          <span className="text-xs text-gray-500">
            Showing <strong className="text-gray-900">{filteredParticipants.length}</strong> participants
          </span>
        </div>

        {/* Skill Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-gray-500 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter by Skill:
          </span>
          {skillFilters.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => setSelectedSkill(skill)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors shrink-0 ${
                selectedSkill === skill
                  ? "bg-[#A54100] text-white border-[#A54100]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Participants Cards Grid */}
        {filteredParticipants.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl text-xs text-gray-500">
            No participants found matching your criteria. Try resetting the filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParticipants.map((p) => {
              const isSent = sentRequestIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className="w-11 h-11 rounded-full bg-gray-100 text-gray-800 font-bold flex items-center justify-center text-sm shrink-0 border border-gray-200">
                        {p.initials}
                      </div>

                      <div className="overflow-hidden">
                        <h3 className="text-sm font-bold text-gray-900 truncate">
                          {p.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#A54100] truncate">
                          {p.role}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                          {p.experience}
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3 min-h-[32px]">
                      {p.bio}
                    </p>

                    {/* Skills */}
                    <div className="mb-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Skills:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {p.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-gray-50 text-gray-700 border border-gray-200 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interests */}
                    {p.interests && (
                      <div className="mb-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Interests:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {p.interests.map((int, idx) => (
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

                  {/* Connect / Request Button */}
                  <div className="pt-2 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant={isSent ? "secondary" : "primary"}
                      className="w-full text-xs font-semibold"
                      onClick={() => handleConnect(p)}
                      disabled={isSent}
                      icon={isSent ? Check : UserPlus}
                    >
                      {isSent ? "Request Sent" : "Connect / Request"}
                    </Button>
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
