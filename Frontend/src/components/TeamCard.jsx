import React from "react";
import { Users, Award, Check, ArrowRight } from "lucide-react";
import Button from "./Button";

export default function TeamCard({ team, onJoin, isMember, onView }) {
  if (!team) return null;

  const isFull = team.members && team.members.length >= team.maxMembers;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Status & Member Count Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
              isFull || team.status === "FULL"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
            }`}
          >
            {isFull || team.status === "FULL" ? "Full Team" : "Open for Members"}
          </span>

          <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 flex items-center gap-1 font-medium">
            <Users className="w-3 h-3 text-blue-600" />
            {team.members ? team.members.length : 0} / {team.maxMembers} Members
          </span>
        </div>

        {/* Team Name and Hackathon */}
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
          {team.name}
        </h3>
        <p className="text-xs text-blue-600 font-semibold mb-3 flex items-center gap-1">
          <Award className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{team.hackathonName}</span>
        </p>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
          {team.description}
        </p>

        {/* Members Roster */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Members:</span>
            <span className="text-[11px] text-gray-600 font-normal">
              Lead: {team.leaderName}
            </span>
          </p>
          <div className="space-y-1.5">
            {team.members &&
              team.members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-gray-50 border border-gray-200 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-gray-900 font-medium truncate">
                      {member.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 shrink-0">
                    {member.role || "Member"}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Looking For Skills */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Looking For:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {team.requiredSkills &&
              team.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => onView && onView(team)}
        >
          View Team
        </Button>
        <Button
          variant={isMember ? "secondary" : "primary"}
          size="sm"
          className="w-full"
          disabled={isFull && !isMember}
          onClick={() => onJoin && onJoin(team)}
          icon={isMember ? Check : ArrowRight}
        >
          {isMember ? "Joined" : isFull ? "Full" : "Join Team"}
        </Button>
      </div>
    </div>
  );
}
