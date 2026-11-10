"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ArrowRight, BookOpen, Layers, LogOut } from "lucide-react";

export default function LandingNavbar() {
  const router = useRouter();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Check if user has an active session cookie
    const hasSession = document.cookie.includes("eduplay_session=student");
    setIsAuthenticated(hasSession);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        hasScrolled
          ? "bg-white/95 backdrop-blur-md shadow-card border-b border-slate-200/80 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 relative rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-indigo-50 border border-indigo-100 group-hover:rotate-6 transition-transform">
            <Image
              src="/logo.svg"
              alt="EduPlay Logo"
              width={36}
              height={36}
              priority
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-black text-primary tracking-tight">
            EduPlay
          </span>
        </Link>

        {/* Desktop Anchor Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-base font-bold text-slate-700 hover:text-primary transition-colors flex items-center gap-2 hover:-translate-y-0.5 transform duration-150"
          >
            <Layers className="w-4 h-4 text-primary" />
            <span>Comment ça marche</span>
          </a>
          <a
            href="#subjects-preview"
            className="text-base font-bold text-slate-700 hover:text-primary transition-colors flex items-center gap-2 hover:-translate-y-0.5 transform duration-150"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Matières</span>
          </a>
        </div>

        {/* Desktop Auth CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href="/subjects"
                className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-primary hover:bg-indigo-700 text-white font-bold text-base shadow-soft hover:shadow-card hover:-translate-y-1 active:translate-y-0 transition-all duration-200 group"
              >
                <span>Accéder aux cours</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl text-danger hover:bg-red-50 font-bold text-sm border border-transparent hover:border-red-200 transition-all duration-200 disabled:opacity-50"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
                <span>{loggingOut ? "..." : "Log out"}</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-primary hover:bg-indigo-700 text-white font-bold text-base shadow-soft hover:shadow-card hover:-translate-y-1 active:translate-y-0 transition-all duration-200 group"
            >
              <span>Log in</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="p-2 rounded-xl text-slate-700 hover:text-primary hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-fade-in">
          <div className="flex flex-col space-y-4">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-slate-800 hover:text-primary py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-3"
            >
              <Layers className="w-5 h-5 text-primary" />
              <span>Comment ça marche</span>
            </a>
            <a
              href="#subjects-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-slate-800 hover:text-primary py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-3"
            >
              <BookOpen className="w-5 h-5 text-primary" />
              <span>Matières</span>
            </a>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/subjects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-primary hover:bg-indigo-700 text-white font-bold text-base shadow-soft transition-all"
                  >
                    <span>Accéder aux cours</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    disabled={loggingOut}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-danger hover:bg-red-50 font-bold text-sm border border-red-200 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Se déconnecter</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-primary hover:bg-indigo-700 text-white font-bold text-base shadow-soft transition-all"
                >
                  <span>Log in</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
