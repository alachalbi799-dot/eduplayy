"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  HelpCircle,
} from "lucide-react";
import gsap from "gsap";
import type { NormalizedQuestion } from "@/lib/content";

interface MiniQuizProps {
  question: NormalizedQuestion;
}

export default function MiniQuiz({ question }: MiniQuizProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const confettiContainerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // GSAP Confetti Burst Animation
  const triggerConfettiBurst = () => {
    if (
      !confettiContainerRef.current ||
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const container = confettiContainerRef.current;
    container.innerHTML = ""; // clear previous

    const colors = ["#4F46E5", "#F59E0B", "#10B981", "#EC4899", "#8B5CF6", "#3B82F6"];
    const particleCount = 36;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.floor(Math.random() * 8) + 6;

      particle.style.position = "absolute";
      particle.style.left = "50%";
      particle.style.top = "50%";
      particle.style.width = `${size}px`;
      particle.style.height = `${size * (Math.random() > 0.5 ? 1 : 1.6)}px`;
      particle.style.backgroundColor = color;
      particle.style.borderRadius = Math.random() > 0.6 ? "50%" : "2px";
      particle.style.pointerEvents = "none";
      particle.style.zIndex = "50";

      container.appendChild(particle);

      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const distance = Math.random() * 160 + 80;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance;

      gsap.fromTo(
        particle,
        { x: 0, y: 0, scale: 0, rotation: 0, opacity: 1 },
        {
          x: destX,
          y: destY + 40, // slight gravity effect
          scale: Math.random() * 0.8 + 0.6,
          rotation: Math.random() * 720 - 360,
          opacity: 0,
          duration: Math.random() * 0.5 + 0.7,
          ease: "power2.out",
          onComplete: () => particle.remove(),
        }
      );
    }
  };

  const handleSelect = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === question.answerIndex;
    const btn = optionRefs.current[index];

    if (typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (isCorrect) {
        // Option pulse + confetti explosion!
        if (btn) {
          gsap.fromTo(
            btn,
            { scale: 1 },
            {
              scale: 1.04,
              duration: 0.25,
              yoyo: true,
              repeat: 1,
              ease: "back.out(2)",
            }
          );
        }
        triggerConfettiBurst();
      } else {
        // Shake animation for incorrect answer
        if (btn) {
          gsap.fromTo(
            btn,
            { x: 0 },
            {
              x: 8,
              duration: 0.08,
              repeat: 5,
              yoyo: true,
              ease: "power1.inOut",
              onComplete: () => gsap.set(btn, { x: 0 }),
            }
          );
        }
      }
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (
      containerRef.current &&
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.98, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" }
      );
    }
  };

  const isCorrect = selectedOption === question.answerIndex;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-9 shadow-card border-2 border-indigo-100 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Confetti Spawn Container */}
      <div
        ref={confettiContainerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl"
      />

      {/* Card Top Pill & Reset Button */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-amber-50 border border-indigo-200 text-primary font-bold text-xs sm:text-sm shadow-sm">
          <Sparkles className="w-4 h-4 text-accent animate-spin" style={{ animationDuration: "6s" }} />
          <span>Mini-Quiz Interactif Démo</span>
        </div>

        {isAnswered && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors hover:-translate-y-0.5"
            title="Rejouer ce quiz"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Rejouer</span>
          </button>
        )}
      </div>

      {/* Question */}
      <h3 className="text-xl sm:text-2xl font-black text-text mb-6 leading-snug">
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-3.5 mb-6">
        {question.options.map((option, index) => {
          let styleClasses =
            "bg-slate-50 border-2 border-slate-200 text-text hover:border-primary hover:bg-indigo-50/50 hover:shadow-soft";
          let badgeIcon = null;

          if (isAnswered) {
            if (index === question.answerIndex) {
              styleClasses =
                "bg-green-50 border-2 border-success text-green-900 font-bold shadow-soft scale-[1.01]";
              badgeIcon = (
                <div className="flex items-center gap-1 text-success font-bold text-sm">
                  <span>Correct</span>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                </div>
              );
            } else if (index === selectedOption) {
              styleClasses =
                "bg-red-50 border-2 border-danger text-red-900 font-bold shadow-soft";
              badgeIcon = (
                <div className="flex items-center gap-1 text-danger font-bold text-sm">
                  <span>Faux</span>
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                </div>
              );
            } else {
              styleClasses =
                "bg-slate-50/80 border-2 border-slate-200 text-slate-400 opacity-50";
            }
          }

          return (
            <button
              key={index}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              onClick={() => handleSelect(index)}
              disabled={isAnswered}
              className={`w-full text-left p-4 sm:p-4.5 rounded-2xl text-base sm:text-lg font-medium transition-all duration-200 flex items-center justify-between gap-4 ${styleClasses} ${
                isAnswered ? "cursor-default" : "cursor-pointer hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    isAnswered && index === question.answerIndex
                      ? "bg-success text-white"
                      : isAnswered && index === selectedOption
                      ? "bg-danger text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
              {badgeIcon}
            </button>
          );
        })}
      </div>

      {/* Feedback banner once answered */}
      {isAnswered && (
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 ${
            isCorrect
              ? "bg-green-50/90 border-green-200 text-green-950"
              : "bg-amber-50/90 border-amber-200 text-amber-950"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 font-black text-lg">
              {isCorrect ? (
                <>
                  <Award className="w-5 h-5 text-success" />
                  <span>Bravo, réponse exacte !</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                  <span>Pas tout à fait !</span>
                </>
              )}
            </div>
            <p className="text-sm mt-1 leading-relaxed opacity-90">
              {isCorrect
                ? "Un graphe G = (V, E) est composé d'un ensemble de sommets V reliés par des arêtes E."
                : `La bonne réponse était l'option ${String.fromCharCode(
                    65 + question.answerIndex
                  )} (${question.options[question.answerIndex]}).`}
            </p>
          </div>

          <Link
            href="/subjects/math"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-primary hover:bg-indigo-700 text-white font-bold text-sm shadow-soft hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap"
          >
            <span>Voir le cours complet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
