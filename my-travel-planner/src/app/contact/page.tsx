"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "var(--font-inter)" }}>
      <nav className="bg-white border-b border-slate-100 shadow-sm px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors">
          <ArrowLeft size={18} /> Home
        </button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="bg-gradient-to-br from-sky-500 to-rose-400 p-1.5 rounded-lg">
            <Plane className="text-white w-4 h-4" />
          </div>
          <span className="font-black text-slate-900 text-xl" style={{ fontFamily: "var(--font-poppins)" }}>Voyagr</span>
        </div>
        <div className="w-24" />
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-sky-500 to-rose-400 py-16 px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "var(--font-poppins)" }}>Get in Touch ✉️</h1>
        <p className="text-white/80 text-lg max-w-lg mx-auto">Have a question or need help planning your dream trip? We'd love to hear from you.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-2 gap-10">
        {/* Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: "var(--font-poppins)" }}>Contact Info</h2>
          {[
            { icon: Mail, label: "Email", val: "hello@voyagr.ai" },
            { icon: Phone, label: "Phone", val: "+1 (800) VOYAGR-1" },
            { icon: MapPin, label: "Address", val: "123 Explorer Ave, San Francisco, CA" },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="bg-gradient-to-br from-sky-500 to-rose-400 p-3 rounded-xl text-white flex-shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
                <div className="text-slate-800 font-semibold">{val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle2 size={56} className="mx-auto text-emerald-500 mb-4" />
              <h3 className="text-2xl font-black text-slate-800 mb-2">Message Sent!</h3>
              <p className="text-slate-500">We'll get back to you within 24 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }} className="mt-6 bg-gradient-to-r from-sky-500 to-rose-400 text-white font-bold px-8 py-3 rounded-2xl hover:-translate-y-0.5 transition-all shadow-md">
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-xl font-black text-slate-900 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>Send a Message</h3>
              {(["name", "email"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{field}</label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    required
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder={field === "name" ? "Your full name" : "your@email.com"}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-50 rounded-xl px-4 py-3 text-slate-900 outline-none transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you plan your perfect trip?"
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-50 rounded-xl px-4 py-3 text-slate-900 outline-none transition-all resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-rose-400 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                <Send size={18} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
