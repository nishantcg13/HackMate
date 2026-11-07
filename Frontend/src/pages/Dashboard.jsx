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
          setRequestsCount(requestsRes.value.data.length);
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
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs relative overflow-hidden">
          <div className="space-y-2 z-10 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome, {userName}! <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-sm text-gray-500 font-normal max-w-md">
              Find teammates, join teams, and build your winning hackathon project.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 justify-center md:justify-start">
              <Link
                to="/create-team"
                className="bg-[#A54100] hover:bg-[#8A3600] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create a Team</span>
              </Link>

              {requestsCount > 0 && (
                <Link
                  to="/requests"
                  className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-purple-100 transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{requestsCount} Pending Join Requests</span>
                </Link>
              )}
            </div>
          </div>

          {/* Student at laptop illustration */}
          <div className="relative z-10 flex-shrink-0">
            <div className="w-40 h-28 sm:w-48 sm:h-32 rounded-2xl bg-gradient-to-tr from-purple-100 to-indigo-50 flex items-center justify-center p-3 border border-purple-100">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&auto=format&fit=crop&q=80"
                alt="Student with Laptop"
                className="w-full h-full object-cover rounded-xl shadow-xs"
              />
            </div>
          </div>

          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-purple-50 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* 3 Large Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* 1. Find Teammates (Purple Theme) */}
          <Link
            to="/teammates"
            className="group bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-purple-100 rounded-2xl p-6 flex items-center justify-between transition-all shadow-xs"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-200/70 text-purple-800 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-bold text-gray-900 group-hover:text-purple-900 transition-colors block">
                  Find Teammates
                </span>
                <span className="text-[11px] text-gray-500">Discover skilled developers</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-700 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* 2. Find Teams (Green Theme) */}
          <Link
            to="/teams"
            className="group bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-green-100 rounded-2xl p-6 flex items-center justify-between transition-all shadow-xs"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-200/70 text-green-800 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-bold text-gray-900 group-hover:text-green-900 transition-colors block">
                  Find Teams
                </span>
                <span className="text-[11px] text-gray-500">Explore open teams to join</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-green-700 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* 3. My Teams (Blue Theme) */}
          <Link
            to="/my-teams"
            className="group bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-blue-100 rounded-2xl p-6 flex items-center justify-between transition-all shadow-xs"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-200/70 text-blue-800 flex items-center justify-center font-bold">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-bold text-gray-900 group-hover:text-blue-900 transition-colors block">
                  My Teams
                </span>
                <span className="text-[11px] text-gray-500">{myTeamsCount} Active Teams</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-700 group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>

      </main>
    </div>
  );
}
