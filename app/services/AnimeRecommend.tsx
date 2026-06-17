"use client";

import { useState, useEffect } from "react";
import { getAnimeByPersonality } from "@/lib/anime";
import { QuizAnswer, findMatches } from "@/lib/matching";
import { QUESTIONS } from "@/lib/questions";
import { CHARACTERS } from "@/lib/characters";

// Use demo answers (all first answers) to generate a sample personality
const DEMO_ANSWERS: QuizAnswer[] = QUESTIONS.map(q => ({ questionId: q.id, answerIndex: 0 }));

export default function AnimeRecommendations() {
  const [topAnime, setTopAnime] = useState<{ anime: any; score: number }[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    // Get a default personality profile
    const result = findMatches(DEMO_ANSWERS, "both");
    const recs = getAnimeByPersonality(result.profile);
    setTopAnime(recs);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        🎬 Anime Recommendations
      </h1>
      <p className="text-gray-500 mb-6">
        Based on personality matching — find anime that fits your vibe! Take the quiz first for personalized results.
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
                {/* Anime icon/emoji placeholder */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0 text-2xl border border-gray-200">
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
                        <a
                          href={`https://myanimelist.net/anime.php?q=${encodeURIComponent(anime.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          📺 Search on MyAnimeList
                        </a>
                        <a
                          href={`https://www.crunchyroll.com/search?q=${encodeURIComponent(anime.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          🍊 Watch on Crunchyroll
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Score bar */}
            <div className="h-1 bg-gray-100">
              <div className={`h-full rounded-r-full transition-all ${
                score >= 80 ? "bg-green-500" : score >= 60 ? "bg-blue-500" : "bg-gray-400"
              }`} style={{ width: `${score}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        <p>🎯 Take the <a href="/" className="text-purple-600 hover:underline font-medium">personality quiz</a> first for anime matched to YOU!</p>
        <p className="mt-1">Click any anime card to expand and see details</p>
      </div>
    </div>
  );
}
