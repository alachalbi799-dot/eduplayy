"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  BookOpen,
  HelpCircle,
} from "lucide-react";

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1` : null;
}
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { CourseData } from "@/lib/content";

gsap.registerPlugin(useGSAP);

interface CourseViewerProps {
  course: CourseData;
}

export default function CourseViewer({ course }: CourseViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // Heading and paragraphs fade up one after another (stagger 0.08s, duration < 0.6s)
      gsap.from(
        [
          ".course-header",
          ".course-media",
          ".course-video-box",
          ".course-paragraph-item",
          ".course-footer-cta",
        ],
        {
          y: 20,
          opacity: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full"
    >
      {/* Navigation Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/subjects"
          className="inline-flex items-center gap-2 text-base font-semibold text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux matières</span>
        </Link>
      </div>

      {/* Main Course Card */}
      <article className="course-container bg-white rounded-2xl shadow-card border border-slate-100 p-6 sm:p-10 mb-10">
        {/* Header Badge & Title */}
        <div className="course-header mb-8 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-primary font-bold text-sm mb-3">
            <BookOpen className="w-4 h-4" />
            <span>Mathématiques • Théorie des Graphes</span>
          </div>
          <h1 className="course-heading text-3xl sm:text-4xl font-black text-text tracking-tight leading-tight">
            {course.heading}
          </h1>
        </div>

        {/* Course Media (Image) */}
        {course.image && (
          <figure className="course-media my-8 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-soft">
            <div className="relative w-full max-h-[480px] overflow-hidden rounded-xl flex items-center justify-center bg-white p-2">
              <img
                src={course.image.url}
                alt={course.image.caption}
                className="max-h-[420px] w-auto max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
            <figcaption className="mt-3.5 text-center text-sm sm:text-base font-bold text-slate-700">
              Illustration : {course.image.caption}
            </figcaption>
          </figure>
        )}

        {/* Video Resource Section */}
        <div className="course-video-box my-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-soft flex-shrink-0">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-text text-lg leading-tight">
                Vidéo explicative du cours
              </h3>
              <p className="text-sm text-muted">
                Visionnez le cours complet en vidéo pour renforcer votre compréhension.
              </p>
            </div>
          </div>

          {course.video.isAvailable && course.video.url && getYouTubeEmbedUrl(course.video.url) ? (
            <div className="relative w-full rounded-2xl overflow-hidden border border-indigo-100 shadow-soft bg-black"
              style={{ aspectRatio: "16/9" }}>
              <iframe
                src={getYouTubeEmbedUrl(course.video.url)!}
                title="Vidéo explicative du cours"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 p-5 rounded-2xl bg-slate-100 border border-slate-200 text-muted font-semibold">
              <PlayCircle className="w-5 h-5 opacity-50" />
              <span>Vidéo coming soon</span>
            </div>
          )}
        </div>

        {/* Course Paragraphs Content */}
        <div className="course-paragraphs space-y-6 mt-8">
          {course.paragraphs.map((paragraph, index) => {
            const isSubheading = paragraph.startsWith("## ");
            if (isSubheading) {
              const cleanSubheading = paragraph.replace(/^##\s*/, "").trim();
              return (
                <h2
                  key={index}
                  className="course-paragraph-item text-2xl font-bold text-text pt-6 pb-2 border-b border-slate-100"
                >
                  {cleanSubheading}
                </h2>
              );
            }

            return (
              <p
                key={index}
                className="course-paragraph-item text-base sm:text-lg text-slate-700 leading-relaxed whitespace-pre-line"
              >
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Bottom Call to Action for Quiz */}
        <div className="course-footer-cta mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-muted">
            <HelpCircle className="w-5 h-5 text-accent flex-shrink-0" />
            <span className="text-base font-medium">
              Prêt à tester ce que vous avez retenu de ce chapitre ?
            </span>
          </div>

          <Link
            href="/subjects/math/quiz"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 py-4 px-8 rounded-xl bg-accent hover:bg-amber-600 text-white font-extrabold text-lg sm:text-xl shadow-soft hover:shadow-lg transition-all duration-200 active:scale-95 flex-shrink-0"
          >
            <span>Start quiz</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </article>
    </div>
  );
}

