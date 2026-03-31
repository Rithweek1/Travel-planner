"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Eye, EyeOff, ArrowLeft, LogIn } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/my-trips");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-inter)" }}>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/80 to-rose-900/80" />
      </div>

      {/* Top Nav */}
      <div className="p-4 md:p-6">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 text-white/80 hover:text-white font-semibold transition-colors">
          <ArrowLeft size={18} /> Back to Home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                <Plane className="text-white w-7 h-7" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-white mb-1" style={{ fontFamily: "var(--font-poppins)" }}>Welcome Back</h1>
            <p className="text-white/70 text-base">Sign in to continue your journey</p>
          </div>

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white/70 text-xs font-bold uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full bg-white/20 border-2 border-white/20 focus:border-white/50 rounded-2xl px-5 py-3.5 text-white placeholder:text-white/40 outline-none transition-all backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-white/70 text-xs font-bold uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white/20 border-2 border-white/20 focus:border-white/50 rounded-2xl px-5 py-3.5 pr-14 text-white placeholder:text-white/40 outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors">
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded" /> Remember me
                </label>
                <a href="#" className="text-sky-300 hover:text-sky-200 text-sm font-semibold transition-colors">Forgot password?</a>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-rose-400 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2">
                <LogIn size={20} /> Sign In to Voyagr
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-white/50 text-sm font-medium">or continue with</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {["Google", "Apple"].map((provider) => (
                <button key={provider} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 rounded-xl transition-all hover:-translate-y-0.5">
                  {provider}
                </button>
              ))}
            </div>

            <p className="text-center text-white/60 text-sm mt-6">
              Don't have an account?{" "}
              <a href="#" className="text-sky-300 hover:text-sky-200 font-bold transition-colors">Create one free →</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
