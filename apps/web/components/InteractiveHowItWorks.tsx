"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Compass,
  Layers,
  Award,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function InteractiveHowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const previewRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !previewRef.current ||
        typeof window === "undefined" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      gsap.fromTo(
        previewRef.current,
        { opacity: 0, y: 15, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    },
    { dependencies: [activeStep] }
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Step Buttons Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Step 1 */}
          <div
            onClick={() => setActiveStep(1)}
            className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
              activeStep === 1
                ? "bg-white border-primary shadow-card ring-4 ring-indigo-50"
                : "bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors shadow-soft ${
                  activeStep === 1
                    ? "bg-primary text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-text">
                    Choisissez votre matière
                  </h3>
                  {activeStep === 1 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-primary border border-indigo-200">
                      Étape active
                    </span>
                  )}
                </div>
                <p className="mt-2 text-muted text-sm sm:text-base leading-relaxed">
                  Explorez le catalogue multidisciplinaire et lancez le chapitre souhaité d&apos;un simple clic.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => setActiveStep(2)}
            className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
              activeStep === 2
                ? "bg-white border-primary shadow-card ring-4 ring-indigo-50"
                : "bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors shadow-soft ${
                  activeStep === 2
                    ? "bg-primary text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-text">
                    Observez & Visualisez
                  </h3>
                  {activeStep === 2 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-primary border border-indigo-200">
                      Étape active
                    </span>
                  )}
                </div>
                <p className="mt-2 text-muted text-sm sm:text-base leading-relaxed">
                  Lisez la synthèse théorique, inspectez les schémas graphiques et regardez la vidéo explicative dédiée.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => setActiveStep(3)}
            className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
              activeStep === 3
                ? "bg-white border-primary shadow-card ring-4 ring-indigo-50"
                : "bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors shadow-soft ${
                  activeStep === 3
                    ? "bg-primary text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-text">
                    Validez avec les quiz
                  </h3>
                  {activeStep === 3 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-primary border border-indigo-200">
                      Étape active
                    </span>
                  )}
                </div>
                <p className="mt-2 text-muted text-sm sm:text-base leading-relaxed">
                  Répondez aux 5 questions dynamiques, visualisez vos erreurs et boostez votre score de réussite.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Preview Box (Right Column) */}
        <div className="lg:col-span-6">
          <div
            ref={previewRef}
            className="w-full bg-gradient-to-br from-indigo-900 via-primary to-indigo-950 p-7 sm:p-9 rounded-3xl shadow-card text-white relative overflow-hidden min-h-[380px] flex flex-col justify-between"
          >
            {/* Glow backdrop */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

            {/* Step 1 Preview Content */}
            {activeStep === 1 && (
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    Aperçu • Matières
                  </span>
                  <Compass className="w-5 h-5 text-accent animate-spin" style={{ animationDuration: "12s" }} />
                </div>
                <div>
                  <h4 className="text-2xl font-black mb-2">Catalogue Multidisciplinaire</h4>
                  <p className="text-indigo-200 text-sm">
                    Sélectionnez votre leçon parmi nos modules interactifs.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-xs">∑</span>
                    <div>
                      <div className="font-bold text-sm">Mathématiques</div>
                      <div className="text-[11px] text-green-300 font-semibold">● Disponible</div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 opacity-60 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold text-xs">&lt;/&gt;</span>
                    <div>
                      <div className="font-bold text-sm">Informatique</div>
                      <div className="text-[11px] text-slate-300">Bientôt</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 Preview Content */}
            {activeStep === 2 && (
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    Aperçu • Multimédia
                  </span>
                  <PlayCircle className="w-5 h-5 text-accent animate-pulse" />
                </div>
                <div>
                  <h4 className="text-2xl font-black mb-2">Supports visuels & Vidéos</h4>
                  <p className="text-indigo-200 text-sm">
                    Schémas annotés et capsules vidéo sélectionnées pour chaque leçon.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent text-slate-900 flex items-center justify-center font-bold shadow-soft flex-shrink-0">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Vidéo du cours</div>
                    <div className="text-xs text-indigo-200">Graphes orientés et matrices d&apos;adjacence</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 Preview Content */}
            {activeStep === 3 && (
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    Aperçu • Score & Quiz
                  </span>
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-2xl font-black mb-2">Validation des acquis</h4>
                  <p className="text-indigo-200 text-sm">
                    Analyse immédiate de vos réponses et mesure du taux de réussite.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-between">
                  <div>
                    <div className="text-xs text-indigo-200 font-semibold uppercase">Score obtenu</div>
                    <div className="text-3xl font-black text-green-300">5 / 5 (100%)</div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 text-green-300 border border-green-400/30 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sans-faute</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom step switcher pill */}
            <div className="pt-6 border-t border-white/15 flex items-center justify-between text-xs text-indigo-200">
              <span>Étape {activeStep} sur 3</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveStep(s)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeStep === s ? "bg-accent scale-125" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

