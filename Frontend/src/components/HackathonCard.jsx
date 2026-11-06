import React from "react";
import { Calendar, MapPin, Award } from "lucide-react";
import Button from "./Button";

export default function HackathonCard({ hackathon, onSelect, onJoinTeam }) {
  if (!hackathon) return null;

  // Mode badge styling based on logo colors
  const modeBadge = {
    Online: "bg-green-50 text-green-700 border-green-200",
    Offline: "bg-blue-50 text-blue-700 border-blue-200",
    Hybrid: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
              modeBadge[hackathon.mode] || modeBadge.Online
            }`}
          >
            {hackathon.mode}
          </span>
          {hackathon.prizePool && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold flex items-center gap-1">
              <Award className="w-3 h-3" />
              {hackathon.prizePool}
            </span>
          )}
        </div>

        {/* Title and Organizer */}
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
          {hackathon.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          By <span className="font-medium text-gray-700">{hackathon.organizer}</span>
        </p>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
          {hackathon.description}
        </p>

        {/* Dates & Location */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 py-2.5 border-t border-b border-gray-100 mb-4">
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{hackathon.startDate}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span className="truncate">{hackathon.location || "Online"}</span>
          </div>
        </div>

        {/* Skills Chips */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Key Skills:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {hackathon.requiredSkills &&
              hackathon.requiredSkills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-2 flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => onSelect && onSelect(hackathon)}
        >
          View Details
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => onJoinTeam && onJoinTeam(hackathon)}
        >
          Find Team
        </Button>
      </div>
    </div>
  );
}
