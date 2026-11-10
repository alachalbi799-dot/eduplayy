"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  CheckCircle2,
  Lock,
  Calculator,
  Code,
  Film,
  PlayCircle,
  HelpCircle,
  Compass,
  ChevronDown,
  Bell,
  Clock,
  Flame,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import LandingNavbar from "./LandingNavbar";
import MiniQuiz from "./MiniQuiz";
import InteractiveGraphHero from "./InteractiveGraphHero";
import InteractiveHowItWorks from "./InteractiveHowItWorks";
import type { NormalizedQuestion, SubjectItem } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface LandingClientViewProps {
  quizQuestion: NormalizedQuestion;
  subjects: SubjectItem[];
}

const FAQ_ITEMS = [
  {
    q: "EduPlay est-il adapté aux débutants ?",
    a: "Absolument. Chaque chapitre commence par les définitions fondamentales et des exemples concrets du quotidien avant d'aborder les propriétés formelles.",
  },
  {
    q: "Quels types de médias sont inclus dans chaque cours ?",
    a: "Chaque leçon combine une synthèse textuelle claire, des schémas visuels annotés, une capsule vidéo de référence et un quiz interactif avec correction immédiate.",
  },
  {
    q: "Comment fonctionne la validation par quiz ?",
    a: "Chaque quiz comporte 5 questions ciblées. Dès que vous choisissez une option, la bonne réponse est immédiatement surlignée en vert et un feedback explicatif s'affiche.",
  },
  {
    q: "Les autres matières (English, Informatique, Multimédia) seront-elles disponibles ?",
    a: "Oui, ces matières font partie de notre programme pédagogique et leurs chapitres sont actuellement en cours d'intégration.",
  },
];

export default function LandingClientView({
  quizQuestion,
  subjects,
}: LandingClientViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSubjectCardRef = useRef<HTMLDivElement>(null);

  // Animated stat values (for count-up)
  const [statSubjects, setStatSubjects] = useState(0);
  const [statQuestions, setStatQuestions] = useState(0);
  const [statMedia, setStatMedia] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [notifiedSubjects, setNotifiedSubjects] = useState<Record<string, boolean>>({});

  useGSAP(
    () => {
      // Check session
      setIsAuthenticated(document.cookie.includes("eduplay_session=student"));

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        setStatSubjects(4);
        setStatQuestions(5);
        setStatMedia(3);
        return;
      }

      // --- 1. HERO TIMELINE (0.6s per text element) ---
      const heroTl = gsap.timeline({ defaults: { ease: "power2.out" } });

      heroTl
        .from(".hero-badge", {
          y: -20,
          opacity: 0,
          duration: 0.5,
        })
        .from(
          ".hero-headline",
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.2"
        )
        .from(
          ".hero-subtitle",
          {
            y: 25,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.2"
        )
        .from(
          ".hero-cta-btn",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
          },
          "-=0.3"
        )
        .from(
          ".hero-graph-box",
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.7,
            ease: "back.out(1.2)",
          },
          "-=0.4"
        );

      // --- 2. INFINITE TICKER MARQUEE ---
      gsap.to(".marquee-track", {
        xPercent: -50,
        repeat: -1,
        duration: 22,
        ease: "none",
      });

      // --- 3. STATS ROW COUNT-UP (1.0s DURATION) ---
      ScrollTrigger.create({
        trigger: ".stats-container",
        start: "top 85%",
        once: true,
        onEnter: () => {
          const stats = [
            { target: 4, setter: setStatSubjects },
            { target: 5, setter: setStatQuestions },
            { target: 3, setter: setStatMedia },
          ];

          stats.forEach((item) => {
            const countObj = { val: 0 };
            gsap.to(countObj, {
              val: item.target,
              duration: 1.0,
              ease: "power2.out",
              onUpdate: () => item.setter(Math.round(countObj.val)),
            });
          });
        },
      });

      // --- 4. SUBJECTS PREVIEW (STAGGER 0.12s) ---
      gsap.from(".subject-preview-item", {
        scrollTrigger: {
          trigger: ".subjects-preview-grid",
          start: "top 80%",
        },
        y: 35,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  // Interactive 3D tilt effect on active subject card with GSAP
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !activeSubjectCardRef.current ||
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const card = activeSubjectCardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(card, {
      rotateY: (x / rect.width) * 12,
      rotateX: (-y / rect.height) * 12,
      scale: 1.02,
      transformPerspective: 800,
      duration: 0.2,
      ease: "power1.out",
    });
  };

  const handleCardMouseLeave = () => {
    if (!activeSubjectCardRef.current) return;
    gsap.to(activeSubjectCardRef.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleNotifyMe = (subjectId: string) => {
    setNotifiedSubjects((prev) => ({ ...prev, [subjectId]: true }));
  };

  const getSubjectIcon = (iconName: string, active: boolean) => {
    const className = `w-7 h-7 ${active ? "text-primary" : "text-muted"}`;
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
        return <Compass className={className} />;
    }
  };

  return (
    <div ref={containerRef} className="w-full bg-background overflow-x-hidden">
      {/* Sticky Landing Navbar */}
      <LandingNavbar />

      {/* =====================================================
          1. HERO SECTION (UPGRADED WITH INTERACTIVE GRAPH)
          ===================================================== */}
      <section className="relative pt-6 pb-16 md:pt-14 md:pb-24 overflow-hidden bg-gradient-to-b from-indigo-50/70 via-background to-white">
        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Live Pill Badge */}
              <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-200/90 shadow-soft text-primary font-bold text-xs sm:text-sm mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Plateforme d&apos;apprentissage interactive</span>
                <span className="text-muted">•</span>
                <span className="text-accent font-extrabold">100% Démo</span>
              </div>

              {/* Headline */}
              <h1 className="hero-headline text-4xl sm:text-5xl md:text-6xl font-black text-text tracking-tight leading-[1.12] mb-6">
                Apprenez avec des cours clairs,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-600 to-accent">
                  des graphes visuels
                </span>{" "}
                et des quiz immédiats.
              </h1>

              {/* Subtitle */}
              <p className="hero-subtitle text-lg sm:text-xl text-muted font-normal leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                EduPlay combine résumés théoriques, schémas vectoriels, capsules vidéo et tests de connaissances pour une compréhension sans friction.
              </p>

              {/* Hero CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <Link
                  href={isAuthenticated ? "/subjects" : "/login"}
                  className="hero-cta-btn w-full sm:w-auto inline-flex items-center justify-center gap-3 py-4 px-8 rounded-2xl bg-primary hover:bg-indigo-700 text-white font-extrabold text-lg shadow-soft hover:shadow-card hover:-translate-y-1 active:translate-y-0 transition-all duration-200 group"
                >
                  <span>{isAuthenticated ? "Accéder aux cours" : "Start learning"}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <a
                  href="#mini-quiz"
                  className="hero-cta-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-7 rounded-2xl bg-white hover:bg-indigo-50/50 text-text font-bold text-lg border-2 border-slate-200 hover:border-primary shadow-sm hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
                >
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span>Tester le mini-quiz</span>
                </a>
              </div>

              {/* Student Trust Proof */}
              <div className="flex items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-600">
                <div className="flex -space-x-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">M</span>
                  <span className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</span>
                  <span className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">Y</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800">Compte démo inclus :</span>{" "}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded text-primary font-bold">student</code> / <code className="bg-slate-100 px-1.5 py-0.5 rounded text-primary font-bold">eduplay123</code>
                </div>
              </div>
            </div>

            {/* Right Interactive Graph Hero Component */}
            <div className="hero-graph-box lg:col-span-5 flex justify-center">
              <InteractiveGraphHero />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. MARQUEE / INFINITE FEATURE TICKER
          ===================================================== */}
      <div className="w-full bg-slate-900 py-4 text-white overflow-hidden border-y border-slate-800">
        <div className="flex whitespace-nowrap marquee-track text-sm sm:text-base font-bold tracking-wider text-indigo-200">
          {[...Array(2)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex items-center gap-8 px-4 flex-shrink-0">
              <span className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-accent" />
                <span>THÉORIE DES GRAPHES</span>
              </span>
              <span>✦</span>
              <span>FEEDBACK INSTANTANÉ</span>
              <span>✦</span>
              <span className="text-amber-400">QUIZ DE 5 QUESTIONS</span>
              <span>✦</span>
              <span>SCHÉMAS VECTORIELS</span>
              <span>✦</span>
              <span>VIDÉOS EXPLICATIVES</span>
              <span>✦</span>
              <span className="text-emerald-400">SCORE CHRONOMÉTRÉ</span>
              <span>✦</span>
              <span>ZÉRO BASE DE DONNÉES</span>
              <span>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          3. INTERACTIVE MINI-QUIZ SECTION
          ===================================================== */}
      <section id="mini-quiz" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-primary font-bold text-xs uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Aperçu interactif</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
              Testez notre format de quiz en direct
            </h2>
            <p className="mt-3 text-lg text-muted max-w-xl mx-auto">
              Cliquez sur une option ci-dessous pour déclencher la correction automatique et l&apos;animation de feedback.
            </p>
          </div>

          <MiniQuiz question={quizQuestion} />
        </div>
      </section>

      {/* =====================================================
          4. HOW IT WORKS (WITH LIVE STEP SWITCHER)
          ===================================================== */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-primary font-bold text-xs uppercase tracking-wider mb-3">
              <Layers className="w-4 h-4 text-primary" />
              <span>Méthodologie</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
              Comment fonctionne EduPlay ?
            </h2>
            <p className="mt-3 text-lg text-muted max-w-2xl mx-auto">
              Une démarche rythmée en 3 étapes interactives. Cliquez sur une étape pour en observer la simulation en direct.
            </p>
          </div>

          <InteractiveHowItWorks />
        </div>
      </section>

      {/* =====================================================
          5. STATS ROW (COUNT UP 1s DURATION)
          ===================================================== */}
      <section className="stats-container py-16 bg-gradient-to-r from-primary via-indigo-600 to-indigo-700 text-white relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-indigo-400/30">
            {/* Stat 1 */}
            <div className="pt-6 sm:pt-0 sm:px-6">
              <div className="stat-number text-5xl sm:text-6xl font-black tracking-tight text-white mb-2">
                {statSubjects}
              </div>
              <div className="text-xl font-bold text-indigo-100 mb-1">
                Matières
              </div>
              <p className="text-sm text-indigo-200">
                Un cursus multidisciplinaire complet
              </p>
            </div>

            {/* Stat 2 */}
            <div className="pt-6 sm:pt-0 sm:px-6">
              <div className="stat-number text-5xl sm:text-6xl font-black tracking-tight text-white mb-2">
                {statQuestions}
              </div>
              <div className="text-xl font-bold text-indigo-100 mb-1">
                Questions par quiz
              </div>
              <p className="text-sm text-indigo-200">
                Évaluation ciblée, rapide et efficace
              </p>
            </div>

            {/* Stat 3 */}
            <div className="pt-6 sm:pt-0 sm:px-6">
              <div className="stat-number text-5xl sm:text-6xl font-black tracking-tight text-white mb-2">
                {statMedia}
              </div>
              <div className="text-xl font-bold text-indigo-100 mb-1">
                Formats de médias
              </div>
              <p className="text-sm text-indigo-200">
                Texte synthétique, illustrations et vidéo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          6. SUBJECTS PREVIEW (WITH 3D TILT ON ACTIVE CARD)
          ===================================================== */}
      <section id="subjects-preview" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-primary font-bold text-xs uppercase tracking-wider mb-3">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Catalogue</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
              Aperçu des matières
            </h2>
            <p className="mt-3 text-lg text-muted max-w-2xl mx-auto">
              Accédez au chapitre actif de Mathématiques ou pré-enregistrez-vous pour les futures leçons.
            </p>
          </div>

          <div className="subjects-preview-grid grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjects.map((subject) => {
              if (subject.active) {
                return (
                  <div
                    key={subject.id}
                    ref={activeSubjectCardRef}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    className="subject-preview-item group bg-white rounded-3xl p-8 border-2 border-indigo-200 hover:border-primary shadow-soft hover:shadow-card transition-shadow duration-300 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Corner accent glow */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-xl pointer-events-none" />

                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {getSubjectIcon(subject.icon, true)}
                        </div>
                        <span className="px-3.5 py-1.5 rounded-full text-sm font-bold bg-green-50 text-success border border-green-200 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                          <span>Disponible</span>
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-text group-hover:text-primary transition-colors">
                        {subject.name}
                      </h3>
                      <p className="mt-3 text-muted text-base leading-relaxed">
                        {subject.description}
                      </p>

                      {/* Topic Tags */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                          Graphes orientés & non orientés
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                          Degrés entrant/sortant
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                          Matrice d&apos;adjacence
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Clock className="w-4 h-4 text-accent" />
                        <span>~15 min de révision</span>
                      </div>
                      <Link
                        href={`/subjects/${subject.id}`}
                        className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary hover:bg-indigo-700 text-white font-bold text-base shadow-soft hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                      >
                        <span>Accéder au cours</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              }

              // Locked subject card
              const isNotified = notifiedSubjects[subject.id];

              return (
                <div
                  key={subject.id}
                  className="subject-preview-item bg-white/70 rounded-3xl p-8 border-2 border-slate-200/70 opacity-80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                        {getSubjectIcon(subject.icon, false)}
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-slate-100 text-muted">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Coming soon</span>
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-700">
                      {subject.name}
                    </h3>
                    <p className="mt-3 text-slate-500 text-base leading-relaxed">
                      {subject.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Module en cours de préparation
                    </span>
                    <button
                      onClick={() => handleNotifyMe(subject.id)}
                      disabled={isNotified}
                      className={`inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                        isNotified
                          ? "bg-green-50 text-success border border-green-200"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {isNotified ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Noté !</span>
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
        </div>
      </section>

      {/* =====================================================
          7. INTERACTIVE FAQ ACCORDION
          ===================================================== */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-primary font-bold text-xs uppercase tracking-wider mb-3">
              <HelpCircle className="w-4 h-4 text-accent" />
              <span>Questions fréquentes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
              Tout ce que vous devez savoir
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 bg-slate-50/50"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-lg text-text hover:text-primary transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-muted transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-600 text-base leading-relaxed border-t border-slate-200/50">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          8. FOOTER
          ===================================================== */}
      <footer className="bg-slate-900 text-slate-300 py-14 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative rounded-xl overflow-hidden bg-indigo-900 border border-indigo-700 flex items-center justify-center shadow-sm">
                <Image
                  src="/logo.svg"
                  alt="EduPlay"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                EduPlay
              </span>
            </div>

            {/* Navigation links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-slate-400">
              <a href="#how-it-works" className="hover:text-white transition-colors">
                Comment ça marche
              </a>
              <a href="#mini-quiz" className="hover:text-white transition-colors">
                Mini-Quiz
              </a>
              <a href="#subjects-preview" className="hover:text-white transition-colors">
                Matières
              </a>
              <Link href="/login" className="hover:text-white transition-colors">
                Connexion
              </Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">
            <p>
              © 2026 <strong className="text-white">EduPlay Team</strong>. Tous droits réservés.
            </p>
            <p className="text-center sm:text-right bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700 text-slate-300">
              Note : Ce projet est un <strong className="text-indigo-400">prototype de validation pédagogique</strong>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
