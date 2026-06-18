"use client";

import { useState, useEffect } from "react";
import { getAnimeByPersonality } from "@/lib/anime";
import { getCharactersByGender } from "@/lib/characters";
import { QuizAnswer, findMatches } from "@/lib/matching";
import { QUESTIONS } from "@/lib/questions";

export default function AnimeRecommendations() {
  const [topAnime, setTopAnime] = useState<{ anime: any; score: number }[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hasQuizData, setHasQuizData] = useState(false);

  useEffect(() => {
    // Try to get saved personality profile from quiz results
    let profile = null;
    try {
      const saved = localStorage.getItem("anime-personality-profile");
      if (saved) {
        profile = JSON.parse(saved);
        setHasQuizData(true);
      }
    } catch(e) {}

    // If no saved profile, use demo answers to show something
    if (!profile) {
      const demoAnswers: QuizAnswer[] = QUESTIONS.map(q => ({
        questionId: q.id,
        answerIndex: 0,
      }));
      const result = findMatches(demoAnswers, "both");
      profile = result.profile;
    }

    const recs = getAnimeByPersonality(profile);
    setTopAnime(recs);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        🎬 Anime Recommendations
      </h1>
      {hasQuizData ? (
        <p className="text-green-600 text-sm mb-1">✅ Based on your quiz results! Take the quiz again for updated recommendations.</p>
      ) : (
        <p className="text-amber-600 text-sm mb-1">⚠️ Take the <a href="/" className="underline font-medium">personality quiz</a> first for personalized results!</p>
      )}
      <p className="text-gray-500 mb-6">
        Top 20 anime matched to your personality profile — click any card to expand and watch links.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {topAnime.slice(0, 20).map(({ anime, score }) => (
          <div
            key={anime.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setExpanded(expanded === anime.id ? null : anime.id)}
          >
            <div className={`p-5 ${expanded === anime.id ? "pb-3" : ""}`}>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0 text-2xl border border-gray-200 overflow-hidden">
                  🎬
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-base leading-tight">{anime.title}</h3>
                    <span className={`text-sm font-bold flex-shrink-0 ${
                      score >= 80 ? "text-green-600" : score >= 60 ? "text-blue-600" : "text-gray-500"
                    }`}>
                      {score}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{anime.genre} · {anime.year} · {anime.episodes}ep</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {anime.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {expanded === anime.id && (
                    <div className="mt-3 pt-3 border-t border-gray-100 animate-fade-in-up">
                      <p className="text-sm text-gray-600 leading-relaxed">{anime.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {anime.tags.map((tag: string) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">
                            #{tag.replace(/\s+/g, '')}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <a href={`https://myanimelist.net/anime.php?q=${encodeURIComponent(anime.title)}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          📺 MyAnimeList
                        </a>
                        <a href={`https://www.crunchyroll.com/search?q=${encodeURIComponent(anime.title)}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                          🍊 Crunchyroll
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="h-1 bg-gray-100">
              <div className={`h-full rounded-r-full transition-all ${
                score >= 80 ? "bg-green-500" : score >= 60 ? "bg-blue-500" : "bg-gray-400"
              }`} style={{ width: `${score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
