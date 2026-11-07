import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Search, ChevronDown, Users, Mail } from "lucide-react";
import { getUsersApi } from "../services/api";

const avatarColors = [
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
];

export default function Teammates() {
  const [teammates, setTeammates] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All Skills");
  const [loading, setLoading] = useState(false);

  const loggedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();
  const currentUserId = loggedUser?._id || loggedUser?.id;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsersApi(searchName, selectedSkill);
      const usersList = res?.data || (Array.isArray(res) ? res : []);

      // Filter out the logged in user and any admin accounts
      const filtered = usersList
        .filter(
          (u) =>
            (u._id || u.id)?.toString() !== currentUserId?.toString() &&
            u.role !== "ADMIN" &&
            u.email !== "admin@hackmate.com"
        )
        .map((u, idx) => ({
          id: u._id || u.id,
          name: u.name,
          email: u.email,
          role: u.bio || (u.skills?.[0] ? `${u.skills[0]} Developer` : "Full Stack Developer"),
          initial: (u.name || "U")[0].toUpperCase(),
          avatarColor: avatarColors[idx % avatarColors.length],
          skills: u.skills?.length ? u.skills : ["Software Developer"],
        }));

      setTeammates(filtered);
    } catch (err) {
      console.error("Error fetching users from DB:", err?.message);
      setTeammates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedSkill]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const skillsList = [
    "All Skills",
    "Java",
    "React",
    "Node.js",
    "MongoDB",
    "Spring Boot",
    "Python",
    "Flutter",
    "DevOps",
    "MySQL",
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* Header Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Find Teammates
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Browse registered developer profiles and explore their tech skills.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-2xs"
            />
          </div>

          {/* Skill Dropdown */}
          <div className="relative min-w-[140px]">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 pr-8 text-xs text-gray-700 appearance-none focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-2xs cursor-pointer"
            >
              {skillsList.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <button
            type="submit"
            className="bg-[#4C1D95] hover:bg-[#3B1578] text-white text-xs font-semibold px-4 py-2 rounded-xl"
          >
            Search
          </button>
        </form>

        {/* Loading state */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-xs text-gray-500">
            Loading developers from database...
          </div>
        )}

        {/* Teammates Profile Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {teammates.map((teammate) => (
              <div
                key={teammate.id}
                className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-sm hover:border-purple-200 transition-all"
              >
                <div>
                  {/* Top: Avatar Circle with Initial */}
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div
                      className={`w-12 h-12 rounded-full ${teammate.avatarColor} flex items-center justify-center font-bold text-base shrink-0 shadow-2xs`}
                    >
                      {teammate.initial}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {teammate.name}
                      </h3>
                      {teammate.email && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[180px]">{teammate.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Role / Bio */}
                  <p className="text-xs text-gray-600 font-normal leading-relaxed mt-1 mb-4 line-clamp-2">
                    {teammate.role}
                  </p>

                  {/* Skills Section */}
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1.5">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {teammate.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium border border-purple-100/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && teammates.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-2">
            <Users className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">No teammates found</p>
            <p className="text-xs text-gray-400">
              No registered developers match your search or filter criteria.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
