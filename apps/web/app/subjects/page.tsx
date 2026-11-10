import { SUBJECTS } from "@/lib/content";
import SubjectsList from "@/components/SubjectsList";

export default function SubjectsPage() {
  return <SubjectsList subjects={SUBJECTS} />;
}
