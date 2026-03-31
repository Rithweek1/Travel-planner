"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Compass, Plane, Calendar, MapPin, X } from "lucide-react";

function ItineraryContent() {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  const days = searchParams.get("days");
  const budget = searchParams.get("budget");
  const specificActivities = searchParams.getAll("activities");
  
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (!destination || !days) return;

    const fetchItinerary = async () => {
      try {
        const res = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            destination, 
            days,
            budget,
            activities: specificActivities 
          }),
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch itinerary. The AI model may be offline.");
        }

        setItinerary(data.itinerary);
      } catch (err: any) {
        console.error("Error generating itinerary:", err);
        setErrorText(err.message || "An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [destination, days]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyword mapped to ARRAYS of high quality Unsplash photos.
  const IMAGE_POOLS: Record<string, string[]> = {
    temple: ["1599839619722-39751411ea63", "1518548419970-58716908a1a5", "1528360983277-1a14ce861fa9"],
    shrine: ["1599839619722-39751411ea63", "1518548419970-58716908a1a5"],
    beach: ["1507525428034-b723cf961d3e", "1499793983690-e29da59ef1b2", "1471922617510-5bf141ebbb6e"],
    ocean: ["1507525428034-b723cf961d3e", "1499793983690-e29da59ef1b2"],
    museum: ["1518998053901-5314ad01934c", "1572949645841-094f3a9c4c94", "1582555172866-fc6dd63a23cb"],
    art: ["1518998053901-5314ad01934c", "1572949645841-094f3a9c4c94"],
    park: ["1519331379826-f10be5486c6f", "1585938389612-a552a28d6914"],
    garden: ["1519331379826-f10be5486c6f", "1585938389612-a552a28d6914"],
    market: ["1533900298318-6b8da08a523e", "1515705333552-6701bb122be2", "1542838132-92c53300491e"],
    shopping: ["1533900298318-6b8da08a523e", "1441986300917-0b6fd9183658"],
    restaurant: ["1504674900247-0877df9cc836", "1414235077428-9711455e1236", "1517248135467-4c7edcad34c4", "1555396273-367ea4eb4db5"],
    food: ["1504674900247-0877df9cc836", "1414235077428-9711455e1236", "1517248135467-4c7edcad34c4"],
    dinner: ["1414235077428-9711455e1236", "1555396273-367ea4eb4db5"],
    lunch: ["1504674900247-0877df9cc836", "1517248135467-4c7edcad34c4"],
    mountain: ["1464822759023-fed622ff2c3b", "1469334025828-f279d1153d6a", "1516981879613-9a3d4fba73f6"],
    hiking: ["1464822759023-fed622ff2c3b", "1469334025828-f279d1153d6a"],
    city: ["1477959858617-6c0b48c0a21a", "1449844908441-8829872d2607", "1518684079-3c830dcef090"],
    architecture: ["1477959858617-6c0b48c0a21a", "1449844908441-8829872d2607"],
  };

  const getKeywordImage = (text: string, index: number) => {
    const lower = text.toLowerCase();
    for (const [keyword, pool] of Object.entries(IMAGE_POOLS)) {
      if (lower.includes(keyword)) {
        return `https://images.unsplash.com/photo-${pool[index % pool.length]}?w=600&q=80`;
      }
    }
    // Return null so we don't spam the UI with generic photos
    return null;
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmed = line.trim();

      // First line: native-language greeting
      if (index === 0 && trimmed.length > 0) {
        return <h1 key={index} className="text-4xl md:text-5xl text-rose-400 font-bold mb-8 italic text-center">{trimmed}</h1>;
      }

      // Day / time headers (support Day 1, Morning, Day 1: Morning, etc.)
      if (/^(day\s\d|morning|afternoon|evening|pro tip|summary)/i.test(trimmed)) {
        return <h3 key={index} className="mt-12 mb-4 text-sky-900 font-bold text-2xl border-b-2 border-sky-100 pb-2">{trimmed}</h3>;
      }

      // Bullet list items
      const bulletMatch = trimmed.match(/^[-•*]\s+(.+)/);
      if (bulletMatch) {
        const content = bulletMatch[1];
        const imageUrl = getKeywordImage(content, index);
        return (
          <li key={index} className="flex flex-col mb-6 group bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-0.5">
            <div className="flex items-start gap-2">
              <span className="text-sky-500 mt-1 text-lg leading-none flex-shrink-0">•</span>
              <span className="text-slate-700 font-medium leading-relaxed">{content}</span>
            </div>
            {imageUrl && (
              <div className="mt-4 overflow-hidden rounded-2xl shadow-sm border border-slate-100 max-w-xl">
                <img src={imageUrl} alt="" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-[8s]" />
              </div>
            )}
          </li>
        );
      }

      // Numbered list items
      const numberedMatch = trimmed.match(/^\d+\.\s+(.+)/);
      if (numberedMatch) {
        return (
          <li key={index} className="flex items-start gap-2 mb-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-sky-500 font-bold flex-shrink-0">{trimmed.match(/^\d+/)?.[0]}.</span>
            <span className="text-slate-700 leading-relaxed">{numberedMatch[1]}</span>
          </li>
        );
      }

      // Blank line
      if (trimmed === "") return <div key={index} className="h-2" />;

      // Regular paragraph
      return <p key={index} className="mb-4 text-slate-600 leading-relaxed text-lg">{trimmed}</p>;
    });
  };

  if (!destination) {
    return (
      <div className="text-center p-12 bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg mx-auto w-full">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Destination missing!</h2>
        <Link href="/" className="inline-flex items-center gap-2 bg-rose-400 hover:bg-rose-500 text-white font-bold py-3 px-6 rounded-2xl transition-all">
          <ArrowLeft size={20} /> Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="flex items-center gap-2 text-sky-600 hover:text-sky-800 font-bold transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 hover:shadow-md">
          <ArrowLeft size={18} /> New Search
        </Link>
        <div className="bg-sky-50 text-sky-800 font-semibold px-4 py-2 rounded-xl shadow-sm border border-sky-100 flex items-center gap-2">
          <Compass size={18} className="text-rose-400" /> Dashboard Overview
        </div>
      </div>

      {loading && (
        <div className="bg-white shadow-2xl rounded-3xl p-16 border border-slate-100 text-center flex flex-col items-center justify-center min-h-[50vh] animate-in slide-in-from-bottom-8 duration-700">
          <Plane className="animate-bounce h-16 w-16 text-sky-500 mb-6" />
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Crafting Your Journey...</h2>
          <p className="text-slate-500 mt-3 text-lg font-medium max-w-md mx-auto">Our AI is gathering the finest experiences and weaving them into {days} unforgettable days in {destination}!</p>
        </div>
      )}

      {errorText && (
        <div className="bg-white shadow-2xl rounded-3xl p-12 border-2 border-rose-100 text-center flex flex-col items-center">
          <div className="bg-rose-100 text-rose-600 p-4 rounded-full mb-6">
            <X size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Oops!</h2>
          <p className="text-slate-600 text-xl font-medium">{errorText}</p>
          <button onClick={() => window.location.reload()} className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-md hover:shadow-lg">
            Try Again
          </button>
        </div>
      )}

      {itinerary && !loading && (
        <div className="bg-white/80 backdrop-blur-3xl shadow-2xl rounded-3xl p-8 md:p-14 border border-slate-100 transition-all duration-700">
          <div className="border-b-2 border-slate-100 pb-8 mb-10 text-center">
             <div className="inline-flex items-center justify-center bg-rose-50 text-rose-500 p-4 rounded-full mb-6 shadow-inner">
               <Calendar size={40} />
             </div>
            <h2 className="text-4xl md:text-5xl font-black text-sky-950 tracking-tight mb-4">Your Exclusive Itinerary</h2>
            <div className="inline-flex items-center gap-2 bg-sky-50 px-6 py-2 rounded-full text-sky-800 font-bold border border-sky-100">
               <MapPin size={18} /> {days} Days in {destination}
            </div>
          </div>
          <div className="max-w-none">
            {formatText(itinerary)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ItineraryPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-rose-200">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-sky-800 text-xl font-bold flex justify-center w-full"><Plane className="animate-spin mr-3"/>Loading Dashboard...</div>}>
          <ItineraryContent />
        </Suspense>
      </div>
    </main>
  );
}
