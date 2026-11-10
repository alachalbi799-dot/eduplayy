"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, BookOpen } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Do not show app navbar on login page or public landing page
  if (pathname === "/login" || pathname === "/") {
    return null;
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo and Wordmark */}
        <Link
          href="/subjects"
          className="flex items-center gap-3.5 group transition-transform active:scale-95"
        >
          <div className="w-11 h-11 relative rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-indigo-50 border border-indigo-100">
            <Image
              src="/logo.svg"
              alt="EduPlay Logo"
              width={40}
              height={40}
              priority
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-black text-primary tracking-tight group-hover:text-indigo-700 transition-colors">
            EduPlay
          </span>
        </Link>

        {/* Right Navigation & Logout */}
        <div className="flex items-center gap-4">
          <Link
            href="/subjects"
            className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold transition-colors ${
              pathname.startsWith("/subjects")
                ? "bg-indigo-50 text-primary"
                : "text-muted hover:text-text hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Matières</span>
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold text-danger hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-200 disabled:opacity-50"
            title="Se déconnecter"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">
              {loggingOut ? "Déconnexion..." : "Log out"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
