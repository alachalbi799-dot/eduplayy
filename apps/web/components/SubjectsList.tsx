"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  BookOpen,
  Code,
  Film,
  Lock,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  Check,
  Flame,
  Award,
  BookMarked,
  Layers,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { SubjectItem } from "@/lib/content";

gsap.registerPlugin(useGSAP);

interface SubjectsListProps {
  subjects: SubjectItem[];
}

export default function SubjectsList({ subjects }: SubjectsListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLDivElement>(null);
  const lockIconRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "active" | "coming">("all");
  const [notifiedSubjects, setNotifiedSubjects] = useState<Record<string, boolean>>({});

  // Entrance animations with GSAP
  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.from(".subjects-welcome-card", {
        y: -25,
        opacity: 0,
        duration: 0.55,
      })
        .from(
          ".metric-pill",
          {
            y: 20,
            opacity: 0,
            duration: 0.45,
            stagger: 0.08,
          },
          "-=0.2"
        )
        .from(
          ".filter-bar-container",
          {
            y: 15,
            opacity: 0,
            duration: 0.4,
          },
          "-=0.2"
        )
        .from(
          ".subject-card-item",
          {
            y: 35,
            opacity: 0,
            duration: 0.55,
            stagger: 0.1,
            ease: "back.out(1.2)",
          },
          "-=0.2"
        )
        .from(
          ".daily-tip-card",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.2"
        );
    },
    { scope: containerRef }
  );

  // 3D Tilt effect on the active subject card
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !activeCardRef.current ||
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const card = activeCardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(card, {
      rotateY: (x / rect.width) * 10,
      rotateX: (-y / rect.height) * 10,
      scale: 1.015,
      transformPerspective: 900,
      duration: 0.25,
      ease: "power1.out",
    });
  };

  const handleCardMouseLeave = () => {
    if (!activeCardRef.current) return;
    gsap.to(activeCardRef.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  // Playful wiggle on locked card hover
  const handleLockHover = (id: string) => {
    const el = lockIconRefs.current[id];
    if (
      !el ||
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    gsap.fromTo(
      el,
      { rotate: 0 },
      {
        rotate: 15,
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => gsap.set(el, { rotate: 0 }),
      }
    );
  };

  const handleNotifyToggle = (id: string) => {
    setNotifiedSubjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter and search logic
  const filteredSubjects = subjects.filter((subject) => {
    // Tab filter
    if (filterTab === "active" && !subject.active) return false;
    if (filterTab === "coming" && subject.active) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = subject.name.toLowerCase().includes(q);
      const matchDesc = subject.description.toLowerCase().includes(q);
      const matchTopics = subject.topics?.some((t) => t.toLowerCase().includes(q));
      return matchName || matchDesc || matchTopics;
    }

    return true;
  });

  const getIcon = (iconName: string, active: boolean) => {
    const className = `w-8 h-8 ${active ? "text-primary" : "text-muted"}`;
    switch (iconName) {
      case "Calculator":
        return <Calculator className={className} />;
      case "BookOpen":
        return <BookOpen className={className} />;
      case "Code":
        return <Code className={className} />;
      case "Film":
        return <Film className={className} />;
      default:
        return <GraduationCap className={className} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-10"
    >
      {/* =====================================================
          1. STUDENT WELCOME & GOAL HERO BANNER
          ===================================================== */}
      <div className="subjects-welcome-card bg-gradient-to-br from-indigo-900 via-primary to-indigo-800 rounded-3xl p-6 sm:p-10 text-white shadow-card border-2 border-indigo-500/20 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Session Active • Compte Étudiant</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-accent" />
                <span>Objectif 100% au Quiz</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Bonjour, <span className="text-amber-300">student</span> ! 👋
            </h1>

            <p className="text-indigo-100 text-base sm:text-lg font-normal leading-relaxed">
              Prêt pour votre révision du jour ? Explorez la leçon de Mathématiques, observez le schéma et testez votre score au quiz.
            </p>
          </div>

          {/* Quick Start Floating Action Card */}
          <div className="w-full md:w-auto flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col sm:flex-row md:flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent text-slate-900 flex items-center justify-center font-black text-xl shadow-soft">
                ∑
              </div>
              <div className="text-left">
                <div className="text-xs text-indigo-200 font-bold uppercase">Cours recommandé</div>
                <div className="font-extrabold text-base">Théorie des Graphes</div>
              </div>
            </div>

            <Link
              href="/subjects/math"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white hover:bg-indigo-50 text-primary font-bold text-sm shadow-soft hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Continuer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          2. DASHBOARD SUMMARY STATS ROW
          ===================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="metric-pill bg-white rounded-2xl p-5 border border-slate-200 shadow-soft hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-text">1 / 4</div>
            <div className="text-xs font-bold text-muted uppercase tracking-wider">
              Matière active
            </div>
          </div>
        </div>

        <div className="metric-pill bg-white rounded-2xl p-5 border border-slate-200 shadow-soft hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-accent flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-text">~15 min</div>
            <div className="text-xs font-bold text-muted uppercase tracking-wider">
              Temps estimé
            </div>
          </div>
        </div>

        <div className="metric-pill bg-white rounded-2xl p-5 border border-slate-200 shadow-soft hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-success flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-text">5 Qs</div>
            <div className="text-xs font-bold text-muted uppercase tracking-wider">
              Quiz interactif
            </div>
          </div>
        </div>

        <div className="metric-pill bg-white rounded-2xl p-5 border border-slate-200 shadow-soft hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-text">3 Médias</div>
            <div className="text-xs font-bold text-muted uppercase tracking-wider">
              Texte, Image, Vidéo
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          3. SEARCH & FILTER TABS
          ===================================================== */}
      <div className="filter-bar-container bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Chips */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              filterTab === "all"
                ? "bg-primary text-white shadow-soft"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Toutes les matières (4)
          </button>
          <button
            onClick={() => setFilterTab("active")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterTab === "active"
                ? "bg-primary text-white shadow-soft"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Disponible (1)</span>
          </button>
          <button
            onClick={() => setFilterTab("coming")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterTab === "coming"
                ? "bg-primary text-white shadow-soft"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>À venir (3)</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une matière..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* =====================================================
          4. ENRICHED SUBJECTS GRID
          ===================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredSubjects.map((subject) => {
          if (subject.active) {
            return (
              <div
                key={subject.id}
                ref={activeCardRef}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="subject-card-item group bg-white rounded-3xl p-8 border-2 border-indigo-200 hover:border-primary shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Subtle corner badge */}
                <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-50 to-transparent w-40 h-28 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-soft">
                      {getIcon(subject.icon, true)}
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-green-50 text-success border border-green-200 flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                      <span>Disponible immédiatement</span>
                    </span>
                  </div>

                  {subject.chapterTitle && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-2">
                      <BookMarked className="w-3.5 h-3.5" />
                      <span>{subject.chapterTitle}</span>
                    </div>
                  )}

                  <h2 className="text-2xl sm:text-3xl font-black text-text group-hover:text-primary transition-colors">
                    {subject.name}
                  </h2>
                  <p className="mt-3 text-muted text-base leading-relaxed">
                    {subject.description}
                  </p>

                  {/* Topic tag pills */}
                  {subject.topics && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {subject.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-indigo-50 hover:text-primary transition-colors"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Included components breakdown */}
                  <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>10 chapitres théoriques</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span>1 schéma vectoriel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>1 capsule vidéo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      <span>Quiz de 5 questions</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>{subject.estimatedTime || "~15 min"}</span>
                  </div>

                  <Link
                    href={`/subjects/${subject.id}`}
                    className="inline-flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-xl bg-primary hover:bg-indigo-700 text-white font-extrabold text-base shadow-soft hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    <span>Start</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          }

          // Inactive / Locked card with rich interactive micro-actions
          const isNotified = notifiedSubjects[subject.id];

          return (
            <div
              key={subject.id}
              onMouseEnter={() => handleLockHover(subject.id)}
              className="subject-card-item bg-white/70 rounded-3xl p-8 border-2 border-slate-200/80 opacity-80 flex flex-col justify-between transition-all duration-200 hover:opacity-90"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                    {getIcon(subject.icon, false)}
                  </div>
                  <div
                    ref={(el) => {
                      lockIconRefs.current[subject.id] = el;
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-slate-100 text-muted border border-slate-200"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{subject.badge || "Coming soon"}</span>
                  </div>
                </div>

                {subject.chapterTitle && (
                  <div className="text-xs font-bold text-slate-400 mb-1">
                    {subject.chapterTitle}
                  </div>
                )}

                <h2 className="text-2xl font-bold text-slate-700">
                  {subject.name}
                </h2>
                <p className="mt-3 text-slate-500 text-base leading-relaxed">
                  {subject.description}
                </p>

                {/* Preview topic tags */}
                {subject.topics && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {subject.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-100/70 text-slate-400 text-xs font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-slate-400">
                  Module en cours de finalisation
                </span>

                <button
                  onClick={() => handleNotifyToggle(subject.id)}
                  className={`inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    isNotified
                      ? "bg-green-50 text-success border border-green-200 shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                >
                  {isNotified ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>M&apos;avertir (Actif)</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5" />
                      <span>M&apos;avertir</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty Search State */}
      {filteredSubjects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <HelpCircle className="w-12 h-12 text-muted mx-auto mb-3" />
          <h3 className="text-xl font-bold text-text">Aucune matière trouvée</h3>
          <p className="text-muted text-sm mt-1">
            Essayez de modifier votre recherche ou réinitialisez les filtres.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterTab("all");
            }}
            className="mt-4 px-4 py-2 bg-indigo-50 text-primary font-bold text-sm rounded-xl"
          >
            Réinitialiser
          </button>
        </div>
      )}

      {/* =====================================================
          5. DAILY LEARNING TIP CARD
          ===================================================== */}
      <div className="daily-tip-card p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-4 text-amber-950">
        <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center flex-shrink-0 shadow-soft">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-extrabold text-base mb-1">
            Astuce d&apos;apprentissage EduPlay
          </h4>
          <p className="text-sm text-amber-900/90 leading-relaxed">
            Pour assimiler les graphes orientés plus efficacement, essayez de tracer à la main les relations {`{A, B}`} et les sens de flèches tout en lisant le chapitre, puis vérifiez immédiatement vos réponses dans le quiz !
          </p>
        </div>
      </div>
    </div>
  );
}
