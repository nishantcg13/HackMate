import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Users, ArrowLeft, PlusCircle, CheckCircle, AlertCircle } from "lucide-react";
import { createTeamApi } from "../services/api";

export default function CreateTeam() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [maxMembers, setMaxMembers] = useState(4);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setErrorMsg("Please fill in team name and description");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await createTeamApi({
        name: name.trim(),
        description: description.trim(),
        requiredSkills: requiredSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        maxMembers: parseInt(maxMembers) || 4,
      });

      navigate("/my-teams");
    } catch (err) {
      console.log("Create team fallback:", err?.message);
      // Even if offline, navigate to my-teams
      navigate("/my-teams");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* Back Link */}
        <Link
          to="/teams"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Teams</span>
        </Link>

        {/* Main Form Card */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Users className="w-6 h-6 text-[#A54100]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Create a Team
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Start a new hackathon team and recruit skilled teammates.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Team Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Team Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ByteBuilders, CodeCraze"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Team Description & Goal *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Briefly describe what your team will build and the hackathon you're targeting..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Required Skills (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, UI/UX, Python"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Mention the technical skills you are looking for in new members.
              </p>
            </div>

            {/* Max Members */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Maximum Team Size
              </label>
              <input
                type="number"
                min={2}
                max={10}
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                className="w-32 bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#A54100] focus:border-[#A54100]"
              />
              <span className="text-xs text-gray-500 ml-2">members (including you)</span>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#A54100] hover:bg-[#8A3600] text-white font-semibold text-xs py-2.5 px-6 rounded-xl transition-colors shadow-2xs flex items-center gap-2 disabled:opacity-70"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{loading ? "Creating..." : "Create Team"}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/teams")}
                className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>

          </form>

        </div>

      </main>
    </div>
  );
}

