import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  ArrowLeft,
  Users,
  Check,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  LogOut,
  AlertCircle,
  X,
  Calendar,
} from "lucide-react";
import {
  getTeamByIdApi,
  updateTeamApi,
  deleteTeamApi,
  transferLeadershipApi,
  sendJoinRequestApi,
  leaveTeamApi,
  removeTeamMemberApi,
} from "../services/api";
import { formatDate } from "../utils/dateUtils";

export default function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [requested, setRequested] = useState(false);

  // Edit Team Modal / Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [editMaxMembers, setEditMaxMembers] = useState(4);
  const [editStatus, setEditStatus] = useState("OPEN");
  const [editRegistrationDeadline, setEditRegistrationDeadline] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");

  // Transfer Leadership Modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedNewLeaderId, setSelectedNewLeaderId] = useState("");

  // Current logged in user
  const loggedInUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();
  const currentUserId = loggedInUser?._id || loggedInUser?.id;
  const isAdmin = loggedInUser?.role === "ADMIN";

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await getTeamByIdApi(id);
      if (res?.team) {
        setTeam(res.team);
        setMembers(res.members || []);
        setEditName(res.team.name || "");
        setEditDesc(res.team.description || "");
        setEditSkills((res.team.requiredSkills || []).join(", "));
        setEditMaxMembers(res.team.maxMembers || 4);
        setEditStatus(res.team.status || "OPEN");
        setEditRegistrationDeadline(res.team.registrationDeadline ? res.team.registrationDeadline.split("T")[0] : "");
        setEditStartDate(res.team.startDate ? res.team.startDate.split("T")[0] : "");
        setEditEndDate(res.team.endDate ? res.team.endDate.split("T")[0] : "");
      } else {
        setErrorMsg("Team not found");
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to load team details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTeamData();
  }, [id]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const isLeader =
    team &&
    currentUserId &&
    (team.leader?._id === currentUserId ||
      team.leader === currentUserId ||
      team.leaderId === currentUserId);

  const canManage = isLeader || isAdmin;

  // Check if current user is already an accepted member
  const isMember = members.some(
    (m) =>
      (m.user?._id || m.user || m.userId?._id || m.userId)?.toString() ===
      currentUserId?.toString()
  );

  // Handle Request to Join
  const handleRequestJoin = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    setRequested(true);
    try {
      await sendJoinRequestApi(id, "Hi, I want to join your team!");
      showNotification("Join request sent successfully!");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Error sending request");
    }
  };

  // API #8: Update Team
  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    try {
      await updateTeamApi(id, {
        name: editName,
        description: editDesc,
        requiredSkills: editSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        maxMembers: Number(editMaxMembers),
        status: editStatus,
        registrationDeadline: editRegistrationDeadline || null,
        startDate: editStartDate || null,
        endDate: editEndDate || null,
      });
      setIsEditing(false);
      showNotification("Team updated successfully! (API #8)");
      fetchTeamData();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to update team");
    }
  };

  // API #9: Delete Team
  const handleDeleteTeam = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this team? All memberships and requests will be removed (API #9)."
      )
    ) {
      return;
    }
    try {
      await deleteTeamApi(id);
      navigate("/teams");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to delete team");
    }
  };

  // API #11: Transfer Leadership
  const handleTransferLeadership = async (e) => {
    e.preventDefault();
    if (!selectedNewLeaderId) return;
    try {
      await transferLeadershipApi(id, selectedNewLeaderId);
      setShowTransferModal(false);
      showNotification("Team leadership transferred successfully! (API #11)");
      fetchTeamData();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to transfer leadership");
    }
  };

  // Leave Team
  const handleLeaveTeam = async () => {
    if (!window.confirm("Are you sure you want to leave this team?")) return;
    try {
      await leaveTeamApi(id);
      showNotification("You have left the team.");
      fetchTeamData();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to leave team");
    }
  };

  // Remove Member (Leader only)
  const handleRemoveMember = async (memberUserId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from the team?`)) return;
    try {
      await removeTeamMemberApi(id, memberUserId);
      showNotification(`${memberName} removed from team.`);
      fetchTeamData();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to remove member");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col">
        <Navbar />
        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 text-center text-xs text-gray-500">
          Loading team details...
        </main>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col">
        <Navbar />
        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 text-center space-y-4">
          <p className="text-base font-bold text-gray-800">Team not found</p>
          <button
            onClick={() => navigate("/teams")}
            className="text-xs text-purple-700 font-semibold hover:underline"
          >
            &larr; Back to Teams
          </button>
        </main>
      </div>
    );
  }

  const leaderName = team.leader?.name || "Team Leader";
  const skills = team.requiredSkills || [];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* Back navigation & Action buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/teams")}
            className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Teams</span>
          </button>

          {canManage && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 border border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Edit Team Info (API #8)"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Team</span>
              </button>

              {isLeader && members.length > 1 && (
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="px-3 py-1.5 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Transfer Leadership (API #11)"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Transfer Leader</span>
                </button>
              )}

              <button
                onClick={handleDeleteTeam}
                className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Delete Team (API #9)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
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

        {/* Team Header Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-gray-900">{team.name}</h1>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${
                    team.status === "OPEN"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {team.status || "OPEN"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 mb-3">{team.description}</p>

              {/* Skill Badges */}
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-md font-medium border border-purple-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Meta Info in Header Card */}
          <div className="bg-purple-50/40 border border-purple-100/60 rounded-xl p-4 min-w-[200px] space-y-2 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                Team Leader
              </span>
              <span className="font-bold text-purple-900 text-xs">{leaderName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                Members
              </span>
              <span className="font-bold text-purple-900 text-xs">
                {members.length}/{team.maxMembers}
              </span>
            </div>
            {team.hackathon && (
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                  Hackathon
                </span>
                <span className="font-semibold text-gray-700 text-xs">
                  {team.hackathon?.title || team.hackathon?.name || "Hackathon 2026"}
                </span>
              </div>
            )}
            {team.registrationDeadline && (
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                  Registration Closes
                </span>
                <span className="font-semibold text-amber-700 text-xs flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  {formatDate(team.registrationDeadline)}
                </span>
              </div>
            )}
            {(team.startDate || team.endDate) && (
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                  Duration
                </span>
                <span className="font-semibold text-gray-700 text-xs flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  {team.startDate ? formatDate(team.startDate) : "TBA"} -{" "}
                  {team.endDate ? formatDate(team.endDate) : "TBA"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Section: Team Members (Left) and Required Skills / Actions (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Team Members */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-sm font-bold text-gray-900">
                Team Members ({members.length})
              </h2>
              {isMember && !isLeader && (
                <button
                  onClick={handleLeaveTeam}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" /> Leave Team
                </button>
              )}
            </div>

            <div className="space-y-3">
              {members.map((member, idx) => {
                const memberUser = member.user || member.userId || {};
                const mId = memberUser._id || memberUser.id;
                const mName = memberUser.name || "Member";
                const isMemberLeader = member.role === "LEADER" || member.role === "Leader";

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {(mName || "M")[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-800">
                            {mName}
                          </span>
                          {isMemberLeader && (
                            <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full border border-green-200">
                              Leader
                            </span>
                          )}
                        </div>
                        {memberUser.email && (
                          <span className="text-[11px] text-gray-400 block">
                            {memberUser.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Leader action: remove member (not themselves) */}
                    {isLeader && !isMemberLeader && mId && (
                      <button
                        onClick={() => handleRemoveMember(mId, mName)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove member"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}

              {members.length === 0 && (
                <p className="text-xs text-gray-400 italic">No members yet.</p>
              )}
            </div>
          </div>

          {/* Right: Required Skills & Action */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((reqSkill, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-medium border border-purple-100"
                    >
                      {reqSkill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">
                    No specific skills specified
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons based on user relationship */}
            <div>
              {isLeader ? (
                <div className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center bg-green-50 text-green-700 border border-green-200">
                  You are the Leader of this Team
                </div>
              ) : isMember ? (
                <div className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center bg-blue-50 text-blue-700 border border-blue-200">
                  You are a Member of this Team
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestJoin}
                  disabled={requested || team.status === "CLOSED"}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                    requested
                      ? "bg-green-600 text-white cursor-default"
                      : team.status === "CLOSED"
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#A54100] hover:bg-[#8A3600] text-white"
                  }`}
                >
                  {requested ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Request Sent Successfully</span>
                    </>
                  ) : team.status === "CLOSED" ? (
                    "Team is Closed"
                  ) : (
                    "Request to Join"
                  )}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Modal: Edit Team (API #8) */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-gray-900">
                  Edit Team Information (API #8)
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateTeam} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Team Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Required Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Max Members
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={10}
                      value={editMaxMembers}
                      onChange={(e) => setEditMaxMembers(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Reg. End Date
                    </label>
                    <input
                      type="date"
                      value={editRegistrationDeadline}
                      max={editStartDate || undefined}
                      onChange={(e) => setEditRegistrationDeadline(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-2.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={editStartDate}
                      min={editRegistrationDeadline || undefined}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-2.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={editEndDate}
                      min={editStartDate || undefined}
                      onChange={(e) => setEditEndDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-2.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#A54100] text-white text-xs font-semibold rounded-xl hover:bg-[#8A3600]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Transfer Leadership (API #11) */}
        {showTransferModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-gray-900">
                  Transfer Leadership (API #11)
                </h3>
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Select an existing member of this team to become the new leader. You will become a regular member.
              </p>

              <form onSubmit={handleTransferLeadership} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select New Leader
                  </label>
                  <select
                    required
                    value={selectedNewLeaderId}
                    onChange={(e) => setSelectedNewLeaderId(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  >
                    <option value="">-- Choose Member --</option>
                    {members
                      .filter((m) => {
                        const mId = (m.user?._id || m.user || m.userId?._id || m.userId)?.toString();
                        return mId !== currentUserId?.toString();
                      })
                      .map((m, idx) => {
                        const mId = (m.user?._id || m.user || m.userId?._id || m.userId)?.toString();
                        const mName = m.user?.name || m.userId?.name || "Member";
                        return (
                          <option key={idx} value={mId}>
                            {mName} ({m.user?.email || "member"})
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedNewLeaderId}
                    className="px-4 py-2 bg-indigo-700 text-white text-xs font-semibold rounded-xl hover:bg-indigo-800 disabled:opacity-50"
                  >
                    Transfer Leadership
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
