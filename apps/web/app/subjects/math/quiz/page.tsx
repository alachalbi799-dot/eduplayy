import { notFound } from "next/navigation";
import { getQuizData } from "@/lib/content";
import QuizRunner from "@/components/QuizRunner";

export default function MathQuizPage() {
  const quiz = getQuizData("math");

  if (!quiz || quiz.questions.length === 0) {
    notFound();
  }

  return <QuizRunner quiz={quiz} />;
}

