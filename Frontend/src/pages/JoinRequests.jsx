import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Check, X, Bell, AlertCircle, RefreshCw } from "lucide-react";
import {
  getReceivedRequestsApi,
  getSentRequestsApi,
  acceptJoinRequestApi,
  rejectJoinRequestApi,
  cancelJoinRequestApi,
} from "../services/api";

export default function JoinRequests() {
  const [activeTab, setActiveTab] = useState("incoming");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const [receivedRes, sentRes] = await Promise.allSettled([
        getReceivedRequestsApi(),
        getSentRequestsApi(),
      ]);

      if (receivedRes.status === "fulfilled" && receivedRes.value?.data) {
        setIncomingRequests(receivedRes.value.data);
      } else {
        setIncomingRequests([]);
      }

      if (sentRes.status === "fulfilled" && sentRes.value?.data) {
        setSentRequests(sentRes.value.data);
      } else {
        setSentRequests([]);
      }
    } catch (err) {
      setErrorMsg("Failed to load join requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const showToast = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 3500);
  };

  // Handle Accept (Incoming)
  const handleAccept = async (id) => {
    try {
      await acceptJoinRequestApi(id);
      showToast("Join request accepted! The user is now added to your team.");
      setIncomingRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Failed to accept request");
    }
  };

  // Handle Reject (Incoming)
  const handleReject = async (id) => {
    try {
      await rejectJoinRequestApi(id);
      showToast("Join request rejected.");
      setIncomingRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Failed to reject request");
    }
  };

  // Handle Cancel (My Requests)
  const handleCancelRequest = async (id) => {
    try {
      await cancelJoinRequestApi(id);
      showToast("Your join request has been cancelled.");
      setSentRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Failed to cancel request");
    }
  };

  const incomingCount = incomingRequests.length;
  const myRequestsCount = sentRequests.length;

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar requestCount={incomingCount} />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* Header Title & Refresh */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Join Requests
          </h1>

          <button
            onClick={fetchAllRequests}
            className="flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 font-semibold border border-purple-200 px-3 py-1.5 rounded-xl hover:bg-purple-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {feedback && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tabs: Incoming Requests & My Requests */}
        <div className="flex items-center gap-6 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("incoming")}
            className={`pb-3 text-xs font-semibold transition-colors border-b-2 ${
              activeTab === "incoming"
                ? "border-purple-800 text-purple-900 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Incoming Requests ({incomingCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("my_requests")}
            className={`pb-3 text-xs font-semibold transition-colors border-b-2 ${
              activeTab === "my_requests"
                ? "border-purple-800 text-purple-900 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            My Requests Sent ({myRequestsCount})
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-xs text-gray-500">
            Loading requests...
          </div>
        )}

        {/* Requests List */}
        {!loading && (
          <div className="space-y-4">
            {activeTab === "incoming" &&
              incomingRequests.map((req) => {
                const requester = req.user || req.requester || {};
                const team = req.team || {};
                const name = requester.name || "Developer";
                const initial = (name || "D")[0].toUpperCase();
                const skills = requester.skills || [];

                return (
                  <div
                    key={req._id}
                    className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {initial}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 mb-2">
                          Wants to join{" "}
                          <span className="font-semibold text-purple-900">
                            {team.name || "your team"}
                          </span>
                          {req.message && ` — "${req.message}"`}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {skills.map((skill, idx) => (
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

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleAccept(req._id)}
                        className="bg-[#16A34A] hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReject(req._id)}
                        className="border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                );
              })}

            {activeTab === "my_requests" &&
              sentRequests.map((req) => {
                const team = req.team || {};
                const initial = (team.name || "T")[0].toUpperCase();

                return (
                  <div
                    key={req._id}
                    className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {initial}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          {team.name || "Hackathon Team"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5 mb-2">
                          Request sent to join {team.name || "team"}
                          {req.message && ` — "${req.message}"`}
                        </p>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            req.status === "Accepted"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : req.status === "Rejected"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          Status: {req.status || "Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {req.status === "Pending" && (
                        <button
                          type="button"
                          onClick={() => handleCancelRequest(req._id)}
                          className="text-xs text-red-500 hover:text-red-700 hover:underline px-2 py-1 font-semibold"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

            {((activeTab === "incoming" && incomingRequests.length === 0) ||
              (activeTab === "my_requests" && sentRequests.length === 0)) && (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-2">
                <Bell className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-sm font-semibold text-gray-700">No requests found</p>
                <p className="text-xs text-gray-400">
                  {activeTab === "incoming"
                    ? "You haven't received any join requests for your teams yet."
                    : "You haven't sent any join requests to other teams yet."}
                </p>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
