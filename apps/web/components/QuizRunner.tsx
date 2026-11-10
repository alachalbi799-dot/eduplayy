"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { NormalizedQuiz } from "@/lib/content";

gsap.registerPlugin(useGSAP);

interface QuizRunnerProps {
  quiz: NormalizedQuiz;
}

export default function QuizRunner({ quiz }: QuizRunnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const questionCardRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [displayedScore, setDisplayedScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = quiz.questions;
  const total = questions.length;
  const currentQuestion = questions[currentIndex];

  // GSAP: Animate question sliding in from the right on index change
  useGSAP(
    () => {
      if (isCompleted || !questionCardRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        questionCardRef.current,
        { x: 45, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
      );
    },
    { dependencies: [currentIndex, isCompleted], scope: containerRef }
  );

  // GSAP: Progress bar width animates between steps
  useGSAP(
    () => {
      if (isCompleted || !progressBarRef.current) return;
      const targetWidth = `${((currentIndex + 1) / total) * 100}%`;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(progressBarRef.current, { width: targetWidth });
        return;
      }

      gsap.to(progressBarRef.current, {
        width: targetWidth,
        duration: 0.4,
        ease: "power2.out",
      });
    },
    { dependencies: [currentIndex, total, isCompleted], scope: containerRef }
  );

  // GSAP: Result score counts up from 0 to final value (duration 1s)
  useGSAP(
    () => {
      if (!isCompleted) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplayedScore(score);
        return;
      }

      setDisplayedScore(0);
      const counterObj = { val: 0 };
      gsap.to(counterObj, {
        val: score,
        duration: 1.0,
        ease: "power2.out",
        onUpdate: () => {
          setDisplayedScore(Math.round(counterObj.val));
        },
      });

      // Subtle scale-in for result card
      gsap.from(".result-card", {
        scale: 0.95,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.2)",
      });
    },
    { dependencies: [isCompleted, score], scope: containerRef }
  );

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted || isCompleted) return;

    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentQuestion.answerIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // GSAP: Answer feedback - chosen option pulses once (scale 1.03 and back, duration < 0.6s)
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const selectedBtn = optionRefs.current[index];
      if (selectedBtn) {
        gsap.fromTo(
          selectedBtn,
          { scale: 1 },
          {
            scale: 1.03,
            duration: 0.22,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          }
        );
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setDisplayedScore(0);
    setIsCompleted(false);
  };

  // RESULT SCREEN
  if (isCompleted) {
    const percentage = Math.round((score / total) * 100);
    let message = "Bien joué ! Continuez vos efforts pour viser le sans-faute !";
    if (percentage === 100) {
      message = "Score parfait ! Vous maîtrisez parfaitement les graphes orientés et non orientés !";
    } else if (percentage >= 70) {
      message = "Très bon score ! Vous avez assimilé la majorité des concepts de ce cours.";
    }

    return (
      <div
        ref={containerRef}
        className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full"
      >
        <div className="result-card bg-white rounded-2xl shadow-card border border-slate-100 p-8 sm:p-12 text-center">
          {/* Badge Icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-green-50 border-2 border-green-200 flex items-center justify-center shadow-soft">
            <Award className="w-12 h-12 text-success" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-primary font-bold text-sm mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Quiz terminé</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-text tracking-tight mb-2">
            Résultats du Quiz
          </h1>

          <p className="text-muted text-base mb-8">{quiz.topic}</p>

          {/* Score Display with animated count-up */}
          <div className="my-8 p-8 rounded-2xl bg-gradient-to-b from-green-50/80 to-emerald-50/40 border-2 border-green-200">
            <div className="text-base sm:text-lg font-bold text-emerald-800 uppercase tracking-wider mb-1">
              Your score
            </div>
            <div className="result-score text-5xl sm:text-6xl font-black text-success tracking-tight">
              {displayedScore} / {total}
            </div>
            <div className="text-sm font-semibold text-emerald-700 mt-2">
              Taux de réussite : {percentage}%
            </div>
          </div>

          <p className="text-lg text-slate-700 font-medium mb-10 max-w-md mx-auto leading-relaxed">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleRetry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-primary hover:bg-indigo-700 text-white font-bold text-base shadow-soft transition-all duration-200 active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Retry quiz</span>
            </button>

            <Link
              href="/subjects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-text font-bold text-base border border-slate-200 transition-all duration-200"
            >
              <BookOpen className="w-5 h-5 text-muted" />
              <span>Back to subjects</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // QUESTION SCREEN
  const initialProgressPercent = ((currentIndex + 1) / total) * 100;

  return (
    <div
      ref={containerRef}
      className="py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full"
    >
      {/* Top Bar with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-base font-bold text-muted mb-3">
          <span className="quiz-progress-text text-primary">
            Question {currentIndex + 1} of {total}
          </span>
          <span className="text-slate-500 font-semibold">{quiz.topic}</span>
        </div>
        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="quiz-progress-bar bg-primary h-full rounded-full"
            style={{ width: `${initialProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        ref={questionCardRef}
        className="quiz-card bg-white rounded-2xl shadow-card border border-slate-100 p-6 sm:p-10 mb-8"
      >
        <h2 className="quiz-question text-2xl sm:text-3xl font-extrabold text-text mb-8 leading-snug">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="quiz-options space-y-4">
          {currentQuestion.options.map((option, index) => {
            let optionStyles =
              "bg-white border-2 border-slate-200 hover:border-primary hover:bg-indigo-50/40 text-text";
            let icon = null;

            if (isAnswerSubmitted) {
              const isCorrect = index === currentQuestion.answerIndex;
              const isSelected = index === selectedOption;

              if (isCorrect) {
                optionStyles =
                  "bg-green-50 border-2 border-success text-green-900 font-bold shadow-soft";
                icon = (
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                );
              } else if (isSelected) {
                optionStyles =
                  "bg-red-50 border-2 border-danger text-red-900 font-bold shadow-soft";
                icon = <XCircle className="w-6 h-6 text-danger flex-shrink-0" />;
              } else {
                optionStyles =
                  "bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={index}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                onClick={() => handleSelectOption(index)}
                disabled={isAnswerSubmitted}
                className={`quiz-option-btn w-full text-left p-5 rounded-2xl text-lg font-medium transition-colors duration-200 flex items-center justify-between gap-4 ${optionStyles} ${
                  isAnswerSubmitted ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 ${
                      isAnswerSubmitted && index === currentQuestion.answerIndex
                        ? "bg-success text-white"
                        : isAnswerSubmitted && index === selectedOption
                        ? "bg-danger text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="leading-relaxed">{option}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Feedback & Next Button */}
        {isAnswerSubmitted && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-base font-semibold">
              {selectedOption === currentQuestion.answerIndex ? (
                <span className="text-success flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Bonne réponse !
                </span>
              ) : (
                <span className="text-danger flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Incorrect. La bonne réponse était l&apos;option{" "}
                  {String.fromCharCode(65 + currentQuestion.answerIndex)}.
                </span>
              )}
            </div>

            <button
              onClick={handleNext}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-7 rounded-xl bg-primary hover:bg-indigo-700 text-white font-bold text-base shadow-soft transition-all duration-200 active:scale-95"
            >
              <span>
                {currentIndex < total - 1 ? "Next" : "Voir le score"}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
