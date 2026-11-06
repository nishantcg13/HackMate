import React, { useState } from "react";
import { Check, X } from "lucide-react";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";

export default function JoinRequests({
  currentUser,
  requests = [],
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState("received"); // "received" | "sent"
  const [requestList, setRequestList] = useState(requests);
  const [actionNotice, setActionNotice] = useState("");

  const handleAction = (id, action) => {
    setRequestList(requestList.filter((r) => r.id !== id));
    setActionNotice(`Request ${action}!`);
    setTimeout(() => setActionNotice(""), 2500);
  };

  const receivedRequests = requestList.filter((r) => r.type === "received");
  const sentRequests = requestList.filter((r) => r.type === "sent");

  const displayedList = activeTab === "received" ? receivedRequests : sentRequests;

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="max-w-3xl space-y-6">
        
        {actionNotice && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>{actionNotice}</span>
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Join Requests</h1>
        </div>

        {/* Tabs: Received (2) | Sent (1) matching Screenshot 8 */}
        <div className="flex items-center gap-6 border-b border-gray-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("received")}
            className={`pb-2.5 transition-colors border-b-2 -mb-px ${
              activeTab === "received"
                ? "border-[#D9531E] text-[#D9531E]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Received ({receivedRequests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sent")}
            className={`pb-2.5 transition-colors border-b-2 -mb-px ${
              activeTab === "sent"
                ? "border-[#D9531E] text-[#D9531E]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {displayedList.length === 0 ? (
            <div className="text-center py-10 bg-white border border-gray-200 rounded-xl text-xs text-gray-500">
              No {activeTab} requests right now.
            </div>
          ) : (
            displayedList.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-4"
              >
                {/* User avatar & info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3B1E2B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {req.avatarInitial}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {req.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {req.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {activeTab === "received" ? (
                  <div className="flex items-center gap-2">
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
                      className="px-4 py-1.5 text-xs font-semibold text-gray-700"
                      onClick={() => handleAction(req.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    Pending
                  </span>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </AppLayout>
  );
}

