import { notFound } from "next/navigation";
import { getCourseData } from "@/lib/content";
import CourseViewer from "@/components/CourseViewer";

export default function MathCoursePage() {
  const course = getCourseData("math");

  if (!course) {
    notFound();
  }

  return <CourseViewer course={course} />;
}
