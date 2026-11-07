import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Pencil, Check, X, AlertCircle } from "lucide-react";
import { getMeApi, updateUserProfileApi } from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getMeApi();
      if (res?.user) {
        setUser(res.user);
        setFormData({
          name: res.user.name || "",
          email: res.user.email || "",
          bio: res.user.bio || "",
          skills: (res.user.skills || []).join(", "),
        });
        localStorage.setItem("user", JSON.stringify(res.user));
      }
    } catch (err) {
      setErrorMsg("Failed to load profile. Please make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg("");
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await updateUserProfileApi({
        name: formData.name,
        bio: formData.bio,
        skills: skillsArray,
      });

      if (res?.data || res?.user) {
        const updated = res.data || res.user;
        setUser((prev) => ({ ...prev, ...updated }));
        localStorage.setItem("user", JSON.stringify({ ...user, ...updated }));
      } else {
        setUser((prev) => ({
          ...prev,
          name: formData.name,
          bio: formData.bio,
          skills: skillsArray,
        }));
      }

      setIsEditing(false);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col">
        <Navbar />
        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 text-center text-xs text-gray-500">
          Loading profile...
        </main>
      </div>
    );
  }

  const initial = (user?.name || "U")[0].toUpperCase();
  const skills = user?.skills || [];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            My Profile
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your developer details, skills, and bio.
          </p>
        </div>

        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Avatar & Basic Info */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-800 font-extrabold text-2xl flex items-center justify-center shadow-xs">
              {initial}
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900">
                {user?.name || "User"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {user?.email || ""}
              </p>
              {user?.role && (
                <span className="mt-2 inline-block text-[10px] bg-purple-50 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full border border-purple-200">
                  {user.role}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="w-full max-w-[180px] py-2 px-3 border border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
            </button>
          </div>

          {/* Right Column: Details or Edit Form */}
          <div className="md:col-span-2 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
            {isEditing ? (
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
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    About / Bio
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell other hackathon participants about yourself and your tech stack..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, Java, Python, MongoDB"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
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
              <div className="space-y-6">
                {/* About Me */}
                <div>
                  <h3 className="text-xs font-bold text-gray-900 mb-2">
                    About Me
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {user?.bio || "No bio added yet. Click Edit Profile to add one!"}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-xs font-bold text-gray-900 mb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-lg font-medium border border-green-200"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        No skills listed. Click Edit Profile to add your skills!
                      </span>
                    )}
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
