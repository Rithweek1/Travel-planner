"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plane, Calendar, Wallet, Map, CheckCircle2, Mountain, Camera, ShoppingBag, UtensilsCrossed, Waves, Bike, ArrowLeft, ArrowRight } from "lucide-react";

const GREETINGS = ["Hello 👋", "Bienvenue 🇫🇷", "Bienvenido 🇪🇸", "Willkommen 🇩🇪", "स्वागत है 🇮🇳", "こんにちは 🇯🇵", "Marhaba 🇦🇪", "Ciao 🇮🇹"];

const CITY_OPTIONS = [
  { city: "Paris",    country: "France",    flag: "🇫🇷", img: "1499856871958-5b9627545d1a" },
  { city: "Tokyo",    country: "Japan",     flag: "🇯🇵", img: "1540959733332-eab4deabeeaf" },
  { city: "Bali",     country: "Indonesia", flag: "🇮🇩", img: "1537996194471-e657df975ab4" },
  { city: "New York", country: "USA",       flag: "🇺🇸", img: "1496442226666-8d4d0e62e6e9" },
  { city: "Rome",     country: "Italy",     flag: "🇮🇹", img: "1552832230-c0197dd311b5" },
  { city: "Dubai",    country: "UAE",       flag: "🇦🇪", img: "1512453979798-5ea266f8880c" },
];

const ACTIVITY_OPTIONS = [
  { id: "sightseeing", label: "Sightseeing", icon: Camera },
  { id: "hiking", label: "Hiking", icon: Mountain },
  { id: "food", label: "Food Tours", icon: UtensilsCrossed },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
  { id: "beach", label: "Beach", icon: Waves },
  { id: "cycling", label: "Cycling", icon: Bike },
];

const DAYS_OPTIONS = [
  { value: "1", label: "1 Day", sub: "Day Trip" },
  { value: "3", label: "3 Days", sub: "Weekend" },
  { value: "5", label: "5 Days", sub: "Short Break" },
  { value: "7", label: "7 Days", sub: "Expedition" },
  { value: "10", label: "10 Days", sub: "Grand Tour" },
  { value: "14", label: "14 Days", sub: "Epic Journey" },
];

const BUDGETS = [
  { value: "500", label: "$500", sub: "Budget" },
  { value: "1500", label: "$1,500", sub: "Economy" },
  { value: "3000", label: "$3,000", sub: "Comfort" },
  { value: "6000", label: "$6,000", sub: "Premium" },
  { value: "10000", label: "$10,000+", sub: "Luxury" },
];

const STEPS = [
  { id: 1, label: "Destination", icon: Map },
  { id: 2, label: "Dates", icon: Calendar },
  { id: 3, label: "Budget", icon: Wallet },
  { id: 4, label: "Activities", icon: Mountain },
  { id: 5, label: "Review", icon: CheckCircle2 },
];

function PlannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preloaded = searchParams.get("destination") || "";

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState(preloaded);
  const [customDest, setCustomDest] = useState(preloaded);
  const [days, setDays] = useState("5");
  const [budget, setBudget] = useState("3000");
  const [activities, setActivities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = Math.round(((step - 1) / (STEPS.length - 1)) * 100);

  const toggleActivity = (id: string) => {
    setActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const finalDest = customDest || destination;
    const qs = new URLSearchParams({ destination: finalDest, days, budget });
    activities.forEach((a) => qs.append("activities", a));
    router.push(`/itinerary?${qs.toString()}`);
  };

  const greetingText = GREETINGS.join(" • ") + " • ";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50" style={{ fontFamily: "var(--font-inter)" }}>
      {/* ── Top Marquee ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marqueeRev { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .marquee { display: inline-block; white-space: nowrap; animation: marquee 28s linear infinite; }
        .marqueeRev { display: inline-block; white-space: nowrap; animation: marqueeRev 28s linear infinite; }
      `}} />

      <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-rose-400 text-white py-2.5 overflow-hidden">
        <div className="marquee font-semibold tracking-wide text-sm">
          <span>{greetingText.repeat(4)}</span>
          <span>{greetingText.repeat(4)}</span>
        </div>
      </div>

      {/* ── Topbar ── */}
      <div className="bg-white border-b border-slate-100 shadow-sm px-4 md:px-8 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors"
        >
          <ArrowLeft size={18} /> Back to Home
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-sky-500 to-rose-400 p-1.5 rounded-lg">
            <Plane className="text-white w-4 h-4" />
          </div>
          <span className="font-black text-slate-900 text-xl" style={{ fontFamily: "var(--font-poppins)" }}>Voyagr</span>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-8 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-sky-700">Trip Planning Progress</span>
            <span className="text-sm font-black text-rose-500">{progress}% Complete</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-rose-400 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-between mt-3">
            {STEPS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => id < step && setStep(id)}
                className={`flex flex-col items-center gap-1 transition-all ${id <= step ? "text-sky-600" : "text-slate-300"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${id < step ? "bg-sky-500 border-sky-500 text-white" : id === step ? "border-sky-500 text-sky-600 bg-white" : "border-slate-200 bg-white text-slate-300"}`}>
                  {id < step ? <CheckCircle2 size={14} /> : <Icon size={14} />}
                </div>
                <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-wider">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Panel ── */}
      <div className="flex-1 px-4 md:px-8 py-10 max-w-3xl mx-auto w-full">

        {/* STEP 1 – Choose Destination */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: "var(--font-poppins)" }}>Where to? 🌍</h2>
            <p className="text-slate-500 mb-8">Choose a popular destination or type your own.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {CITY_OPTIONS.map((opt) => (
                <button
                  key={opt.city}
                  onClick={() => { setDestination(`${opt.city}, ${opt.country}`); setCustomDest(`${opt.city}, ${opt.country}`); }}
                  className={`group relative h-36 rounded-2xl overflow-hidden border-4 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 ${destination.startsWith(opt.city) ? "border-sky-500 scale-[1.02]" : "border-transparent"}`}
                >
                  <img src={`https://images.unsplash.com/photo-${opt.img}?q=80&w=400&auto=format&fit=crop`} alt={opt.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white text-left">
                    <div className="font-black text-[15px]" style={{ fontFamily: "var(--font-poppins)" }}>{opt.city} {opt.flag}</div>
                    <div className="text-white/70 text-xs">{opt.country}</div>
                  </div>
                  {destination.startsWith(opt.city) && (
                    <div className="absolute top-3 right-3 bg-sky-500 rounded-full p-1">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Or type a custom destination</label>
              <input
                type="text"
                value={customDest}
                onChange={(e) => { setCustomDest(e.target.value); setDestination(e.target.value); }}
                placeholder="e.g. Santorini, Greece"
                className="w-full bg-white border-2 border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-50 rounded-2xl px-5 py-4 text-lg font-medium text-slate-900 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        )}

        {/* STEP 2 – Select Dates */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: "var(--font-poppins)" }}>How Long? 📅</h2>
            <p className="text-slate-500 mb-8">Select the duration of your trip to <strong className="text-slate-800">{destination}</strong>.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {DAYS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDays(opt.value)}
                  className={`p-6 rounded-2xl border-2 text-center transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md ${days === opt.value ? "border-sky-500 bg-sky-50 shadow-sky-100" : "border-slate-200 bg-white"}`}
                >
                  <div className={`text-3xl font-black mb-1 ${days === opt.value ? "text-sky-600" : "text-slate-800"}`} style={{ fontFamily: "var(--font-poppins)" }}>{opt.label}</div>
                  <div className={`text-sm font-semibold ${days === opt.value ? "text-sky-400" : "text-slate-400"}`}>{opt.sub}</div>
                  {days === opt.value && <div className="mt-2 text-sky-500"><CheckCircle2 size={20} className="mx-auto" /></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 – Set Budget */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: "var(--font-poppins)" }}>Set Your Budget 💰</h2>
            <p className="text-slate-500 mb-8">What's your approximate total travel budget?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {BUDGETS.map((b) => (
                <button
                  key={b.value}
                  onClick={() => setBudget(b.value)}
                  className={`p-6 rounded-2xl border-2 text-center transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md ${budget === b.value ? "border-rose-400 bg-rose-50 shadow-rose-100" : "border-slate-200 bg-white"}`}
                >
                  <div className={`text-2xl font-black mb-1 ${budget === b.value ? "text-rose-500" : "text-slate-800"}`} style={{ fontFamily: "var(--font-poppins)" }}>{b.label}</div>
                  <div className={`text-sm font-semibold ${budget === b.value ? "text-rose-300" : "text-slate-400"}`}>{b.sub}</div>
                  {budget === b.value && <div className="mt-2 text-rose-400"><CheckCircle2 size={20} className="mx-auto" /></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 – Pick Activities */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: "var(--font-poppins)" }}>Pick Your Vibe 🎯</h2>
            <p className="text-slate-500 mb-8">Select all the activities you'd love to do.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {ACTIVITY_OPTIONS.map(({ id, label, icon: Icon }) => {
                const active = activities.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleActivity(id)}
                    className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md ${active ? "border-indigo-500 bg-indigo-50 shadow-indigo-100" : "border-slate-200 bg-white"}`}
                  >
                    <div className={`p-3 rounded-xl ${active ? "bg-indigo-500 text-white shadow-md shadow-indigo-200" : "bg-slate-100 text-slate-500"}`}>
                      <Icon size={24} />
                    </div>
                    <span className={`font-bold text-sm ${active ? "text-indigo-700" : "text-slate-600"}`}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5 – Review */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: "var(--font-poppins)" }}>Your Trip Summary ✈️</h2>
            <p className="text-slate-500 mb-8">Review your selections, then let Voyagr's AI craft your perfect itinerary.</p>
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-sky-500 to-rose-400 p-6 text-white">
                <div className="text-3xl font-black" style={{ fontFamily: "var(--font-poppins)" }}>{destination || "Not set"}</div>
                <div className="text-white/80 font-medium mt-1">{days} Days • ${parseInt(budget).toLocaleString()} Budget</div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Destination", val: destination || "Not selected", emoji: "📍" },
                  { label: "Duration", val: `${days} Days`, emoji: "📅" },
                  { label: "Budget", val: `$${parseInt(budget).toLocaleString()}`, emoji: "💰" },
                  { label: "Activities", val: activities.length ? activities.join(", ") : "No specific activities", emoji: "🎯" },
                ].map(({ label, val, emoji }) => (
                  <div key={label} className="flex items-start gap-4 py-3 border-b border-slate-50 last:border-0">
                    <span className="text-2xl">{emoji}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                      <div className="text-slate-800 font-semibold mt-0.5 capitalize">{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-8 w-full bg-gradient-to-r from-sky-500 to-rose-400 text-white font-black text-xl py-5 rounded-2xl shadow-2xl hover:shadow-sky-200 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait"
            >
              {isSubmitting ? (
                <><Plane className="animate-spin" size={24} /> Generating your itinerary...</>
              ) : (
                <><Plane size={24} /> Generate My AI Itinerary</>
              )}
            </button>
          </div>
        )}

        {/* ── Navigation Buttons ── */}
        <div className={`flex mt-10 gap-4 ${step > 1 ? "justify-between" : "justify-end"}`}>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-bold px-6 py-3.5 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all"
            >
              <ArrowLeft size={18} /> Back
            </button>
          )}
          {step < 5 && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !destination.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-rose-400 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-sky-200 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              Next Step <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ── Bottom Marquee ── */}
      <div className="bg-slate-900 text-white py-3 overflow-hidden">
        <div className="marqueeRev font-bold tracking-widest text-sm uppercase">
          <span>{GREETINGS.map(g => `${g}  •  `).join("").repeat(4)}</span>
          <span>{GREETINGS.map(g => `${g}  •  `).join("").repeat(4)}</span>
        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Plane className="animate-spin mx-auto text-sky-500 mb-4" size={40} />
          <div className="font-bold text-slate-600">Loading Planner...</div>
        </div>
      </div>
    }>
      <PlannerContent />
    </Suspense>
  );
}
