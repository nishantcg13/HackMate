import React from "react";
import { UserPlus, Check } from "lucide-react";
import Button from "./Button";

export default function TeammateCard({ teammate, onConnect, isConnected }) {
  if (!teammate) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
      <div>
        {/* Avatar and Basic Info */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="w-12 h-12 rounded-full bg-[#FFF5EE] text-[#A54100] border border-orange-200 flex items-center justify-center font-bold text-sm shrink-0">
            {teammate.initials || teammate.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="overflow-hidden">
            <h3 className="text-sm font-bold text-gray-900 truncate">
              {teammate.name}
            </h3>
            <p className="text-xs font-semibold text-[#A54100] truncate">
              {teammate.role}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5 truncate">
              {teammate.experience}
            </p>
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3 min-h-[32px]">
          {teammate.bio}
        </p>

        {/* Technical Skills */}
        <div className="mb-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Skills:
          </p>
          <div className="flex flex-wrap gap-1">
            {teammate.skills &&
              teammate.skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-[10px] px-2 py-0.5 rounded bg-gray-50 text-gray-700 border border-gray-200 font-medium"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>

        {/* Project Interests */}
        {teammate.interests && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Interests:
            </p>
            <div className="flex flex-wrap gap-1">
              {teammate.interests.map((int, index) => (
                <span
                  key={index}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#FFF5EE] text-[#A54100] font-medium"
                >
                  {int}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-gray-100">
        <Button
          variant={isConnected ? "secondary" : "primary"}
          size="sm"
          className="w-full text-xs font-semibold"
          onClick={() => onConnect && onConnect(teammate)}
          disabled={isConnected}
          icon={isConnected ? Check : UserPlus}
        >
          {isConnected ? "Request Sent" : "Connect / Request"}
        </Button>
      </div>
    </div>
  );
}
