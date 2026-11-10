import fs from "fs";
import path from "path";

/**
 * Resolves the monorepo root by walking up from process.cwd()
 * until finding README.md and courses/ folder.
 */
export function getMonorepoRoot(): string {
  let currentDir = process.cwd();
  while (true) {
    const hasReadme = fs.existsSync(path.join(currentDir, "README.md"));
    const hasCourses = fs.existsSync(path.join(currentDir, "courses"));
    if (hasReadme && hasCourses) {
      return currentDir;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      // Reached filesystem root, fallback to process.cwd()
      return process.cwd();
    }
    currentDir = parentDir;
  }
}

export interface SubjectItem {
  id: string;
  name: string;
  description: string;
  active: boolean;
  badge?: string;
  icon: string;
  chapterTitle?: string;
  topics?: string[];
  estimatedTime?: string;
}

export const SUBJECTS: SubjectItem[] = [
  {
    id: "math",
    name: "Math",
    description: "Théorie des graphes : découvrez les graphes orientés, non orientés et leurs applications.",
    active: true,
    icon: "Calculator",
    chapterTitle: "Chapitre 1 : Graphes orientés et non orientés",
    topics: ["Sommets & Arêtes", "Degrés entrant / sortant", "Matrice d'adjacence", "Applications"],
    estimatedTime: "~15 min",
  },
  {
    id: "english",
    name: "English",
    description: "Study skills, reading strategies, and academic vocabulary for success.",
    active: false,
    badge: "Coming soon",
    icon: "BookOpen",
    chapterTitle: "Chapter 1 : Essential Study Skills",
    topics: ["SMART Goals", "Time Management", "Active Reading"],
    estimatedTime: "En cours d'intégration",
  },
  {
    id: "informatique",
    name: "Informatique",
    description: "Fondements de l'informatique, systèmes et algorithmique de base.",
    active: false,
    badge: "Coming soon",
    icon: "Code",
    chapterTitle: "Chapitre 1 : Introduction à l'informatique",
    topics: ["Architecture & Matériel", "Systèmes & Fichiers", "Algorithmique"],
    estimatedTime: "En cours d'intégration",
  },
  {
    id: "multimedia",
    name: "Multimedia",
    description: "Traitement de l'image, vidéo numérique et conception interactive.",
    active: false,
    badge: "Coming soon",
    icon: "Film",
    chapterTitle: "Chapitre 1 : Domaine du Multimédia",
    topics: ["Image vectorielle / matricielle", "Compression", "Numérisation"],
    estimatedTime: "En cours d'intégration",
  },
];

export interface CourseData {
  subjectId: string;
  heading: string;
  paragraphs: string[];
  image: {
    url: string;
    caption: string;
  } | null;
  video: {
    url: string | null;
    isAvailable: boolean;
  };
}

/**
 * Maps image filename base to a clean human-readable caption
 */
function getCaptionFromFileName(fileName: string): string {
  const base = path.basename(fileName, path.extname(fileName));
  const captionMap: Record<string, string> = {
    graphes_orientes: "Graphes orientés",
    study_skills: "Study Skills Overview",
    domaine_multimedia: "Domaines du Multimédia",
    types_de_medias: "Types de Médias",
  };
  if (captionMap[base]) return captionMap[base];
  return base
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Loads course text, image, and video info from the monorepo root folders
 */
export function getCourseData(subjectId: string): CourseData | null {
  const root = getMonorepoRoot();
  const coursesDir = path.join(root, "courses", subjectId);
  if (!fs.existsSync(coursesDir)) {
    return null;
  }

  // Find course text file (.txt)
  const courseFiles = fs.readdirSync(coursesDir).filter((f) => f.endsWith(".txt"));
  if (courseFiles.length === 0) return null;

  const courseFilePath = path.join(coursesDir, courseFiles[0]);
  const rawContent = fs.readFileSync(courseFilePath, "utf-8");

  // Split lines into heading (first line) and paragraphs (split on blank lines)
  const lines = rawContent.split(/\r?\n/);
  const rawFirstLine = lines[0] || "Cours";
  // Remove markdown '#' prefix if present for clean title
  const heading = rawFirstLine.replace(/^#+\s*/, "").trim();

  // Remaining content starts after line 1
  const remainingText = lines.slice(1).join("\n").trim();
  // Split on blank lines
  const paragraphs = remainingText
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Check for image
  let imageInfo: CourseData["image"] = null;
  const imagesDir = path.join(root, "media", subjectId, "images");
  if (fs.existsSync(imagesDir)) {
    const images = fs
      .readdirSync(imagesDir)
      .filter((f) => /\.(png|jpe?g|svg|webp)$/i.test(f));
    if (images.length > 0) {
      const imgFile = images[0];
      imageInfo = {
        url: `/media/${subjectId}/images/${imgFile}`,
        caption: getCaptionFromFileName(imgFile),
      };
    }
  }

  // Check for video link
  let videoInfo: CourseData["video"] = { url: null, isAvailable: false };
  const mediaDir = path.join(root, "media", subjectId);
  if (fs.existsSync(mediaDir)) {
    const videoFiles = fs
      .readdirSync(mediaDir)
      .filter((f) => f.includes("video_link") && f.endsWith(".txt"));
    if (videoFiles.length > 0) {
      const videoPath = path.join(mediaDir, videoFiles[0]);
      const linkContent = fs.readFileSync(videoPath, "utf-8").trim();
      if (linkContent && linkContent.startsWith("http")) {
        videoInfo = {
          url: linkContent,
          isAvailable: true,
        };
      }
    }
  }

  return {
    subjectId,
    heading,
    paragraphs,
    image: imageInfo,
    video: videoInfo,
  };
}

export interface NormalizedQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

export interface NormalizedQuiz {
  subject: string;
  topic: string;
  questions: NormalizedQuestion[];
}

/**
 * Adapter function that takes raw JSON quiz data and normalizes it into:
 * { question: string, options: string[], answerIndex: number }[]
 */
export function normalizeQuizData(raw: any): NormalizedQuiz {
  const rawQuestions = Array.isArray(raw?.questions) ? raw.questions : [];
  const questions: NormalizedQuestion[] = rawQuestions.map((item: any) => {
    const questionText = String(item?.question || item?.title || "");
    const options: string[] = Array.isArray(item?.options)
      ? item.options.map((opt: any) => String(opt).trim())
      : [];
    // answer can be 0-based index or string match
    let answerIndex = 0;
    if (typeof item?.answer === "number") {
      answerIndex = item.answer;
    } else if (typeof item?.answerIndex === "number") {
      answerIndex = item.answerIndex;
    } else if (typeof item?.correctIndex === "number") {
      answerIndex = item.correctIndex;
    } else if (typeof item?.answer === "string") {
      const foundIdx = options.findIndex(
        (o: string) => o.toLowerCase() === String(item.answer).toLowerCase()
      );
      if (foundIdx >= 0) answerIndex = foundIdx;
    }

    return {
      question: questionText,
      options,
      answerIndex,
    };
  });

  return {
    subject: raw?.subject || "Math",
    topic: raw?.topic || raw?.title || "Quiz",
    questions,
  };
}

/**
 * Loads quiz data for a subject and returns normalized quiz
 */
export function getQuizData(subjectId: string): NormalizedQuiz | null {
  const root = getMonorepoRoot();
  const quizDir = path.join(root, "quizzes", subjectId);
  if (!fs.existsSync(quizDir)) return null;

  const quizFiles = fs.readdirSync(quizDir).filter((f) => f.endsWith(".json"));
  if (quizFiles.length === 0) return null;

  const quizFilePath = path.join(quizDir, quizFiles[0]);
  const rawJson = JSON.parse(fs.readFileSync(quizFilePath, "utf-8"));
  return normalizeQuizData(rawJson);
}
