import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { initialUser } from "../data/dummyData";
import { Pencil, Check, X } from "lucide-react";
import { getMeApi } from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch real profile from backend if user has logged in
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMeApi();
        if (data?.user) {
          setUser({
            ...initialUser,
            name: data.user.name || initialUser.name,
            email: data.user.email || initialUser.email,
            about: data.user.bio || initialUser.about,
            initial: (data.user.name || "N")[0].toUpperCase(),
            skills: data.user.skills?.length ? data.user.skills : initialUser.skills,
          });
        }
      } catch (err) {
        // Quietly maintain dummy data if offline or not logged in
        console.log("Using default demo profile:", err?.message);
      }
    };

    fetchProfile();
  }, []);

  // Edit form state
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    about: user.about,
    skills: user.skills.join(", "),
    interests: user.interests.join(", "),
  });

  const handleSave = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      name: formData.name,
      email: formData.email,
      about: formData.about,
      initial: (formData.name || "N")[0].toUpperCase(),
      skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      interests: formData.interests.split(",").map((i) => i.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* Header Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            My Profile
          </h1>
        </div>

        {/* 2-Column Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Avatar & Basic Info */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center justify-center space-y-4">
            {/* Big Initial Circle */}
            <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-800 font-extrabold text-2xl flex items-center justify-center shadow-xs">
              {user.initial}
            </div>

            {/* Name & Email */}
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {user.name}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {user.email}
              </p>
            </div>

            {/* Edit Profile Button */}
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="w-full max-w-[180px] py-2 px-3 border border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{isEditing ? "Close" : "Edit Profile"}</span>
            </button>
          </div>

          {/* Right Column: Details or Edit Form */}
          <div className="md:col-span-2 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
            {isEditing ? (
              /* Simple Edit Form */
              <form onSubmit={handleSave} className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2">
                  Edit Profile Details
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    About Me
                  </label>
                  <textarea
                    rows={3}
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Interests (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="bg-[#A54100] hover:bg-[#8A3600] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* Display View matching Screenshot */
              <div className="space-y-6">
                {/* About Me */}
                <div>
                  <h3 className="text-xs font-bold text-gray-900 mb-2">
                    About Me
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {user.about}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-xs font-bold text-gray-900 mb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-lg font-medium border border-green-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h3 className="text-xs font-bold text-gray-900 mb-2">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-medium border border-purple-100"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
