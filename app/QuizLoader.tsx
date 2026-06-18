"use client";

import { useState, useEffect } from "react";
import AnimeQuiz from "./services/AnimeQuiz";

export default function QuizLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-purple-600 text-sm animate-pulse">🔄 Loading quiz...</p>
        </div>
      </div>
    );
  }

  return <AnimeQuiz />;
}
