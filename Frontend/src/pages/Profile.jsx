import React, { useState } from "react";
import { Edit3, Check, X, Plus } from "lucide-react";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";

export default function Profile({ currentUser, onUpdateProfile, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "Nishant Galande",
    email: currentUser?.email || "nishant@example.com",
    role: currentUser?.role || "Full Stack Developer",
    bio:
      currentUser?.bio ||
      "Passionate developer, always eager to learn and build innovative solutions. Looking for motivated teammates for hackathons.",
    skills: currentUser?.skills || ["React", "Node.js", "Java", "MongoDB", "Python"],
    interests: currentUser?.interests || ["Web Development", "AI Applications", "FinTech", "Open Source"],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()],
      });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interestToRemove),
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(formData);
    }
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="max-w-3xl space-y-6">
        
        {saveToast && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage your personal profile, skills, and hackathon project interests.
          </p>
        </div>

        {/* Profile Details Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-150">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#A54100] text-white flex items-center justify-center text-xl font-bold shadow-xs shrink-0">
                {currentUser?.initials || "NG"}
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {formData.name}
                </h2>
                <p className="text-xs text-[#A54100] font-semibold mt-0.5">
                  {formData.role}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formData.email}
                </p>
              </div>
            </div>

            <div>
              {!isEditing ? (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Edit3}
                  onClick={() => setIsEditing(true)}
                  className="px-4 text-xs font-semibold"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Form edit fields when editing */}
          {isEditing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Primary Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          )}

          {/* Section: About / Bio */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
              About Me
            </h3>
            {isEditing ? (
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg p-3"
              />
            ) : (
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {formData.bio}
              </p>
            )}
          </div>

          {/* Section: Skills */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
              Technical Skills
            </h3>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 font-medium"
                >
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex items-center gap-2 max-w-xs">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Next.js)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 bg-white border border-gray-300 text-xs rounded-lg px-2.5 py-1.5"
                />
                <Button variant="secondary" size="sm" icon={Plus} onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Section: Project Interests */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
              Hackathon Project Interests
            </h3>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {formData.interests.map((int, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-[#FFF5EE] text-[#A54100] border border-orange-200 font-medium"
                >
                  <span>{int}</span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(int)}
                      className="text-orange-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex items-center gap-2 max-w-xs">
                <input
                  type="text"
                  placeholder="Add domain (e.g. HealthTech)..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="flex-1 bg-white border border-gray-300 text-xs rounded-lg px-2.5 py-1.5"
                />
                <Button variant="secondary" size="sm" icon={Plus} onClick={handleAddInterest}>
                  Add
                </Button>
              </div>
            )}
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
