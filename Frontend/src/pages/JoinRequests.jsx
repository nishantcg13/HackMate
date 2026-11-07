import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { initialRequests } from "../data/dummyData";
import { Check, X } from "lucide-react";
import {
  getReceivedRequestsApi,
  getSentRequestsApi,
  acceptJoinRequestApi,
  rejectJoinRequestApi,
  cancelJoinRequestApi
} from "../services/api";

export default function JoinRequests() {
  const [activeTab, setActiveTab] = useState("incoming");
  const [requests, setRequests] = useState(initialRequests);
  const [loading, setLoading] = useState(false);

  // Fetch real requests from Backend on mount
  useEffect(() => {
    const fetchBackendRequests = async () => {
      try {
        setLoading(true);
        const [receivedRes, sentRes] = await Promise.allSettled([
          getReceivedRequestsApi(),
          getSentRequestsApi()
        ]);

        const formatted = [];

        // Received requests
        if (receivedRes.status === "fulfilled" && receivedRes.value?.data?.length) {
          receivedRes.value.data.forEach((r) => {
            formatted.push({
              id: r._id,
              name: r.user?.name || "Applicant",
              team: r.team?.name || "Hackathon Team",
              initial: (r.user?.name || "A")[0].toUpperCase(),
              skills: r.user?.skills || ["Developer"],
              type: "incoming",
            });
          });
        }

        // Sent requests
        if (sentRes.status === "fulfilled" && sentRes.value?.data?.length) {
          sentRes.value.data.forEach((r) => {
            formatted.push({
              id: r._id,
              name: r.team?.name || "Hackathon Team",
              team: r.team?.name || "Hackathon Team",
              initial: (r.team?.name || "T")[0].toUpperCase(),
              skills: ["Request Sent"],
              type: "my_requests",
            });
          });
        }

        if (formatted.length > 0) {
          setRequests(formatted);
        }
      } catch (err) {
        console.log("Using default demo requests:", err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBackendRequests();
  }, []);

  // Incoming count
  const incomingCount = requests.filter((r) => r.type === "incoming").length;
  // My requests count
  const myRequestsCount = requests.filter((r) => r.type === "my_requests").length;

  // Handle Accept with Backend API
  const handleAccept = async (id) => {
    try {
      await acceptJoinRequestApi(id);
    } catch (e) {
      console.log("Local accept fallback:", e?.message);
    }
    setRequests(requests.filter((r) => r.id !== id));
  };

  // Handle Reject with Backend API
  const handleReject = async (id) => {
    try {
      await rejectJoinRequestApi(id);
    } catch (e) {
      console.log("Local reject fallback:", e?.message);
    }
    setRequests(requests.filter((r) => r.id !== id));
  };

  // Handle Cancel My Request
  const handleCancelRequest = async (id) => {
    try {
      await cancelJoinRequestApi(id);
    } catch (e) {
      console.log("Local cancel fallback:", e?.message);
    }
    setRequests(requests.filter((r) => r.id !== id));
  };

  const displayedRequests = requests.filter((r) => r.type === activeTab);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Navbar */}
      <Navbar requestCount={incomingCount} />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* Header Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Join Requests
          </h1>
        </div>

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
            My Requests ({myRequestsCount})
          </button>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {displayedRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Left: Avatar + Info */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {req.initial}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {req.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 mb-2">
                    {activeTab === "incoming"
                      ? `Wants to join ${req.team}`
                      : `Request sent to join ${req.team}`}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {req.skills.map((skill, idx) => (
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

              {/* Right: Accept & Reject Action Buttons */}
              {activeTab === "incoming" ? (
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Accept Button (Solid Green) */}
                  <button
                    type="button"
                    onClick={() => handleAccept(req.id)}
                    className="bg-[#16A34A] hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>

                  {/* Reject Button (Outline Red) */}
                  <button
                    type="button"
                    onClick={() => handleReject(req.id)}
                    className="border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl">
                    Pending
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCancelRequest(req.id)}
                    className="text-xs text-red-500 hover:text-red-700 hover:underline px-2 py-1"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}

          {displayedRequests.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-xs text-gray-400">
              No requests found.
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
