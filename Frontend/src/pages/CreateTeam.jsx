import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Users, ArrowLeft } from "lucide-react";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";

export default function CreateTeam({ currentUser, onCreateTeam, onLogout }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxMembers: 4,
    requiredSkillsInput: "Figma, Python, Node.js",
    interestsInput: "AI Solutions, Web Development",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Please fill in the team name and project description.");
      return;
    }

    const skills = formData.requiredSkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const interests = formData.interestsInput
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const newTeam = {
      id: "t_" + Date.now(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      leaderName: currentUser?.name || "Nishant Galande",
      requiredSkills: skills,
      interests: interests,
      maxMembers: Number(formData.maxMembers),
      members: [
        {
          name: currentUser?.name || "Nishant Galande",
          role: "Team Leader",
          initials: currentUser?.initials || "NG",
        },
      ],
    };

    if (onCreateTeam) {
      onCreateTeam(newTeam);
    }

    navigate("/teams");
  };

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="max-w-2xl space-y-6">
        
        {/* Back Link */}
        <Link
          to="/teams"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Teams</span>
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create a New Team</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Set up your hackathon squad, specify the skills you need, and recruit teammates.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-xs text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Team Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CodeWarriors, DevSprint"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Project Idea / Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="What problem are you solving? What kind of solution are you building?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
            </div>

            {/* Team Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Team Capacity (Members)
                </label>
                <select
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                  className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-[#A54100]"
                >
                  <option value={2}>2 Members</option>
                  <option value={3}>3 Members</option>
                  <option value={4}>4 Members</option>
                  <option value={5}>5 Members</option>
                </select>
              </div>

              {/* Required Skills */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Skills Needed
                </label>
                <input
                  type="text"
                  placeholder="e.g. UI/UX, FastAPI, React"
                  value={formData.requiredSkillsInput}
                  onChange={(e) =>
                    setFormData({ ...formData, requiredSkillsInput: e.target.value })
                  }
                  className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
                />
              </div>
            </div>

            {/* Project Domains / Interests */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Project Domains / Interests
              </label>
              <input
                type="text"
                placeholder="e.g. HealthTech, AI Applications, EdTech"
                value={formData.interestsInput}
                onChange={(e) =>
                  setFormData({ ...formData, interestsInput: e.target.value })
                }
                className="w-full bg-white border border-gray-300 text-xs text-gray-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
              <p className="text-[11px] text-gray-400 mt-0.5">Separate with commas</p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-150">
              <Link to="/teams">
                <Button variant="secondary" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" size="sm">
                Create Team
              </Button>
            </div>
          </form>

        </div>

      </div>
    </AppLayout>
  );
}

