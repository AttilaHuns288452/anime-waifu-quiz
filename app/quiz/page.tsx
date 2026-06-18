import ErrorBoundary from "@/components/ErrorBoundary";
import AnimeQuiz from "@/app/services/AnimeQuiz";

export default function QuizPage() {
  return (
    <ErrorBoundary>
      <AnimeQuiz />
    </ErrorBoundary>
  );
}
