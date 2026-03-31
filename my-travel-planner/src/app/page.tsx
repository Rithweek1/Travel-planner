"use client";

import { useRouter } from "next/navigation";
import { Plane, Star, MapPin, Compass, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

const DESTINATIONS = [
  {
    city: "Paris",
    country: "France",
    flag: "🇫🇷",
    rating: 4.9,
    desc: "The city of love, art, and world-class cuisine.",
    img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop",
    isFullUrl: true,
    nights: "5 Nights from $1,200",
  },
  {
    city: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    rating: 4.8,
    desc: "Tropical paradise with temples, rice terraces, and beaches.",
    img: "1537996194471-e657df975ab4",
    nights: "7 Nights from $900",
  },
  {
    city: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    rating: 4.9,
    desc: "A perfect blend of neon-lit streets and ancient tradition.",
    img: "1540959733332-eab4deabeeaf",
    nights: "6 Nights from $1,500",
  },
  {
    city: "New York",
    country: "USA",
    flag: "🇺🇸",
    rating: 4.7,
    desc: "The city that never sleeps — iconic skylines and culture.",
    img: "1496442226666-8d4d0e62e6e9",
    nights: "4 Nights from $1,100",
  },
];

// Verified Unsplash landmark IDs
const HERO_IMAGES = [
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/800px-Tour_Eiffel_Wikimedia_Commons.jpg",  label: "Eiffel Tower" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/960px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg", label: "Taj Mahal" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/960px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg", label: "Great Wall" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/960px-New_york_times_square-terabass.jpg", label: "New York" },
];

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePlanNow = (city: string, country: string) => {
    router.push(`/plan?destination=${encodeURIComponent(`${city}, ${country}`)}`);
  };

  const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/#destinations" },
    { label: "My Trips", href: "/my-trips" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "var(--font-inter)" }}>
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="bg-gradient-to-br from-sky-500 to-rose-400 p-2 rounded-xl shadow-md">
              <Plane className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-poppins)" }}>
              Voyagr
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((item) => (
              <a key={item.label} href={item.href} className="text-slate-600 hover:text-sky-600 font-semibold transition-colors text-[15px]">{item.label}</a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => router.push("/signin")} className="text-slate-600 hover:text-slate-900 font-semibold text-[15px] transition-colors">Sign In</button>
            <button
              onClick={() => router.push("/plan")}
              className="bg-gradient-to-r from-sky-500 to-rose-400 text-white font-bold px-5 py-2 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Create Itinerary
            </button>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1">
            {NAV_LINKS.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="flex items-center text-slate-700 hover:text-sky-600 hover:bg-sky-50 font-semibold py-3 px-3 rounded-xl transition-colors">{item.label}</a>
            ))}
            <button onClick={() => { router.push("/signin"); setMenuOpen(false); }} className="w-full text-left text-slate-700 hover:text-sky-600 hover:bg-sky-50 font-semibold py-3 px-3 rounded-xl transition-colors">Sign In</button>
            <button
              onClick={() => { router.push("/plan"); setMenuOpen(false); }}
              className="w-full bg-gradient-to-r from-sky-500 to-rose-400 text-white font-bold py-3 rounded-xl mt-2"
            >
              Create Itinerary
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* 2x2 landmark grid — each cell sized to exactly 50% */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {HERO_IMAGES.map(({ src, label }, i) => (
            <div key={i} className="relative overflow-hidden w-full h-full">
              <img
                src={src}
                alt={label}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            </div>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/80 via-slate-900/70 to-rose-900/80" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Compass size={16} className="text-rose-300" /> AI-Powered Travel Planning
          </div>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-tight mb-6"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Your World,<br />
            <span className="bg-gradient-to-r from-sky-300 to-rose-300 bg-clip-text text-transparent">
              Perfectly Planned.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Voyagr uses AI to craft unique day-by-day itineraries for any destination in seconds. Say goodbye to travel stress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/plan")}
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-rose-400 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-2xl hover:shadow-sky-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              Start Planning Free
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#destinations" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300">
              <MapPin size={20} /> Explore Destinations
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14">
            {[["150+", "Destinations"], ["50K+", "Trips Planned"], ["4.9★", "User Rating"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-poppins)" }}>{num}</div>
                <div className="text-white/60 text-sm font-medium mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Destination Cards ── */}
      <section id="destinations" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
            Top Destinations
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">From iconic cities to hidden gems — explore the world with Voyagr.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.city}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100"
            >
              {/* Card Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dest.isFullUrl ? dest.img : `https://images.unsplash.com/photo-${dest.img}?q=80&w=600&auto=format&fit=crop`}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-2xl font-black" style={{ fontFamily: "var(--font-poppins)" }}>{dest.city} {dest.flag}</div>
                  <div className="text-white/80 text-sm font-medium">{dest.country}</div>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} fill="currentColor" className="text-amber-300" /> {dest.rating}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <p className="text-slate-500 text-sm leading-relaxed mb-3">{dest.desc}</p>
                <div className="text-sky-600 font-bold text-sm mb-4">{dest.nights}</div>
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(dest.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                  ))}
                </div>
                <button
                  onClick={() => handlePlanNow(dest.city, dest.country)}
                  className="mt-4 w-full bg-gradient-to-r from-sky-500 to-rose-400 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-sky-200 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Plan Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-white py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-gradient-to-br from-sky-500 to-rose-400 p-2 rounded-xl">
            <Plane className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black" style={{ fontFamily: "var(--font-poppins)" }}>Voyagr</span>
        </div>
        <p className="text-slate-400 text-sm">© 2026 Voyagr. AI-powered travel planning for the modern explorer.</p>
      </footer>
    </div>
  );
}
