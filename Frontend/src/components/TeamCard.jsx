import React from "react";
import { Users, Check } from "lucide-react";
import Button from "./Button";

export default function TeamCard({ team, onJoin, isMember }) {
  if (!team) return null;

  const isFull = team.members && team.members.length >= team.maxMembers;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-gray-900 truncate">
            {team.name}
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
            {team.members.length} / {team.maxMembers}
          </span>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
          {team.description}
        </p>

        {/* Members */}
        <div className="mb-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Members:
          </p>
          <div className="flex items-center gap-1">
            {team.members.map((m, idx) => (
              <span
                key={idx}
                className="w-6 h-6 rounded-full bg-[#FFF5EE] text-[#A54100] border border-orange-200 flex items-center justify-center font-bold text-[9px]"
                title={m.name}
              >
                {m.initials || m.name.slice(0, 2).toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Needed Skills */}
        {team.requiredSkills && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Skills Needed:
            </p>
            <div className="flex flex-wrap gap-1">
              {team.requiredSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded bg-gray-50 text-gray-700 border border-gray-200 font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-gray-100">
        <Button
          size="sm"
          className="w-full text-xs font-semibold"
          variant={isMember ? "secondary" : "primary"}
          disabled={isFull && !isMember}
          onClick={() => onJoin && onJoin(team.id, team.name)}
          icon={isMember ? Check : null}
        >
          {isMember ? "Joined" : isFull ? "Team Full" : "Join Team"}
        </Button>
      </div>
    </div>
  );
}
