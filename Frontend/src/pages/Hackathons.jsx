import React, { useState } from "react";
import { Calendar, MapPin, ArrowRight, ArrowLeft, Trophy, Check } from "lucide-react";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";

export default function Hackathons({ currentUser, hackathons = [], onLogout }) {
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [registered, setRegistered] = useState(false);

  // Filter hackathons by search query
  const filtered = hackathons.filter((h) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      h.title.toLowerCase().includes(q) ||
      h.description.toLowerCase().includes(q)
    );
  });

  return (
    <AppLayout
      currentUser={currentUser}
      onLogout={onLogout}
      searchPlaceholder="Search hackathons..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="max-w-5xl space-y-6">
        
        {/* If NO hackathon is selected: Show List (SCREEN 4) */}
        {!selectedHackathon ? (
          <>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hackathons</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Discover exciting hackathons and showcase your skills.
              </p>
            </div>

            {/* Hackathon Cards Grid matching Screenshot 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((h) => (
                <div
                  key={h.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <img
                      src={h.image}
                      alt={h.title}
                      className="w-full h-36 object-cover bg-gray-900"
                    />

                    <div className="p-4">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1.5">
                        {h.title}
                      </h3>

                      <div className="space-y-1 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{h.startDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{h.mode}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View Details link matching Screenshot */}
                  <div className="px-4 pb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedHackathon(h);
                        setRegistered(false);
                      }}
                      className="text-xs font-semibold text-[#D9531E] hover:underline flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* If a hackathon is selected: Show Details (SCREEN 5) */
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Back button */}
            <button
              onClick={() => setSelectedHackathon(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Header info + image layout */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-gray-100">
              <div className="space-y-3 max-w-lg">
                <h1 className="text-2xl font-extrabold text-gray-900">
                  {selectedHackathon.title}
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                  {selectedHackathon.tagline}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {selectedHackathon.startDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {selectedHackathon.mode}
                  </span>
                </div>

                <div className="pt-2">
                  <Button
                    size="md"
                    className="px-6 rounded-lg text-xs"
                    onClick={() => setRegistered(true)}
                    disabled={registered}
                    icon={registered ? Check : null}
                  >
                    {registered ? "Registered!" : "Register Now"}
                  </Button>
                </div>
              </div>

              {/* Right Image */}
              <img
                src={selectedHackathon.image}
                alt={selectedHackathon.title}
                className="w-full md:w-64 h-40 object-cover rounded-xl border border-gray-200"
              />
            </div>

            {/* About the Event */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                About the Event
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                {selectedHackathon.description}
              </p>
            </div>

            {/* Prizes Section matching Screenshot 5 */}
            {selectedHackathon.prizes && (
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-[#D9531E]" />
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Prizes
                  </h4>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-700 bg-gray-50 p-3.5 rounded-xl border border-gray-200 max-w-xl">
                  <span>1st Prize: <strong className="text-gray-900">{selectedHackathon.prizes.first}</strong></span>
                  <span>•</span>
                  <span>2nd Prize: <strong className="text-gray-900">{selectedHackathon.prizes.second}</strong></span>
                  <span>•</span>
                  <span>3rd Prize: <strong className="text-gray-900">{selectedHackathon.prizes.third}</strong></span>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </AppLayout>
  );
}
