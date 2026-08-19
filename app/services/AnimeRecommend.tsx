"use client";

import { useState, useEffect } from "react";
import { getAnimeByPersonality } from "@/lib/anime";
import { CHARACTERS } from "@/lib/characters";
import { getCharacterImageWithGender } from "@/lib/images";
import { QuizAnswer, findMatches } from "@/lib/matching";
import { QUESTIONS } from "@/lib/questions";
import AdBannerWaifu from "@/components/AdBannerWaifu";

function ScoreRing({ score }: { score: number }) {
  const r = 18, c = 2 * Math.PI * r, pct = Math.max(0, Math.min(100, score));
  const dash = (pct / 100) * c;
  const color = pct >= 80 ? "#16a34a" : pct >= 60 ? "#2563eb" : "#9ca3af";
  return (
    <svg width={44} height={44} viewBox="0 0 44 44" className="shrink-0">
      <circle cx={22} cy={22} r={r} fill="none" stroke="#e5e7eb" strokeWidth={4} />
      <circle cx={22} cy={22} r={r} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`} className="score-ring" />
      <text x={22} y={22} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700} fill={color}>{score}%</text>
    </svg>
  );
}

export default function AnimeRecommendations() {
  const [topAnime, setTopAnime] = useState<{ anime: any; score: number }[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hasQuizData, setHasQuizData] = useState(false);

  useEffect(() => {
    let profile = null;
    try {
      const saved = localStorage.getItem("anime-personality-profile");
      if (saved) { profile = JSON.parse(saved); setHasQuizData(true); }
    } catch {}
    if (!profile) {
      const demoAnswers: QuizAnswer[] = QUESTIONS.map(q => ({ questionId: q.id, answerIndex: 0 }));
      const result = findMatches(demoAnswers, "both");
      profile = result.profile;
    }
    setTopAnime(getAnimeByPersonality(profile));
  }, []);

  if (topAnime.length === 0) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">Loading recommendations...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        🎬 Anime Recommendations
      </h1>
      {hasQuizData ? (
        <p className="text-green-600 text-sm mb-1">✅ Personalized from your quiz — retake the quiz to update.</p>
      ) : (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
          <p className="text-sm text-amber-800">Want truly personal picks? Take the 2-minute quiz first.</p>
          <a href="/quiz" className="shrink-0 px-4 py-2 rounded-full bg-amber-600 text-white text-xs font-bold hover:bg-amber-700">Take Quiz →</a>
        </div>
      )}
      {!hasQuizData && <p className="text-gray-500 text-sm mb-6">Showing demo recommendations — your real ones will be even better.</p>}
      {hasQuizData && <p className="text-gray-500 text-sm mb-6">Top 20 anime matched to your personality — tap any card to expand.</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {topAnime.slice(0, 20).map(({ anime, score }) => {
          const related = CHARACTERS.filter(c => {
            const a = anime.title.toLowerCase(); const s = c.series.toLowerCase();
            return a.includes(s) || s.includes(a.split(" ")[0]) || a.split(" /")[0].toLowerCase().includes(s);
          }).slice(0, 3);
          const isOpen = expanded === anime.id;
          return (
          <div
            key={anime.id}
            className={`bg-white rounded-2xl border overflow-hidden transition-all cursor-pointer ${isOpen ? "border-purple-300 shadow-md" : "border-gray-200 hover:shadow-lg hover:border-gray-300"}`}
            onClick={() => setExpanded(isOpen ? null : anime.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); setExpanded(isOpen?null:anime.id); }}}
            aria-expanded={isOpen}
          >
            <div className={`p-5 ${isOpen ? "pb-3" : ""}`}>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0 text-2xl border border-gray-200 overflow-hidden">
                  {related[0] ? (
                    <img src={getCharacterImageWithGender(related[0].name, related[0].gender, related[0].imageUrl)} alt={related[0].name} className="w-full h-full object-cover object-top" loading="lazy" decoding="async" onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />
                  ) : "🎬"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-base leading-tight">{anime.title}</h3>
                    <ScoreRing score={score} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{anime.genre} · {anime.year} · {anime.episodes}ep</p>
                  {related.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex -space-x-1">
                        {related.map(r=>(
                          <img key={r.id} src={getCharacterImageWithGender(r.name, r.gender, r.imageUrl)} alt={r.name} title={r.name} className="w-7 h-7 rounded-full border-2 border-white object-cover object-top bg-gray-100" loading="lazy" decoding="async" onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 truncate">{related.map(r=>r.name.split(" ")[0]).join(", ")}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {anime.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">{tag}</span>
                    ))}
                    <span className="text-[10px] text-gray-400 self-center ml-1">{isOpen ? "▲ less" : "▼ more"}</span>
                  </div>

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-gray-100 animate-fade-in-up" onClick={e=>e.stopPropagation()}>
                      <p className="text-sm text-gray-600 leading-relaxed">{anime.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {anime.tags.map((tag: string) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">#{tag.replace(/\s+/g, '')}</span>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <a href={`https://myanimelist.net/anime.php?q=${encodeURIComponent(anime.title)}`} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">📺 MyAnimeList</a>
                        <a href={`https://www.crunchyroll.com/search?q=${encodeURIComponent(anime.title)}`} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">🍊 Crunchyroll</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="h-1 bg-gray-100">
              <div className={`h-full rounded-r-full transition-all ${score >= 80 ? "bg-green-500" : score >= 60 ? "bg-blue-500" : "bg-gray-400"}`} style={{ width: `${score}%` }} />
            </div>
          </div>
          );})}
      </div>
      <AdBannerWaifu className="mt-6" />
      <div className="flex justify-center mt-4">
        <a href="https://www.effectivecpmnetwork.com/yuy7hxfcs?key=f38b2e62893ef70d40541caadb150281" target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow hover:shadow-md transition-all">🔥 Trending Anime Deals</a>
      </div>
    </div>
  );
}
