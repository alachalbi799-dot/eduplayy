import { getQuizData, SUBJECTS } from "@/lib/content";
import LandingClientView from "@/components/LandingClientView";

export default function HomePage() {
  const mathQuiz = getQuizData("math");

  // Fallback question if none found
  const firstQuestion = mathQuiz?.questions[0] || {
    question: "Un graphe est composé de quels éléments ?",
    options: [
      "Des sommets et des arêtes",
      "Des nombres et des lettres",
      "Des lignes et des couleurs",
      "Des matrices uniquement",
    ],
    answerIndex: 0,
  };

  return (
    <LandingClientView
      quizQuestion={firstQuestion}
      subjects={SUBJECTS}
    />
  );
}
