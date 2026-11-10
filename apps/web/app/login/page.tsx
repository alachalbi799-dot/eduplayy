"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function LoginPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // Logo and wordmark fade and slide in on load (duration 0.6s)
      gsap.from(".login-brand-header", {
        y: -24,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      // Card container subtle fade up
      gsap.from(".login-card", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        delay: 0.1,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/subjects");
        router.refresh();
      } else {
        setError(data.message || "Identifiants invalides. Veuillez réessayer.");
      }
    } catch {
      setError("Une erreur réseau s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50/50 via-background to-amber-50/30"
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="login-card bg-white rounded-2xl shadow-card border border-slate-100 p-8 sm:p-10">
          {/* Logo and Wordmark */}
          <div className="login-brand-header flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 relative mb-4 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-soft flex items-center justify-center p-3">
              <Image
                src="/logo.svg"
                alt="EduPlay Logo"
                width={64}
                height={64}
                priority
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-black text-primary tracking-tight">
              EduPlay
            </h1>
            <p className="text-muted text-base mt-2">
              Connectez-vous pour accéder à vos cours interactifs.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-danger flex items-start gap-3 text-base">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold text-text mb-2"
              >
                Nom d&apos;utilisateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex : student"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base text-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-text mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base text-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Demo hints */}
            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-sm text-indigo-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
              <div>
                Compte démo : <span className="font-semibold text-primary">student</span> / mot de passe : <span className="font-semibold text-primary">eduplay123</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-primary hover:bg-indigo-700 text-white font-bold text-lg shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.99] disabled:opacity-60"
            >
              <span>{loading ? "Connexion en cours..." : "Log in"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
