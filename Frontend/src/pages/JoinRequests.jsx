import React, { useState } from "react";
import { Check, X, UserCheck, Send } from "lucide-react";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";

export default function JoinRequests({ currentUser, requests = [], onLogout }) {
  const [activeTab, setActiveTab] = useState("incoming"); // "incoming" | "outgoing"
  const [requestList, setRequestList] = useState(requests);
  const [toastMessage, setToastMessage] = useState("");

  const handleAction = (id, action) => {
    setRequestList((prev) => prev.filter((r) => r.id !== id));
    setToastMessage(`Request ${action}!`);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const incomingRequests = requestList.filter((r) => r.type === "incoming");
  const outgoingRequests = requestList.filter((r) => r.type === "outgoing");

  const displayedList = activeTab === "incoming" ? incomingRequests : outgoingRequests;

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="max-w-3xl space-y-6">
        
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Connection Requests</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Review incoming invitations and manage your outgoing requests.
          </p>
        </div>

        {/* Tab Switcher: Incoming vs Outgoing */}
        <div className="flex items-center gap-6 border-b border-gray-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("incoming")}
            className={`pb-2.5 transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === "incoming"
                ? "border-[#A54100] text-[#A54100]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Incoming ({incomingRequests.length})</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("outgoing")}
            className={`pb-2.5 transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === "outgoing"
                ? "border-[#A54100] text-[#A54100]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Outgoing ({outgoingRequests.length})</span>
          </button>
        </div>

        {/* List of Requests */}
        <div className="space-y-3">
          {displayedList.length === 0 ? (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-xl text-xs text-gray-500">
              No {activeTab} requests right now.
            </div>
          ) : (
            displayedList.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FFF5EE] text-[#A54100] border border-orange-200 flex items-center justify-center font-bold text-xs shrink-0">
                    {req.initials}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">
                        {req.name}
                      </h3>
                      <span className="text-[10px] text-gray-500 font-medium">
                        • {req.role}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      "{req.message}"
                    </p>

                    {req.skills && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {req.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                  {activeTab === "incoming" ? (
                    <>
                      <Button
                        size="sm"
                        className="px-4 py-1.5 text-xs font-semibold"
                        onClick={() => handleAction(req.id, "accepted")}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="px-4 py-1.5 text-xs font-semibold text-gray-600"
                        onClick={() => handleAction(req.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-[#A54100] bg-[#FFF5EE] px-3 py-1 rounded-full border border-orange-200">
                      Pending Response
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </AppLayout>
  );
}
