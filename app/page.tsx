import ErrorBoundary from "@/components/ErrorBoundary";
import AnimeQuiz from "./services/AnimeQuiz";

export default function Home() {
  return (
    <ErrorBoundary>
      <AnimeQuiz />
    </ErrorBoundary>
  );
}
