import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, UserCheck, MapPin, ArrowRight } from "lucide-react";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";

export default function Dashboard({
  currentUser,
  hackathons = [],
  teams = [],
  requests = [],
  onLogout,
}) {
  const featuredHackathon = hackathons[0];

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="max-w-5xl space-y-8">
        
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Welcome back, {currentUser?.name?.split(" ")[0] || "Nishant"}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Keep exploring and build something amazing.
          </p>
        </div>

        {/* 3 Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card 1: Hackathons */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-3xl font-extrabold text-gray-900">
                {currentUser?.stats?.hackathons || 5}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">Hackathons</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#FFF1E7] text-[#D9531E] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Teams */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-3xl font-extrabold text-gray-900">
                {currentUser?.stats?.teams || 12}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">Teams</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#FFF1E7] text-[#D9531E] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Requests */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-3xl font-extrabold text-gray-900">
                {currentUser?.stats?.requests || 3}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">Requests</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#FFF1E7] text-[#D9531E] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Upcoming Hackathons Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              Upcoming Hackathons
            </h2>
            <Link
              to="/hackathons"
              className="text-xs font-semibold text-[#D9531E] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Horizontal Hackathon Card matching Screenshot */}
          {featuredHackathon && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={featuredHackathon.image}
                  alt={featuredHackathon.title}
                  className="w-20 h-16 sm:w-28 sm:h-20 rounded-lg object-cover bg-gray-900 shrink-0"
                />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">
                    {featuredHackathon.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {featuredHackathon.startDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {featuredHackathon.mode}
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/hackathons" className="w-full sm:w-auto">
                <Button size="sm" className="w-full sm:w-auto px-5">
                  View Details
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
