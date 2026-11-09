import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Users, Layers, UserCheck, ArrowRight, PlusCircle, Bell } from "lucide-react";
import { getMeApi, getMyTeamsApi, getReceivedRequestsApi } from "../services/api";

export default function Dashboard({ currentUser }) {
  const [profile, setProfile] = useState(currentUser);
  const [myTeamsCount, setMyTeamsCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [meRes, teamsRes, requestsRes] = await Promise.allSettled([
          getMeApi(),
          getMyTeamsApi(),
          getReceivedRequestsApi(),
        ]);

        if (meRes.status === "fulfilled" && meRes.value?.user) {
          setProfile(meRes.value.user);
          localStorage.setItem("user", JSON.stringify(meRes.value.user));
        }

        if (teamsRes.status === "fulfilled" && teamsRes.value?.teams) {
          setMyTeamsCount(teamsRes.value.teams.length);
        }

        if (requestsRes.status === "fulfilled" && requestsRes.value?.data) {
          const pendingOnly = requestsRes.value.data.filter(
            (r) => r.status === "Pending" || !r.status
          );
          setRequestsCount(pendingOnly.length);
        }
      } catch {
        // quiet catch
      }
    };
    fetchDashboardData();
  }, []);

  const userName =
    profile?.name?.split(" ")[0] || currentUser?.name?.split(" ")[0] || "Developer";

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar requestCount={requestsCount} />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">

        {/* Welcome Banner Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
              Connect with developers, join hackathon teams, and manage your project collaboration.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/create-team"
                className="bg-[#A54100] hover:bg-[#8A3600] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create a Team</span>
              </Link>

              {requestsCount > 0 && (
                <Link
                  to="/requests"
                  className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 hover:bg-purple-100 transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{requestsCount} Pending Join Requests</span>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Metrics Counter Box */}
          <div className="flex items-center gap-3 self-stretch md:self-auto shrink-0">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center min-w-[90px]">
              <span className="text-xl font-bold text-gray-900 block">{myTeamsCount}</span>
              <span className="text-[10px] uppercase font-semibold text-gray-500">My Teams</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center min-w-[90px]">
              <span className="text-xl font-bold text-purple-800 block">{requestsCount}</span>
              <span className="text-[10px] uppercase font-semibold text-gray-500">Requests</span>
            </div>
          </div>
        </div>

        {/* 3 Large Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* 1. Find Teammates (Solid Theme) */}
          <Link
            to="/teammates"
            className="group bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-center justify-between transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900 block">
                  Find Teammates
                </span>
                <span className="text-[11px] text-gray-500">Discover skilled developers</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
          </Link>

          {/* 2. Find Teams (Solid Theme) */}
          <Link
            to="/teams"
            className="group bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-center justify-between transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900 block">
                  Find Teams
                </span>
                <span className="text-[11px] text-gray-500">Explore open teams to join</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
          </Link>

          {/* 3. My Teams (Solid Theme) */}
          <Link
            to="/my-teams"
            className="group bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-center justify-between transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900 block">
                  My Teams
                </span>
                <span className="text-[11px] text-gray-500">{myTeamsCount} Active Teams</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
          </Link>

        </div>

      </main>
    </div>
  );
}
