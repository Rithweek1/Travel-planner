"use client";

import { useRouter } from "next/navigation";
import { Plane, MapPin, Calendar, Plus, ArrowLeft, Trash2, Compass } from "lucide-react";

const SAMPLE_TRIPS = [
  { id: 1, destination: "Paris, France", days: 5, status: "Planned", date: "Apr 15–20, 2026", img: "1502602922686-1059c4979ba6", flag: "🇫🇷" },
  { id: 2, destination: "Tokyo, Japan", days: 7, status: "Completed", date: "Jan 2–9, 2026", img: "1540959733332-eab4deabeeaf", flag: "🇯🇵" },
  { id: 3, destination: "Bali, Indonesia", days: 3, status: "Draft", date: "Jun 1–4, 2026", img: "1537996194471-e657df975ab4", flag: "🇮🇩" },
];

const STATUS_COLORS: Record<string, string> = {
  Planned: "bg-sky-100 text-sky-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Draft: "bg-amber-100 text-amber-700",
};

export default function MyTripsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "var(--font-inter)" }}>
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 shadow-sm px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors">
          <ArrowLeft size={18} /> Home
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-sky-500 to-rose-400 p-1.5 rounded-lg">
            <Plane className="text-white w-4 h-4" />
          </div>
          <span className="font-black text-slate-900 text-xl" style={{ fontFamily: "var(--font-poppins)" }}>Voyagr</span>
        </div>
        <button onClick={() => router.push("/plan")} className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-rose-400 text-white font-bold px-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm">
          <Plus size={16} /> New Trip
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2" style={{ fontFamily: "var(--font-poppins)" }}>My Trips 🧳</h1>
          <p className="text-slate-500 text-lg">Your saved and planned adventures all in one place.</p>
        </div>

        {SAMPLE_TRIPS.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Compass size={56} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-2xl font-black text-slate-700 mb-2">No trips yet!</h3>
            <p className="text-slate-400 mb-6">Start planning your first adventure.</p>
            <button onClick={() => router.push("/plan")} className="bg-gradient-to-r from-sky-500 to-rose-400 text-white font-bold px-8 py-3 rounded-2xl shadow-md hover:-translate-y-0.5 transition-all">
              Plan a Trip
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {SAMPLE_TRIPS.map((trip) => (
              <div key={trip.id} className="bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group">
                <div className="sm:w-48 h-40 sm:h-auto relative flex-shrink-0 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${trip.img}?q=80&w=400&auto=format&fit=crop`}
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: "var(--font-poppins)" }}>
                          {trip.flag} {trip.destination}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><Calendar size={14} /> {trip.date}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} /> {trip.days} Days</span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${STATUS_COLORS[trip.status]}`}>{trip.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={() => router.push(`/itinerary?destination=${encodeURIComponent(trip.destination)}&days=${trip.days}`)}
                      className="flex-1 bg-gradient-to-r from-sky-500 to-rose-400 text-white font-bold py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-sm"
                    >
                      View Itinerary
                    </button>
                    <button className="p-2.5 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors border border-slate-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
