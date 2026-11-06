import React from "react";
import { MapPin, Briefcase, UserPlus, Check } from "lucide-react";
import Button from "./Button";

export default function TeammateCard({ teammate, onConnect, isConnected }) {
  if (!teammate) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Avatar and Basic Info */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <img
            src={teammate.avatar}
            alt={teammate.name}
            className="w-12 h-12 rounded-xl object-cover border border-gray-200"
          />

          <div className="overflow-hidden">
            <h3 className="text-base font-bold text-gray-900 truncate">
              {teammate.name}
            </h3>
            <p className="text-xs font-semibold text-blue-600 truncate">
              {teammate.role}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
              <span className="flex items-center gap-1 truncate">
                <Briefcase className="w-3 h-3 text-gray-400" />
                {teammate.experienceLevel}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-gray-400" />
                {teammate.location}
              </span>
            </div>
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4 min-h-[32px]">
          {teammate.bio}
        </p>

        {/* Availability Badge */}
        {teammate.availability && (
          <div className="mb-3">
            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">
              {teammate.availability}
            </span>
          </div>
        )}

        {/* Technical Skills */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Skills:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {teammate.skills &&
              teammate.skills.map((skill, index) => (
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

      {/* Action Button */}
      <div className="pt-2 border-t border-gray-100">
        <Button
          variant={isConnected ? "secondary" : "primary"}
          size="sm"
          className="w-full"
          onClick={() => onConnect && onConnect(teammate)}
          icon={isConnected ? Check : UserPlus}
        >
          {isConnected ? "Invite Sent" : "Invite to Team"}
        </Button>
      </div>
    </div>
  );
}
