"use client";

import dynamic from "next/dynamic";

const AnimeQuiz = dynamic(() => import("./services/AnimeQuiz"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="loading-spinner w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-purple-600 text-sm">Loading quiz...</p>
      </div>
    </div>
  ),
});

export default function QuizLoader() {
  return <AnimeQuiz />;
}
