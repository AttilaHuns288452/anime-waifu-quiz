"use client";

import { useState, useEffect } from "react";
import { QUESTIONS } from "@/lib/questions";
import { QuizAnswer, QuizResult, findMatches, getPersonalityDescription } from "@/lib/matching";
import { CHARACTERS } from "@/lib/characters";

type Gender = "waifu" | "husbando" | "both";

// Sakura petals background component
function SakuraBackground() {
  const petals = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 14 + Math.random() * 14,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 12,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="sakura-container">
      {petals.map((p) => (
        <div
          key={p.id}
          className="sakura-petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// Loading screen
function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    const timer = setTimeout(onFinish, 2000);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900">
      <div className="loading-spinner mb-8" />
      <div className="text-4xl mb-4 heartbeat">💕</div>
      <p className="text-xl text-white/80 font-medium">Finding your match{dots}</p>
      <p className="text-sm text-white/40 mt-2">Analyzing across 20 personality dimensions...</p>
      <div className="mt-8 flex gap-3">
        {["✨", "🌟", "💫", "⭐"].map((s, i) => (
          <span key={i} className="text-2xl sparkle" style={{ animationDelay: `${i * 0.3}s` }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

export default function AnimeQuiz() {
  const [gender, setGender] = useState<Gender | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleGenderSelect = (g: Gender) => {
    setGender(g);
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
    setShowResult(false);
  };

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers, { questionId: QUESTIONS[currentQ].id, answerIndex: index }];
    setAnswers(newAnswers);

    if (currentQ + 1 >= QUESTIONS.length) {
      setLoading(true);
      // Simulate processing time for the loading screen
      setTimeout(() => {
        const res = findMatches(newAnswers, gender!);
        setResult(res);
        setLoading(false);
        setTimeout(() => setShowResult(true), 100);
      }, 1500);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const reset = () => {
    setGender(null);
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
    setShowResult(false);
  };

  const shareText = result
    ? `I got ${result.character.name} (${result.compatibility}% match)! 💕 Find your anime match: https://www.animewaifucompatibility.xyz`
    : "";

  // --- Loading Screen ---
  if (loading) {
    return <LoadingScreen onFinish={() => {}} />;
  }

  // --- Gender Selection Screen ---
  if (!gender) {
    // Featured characters for the landing page
    const featured = [
      { name: "Hinata Hyuga", series: "Naruto", emoji: "💜" },
      { name: "Gojo Satoru", series: "JJK", emoji: "🕶️" },
      { name: "Levi Ackerman", series: "AOT", emoji: "🧹" },
      { name: "Rem", series: "Re:Zero", emoji: "🔵" },
      { name: "Zoro", series: "One Piece", emoji: "⚔️" },
      { name: "Marin Kitagawa", series: "My Dress-Up Darling", emoji: "❤️" },
    ];

    return (
      <>
        <SakuraBackground />
        <div className="relative z-10 max-w-lg mx-auto px-4 py-12 text-center animate-fade-in-up">
          <div className="text-7xl mb-4 animate-fade-in-scale">💕</div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Which Anime Match Are You?
          </h1>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            Answer <strong>20 personality questions</strong> and discover your perfect <strong>waifu or husbando</strong> match — like Akinator, but for anime!
          </p>

          {/* Featured Characters */}
          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-3">Featuring 70+ characters including:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {featured.map((ch) => (
                <span key={ch.name} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/80 border border-gray-200 rounded-full text-sm shadow-sm hover:shadow-md transition-shadow">
                  <span>{ch.emoji}</span>
                  <span className="font-medium text-gray-800">{ch.name}</span>
                  <span className="text-gray-400 text-xs">· {ch.series}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 max-w-sm mx-auto">
            <button
              onClick={() => handleGenderSelect("waifu")}
              className="group relative p-5 bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-300 rounded-2xl hover:border-pink-400 hover:shadow-xl hover:shadow-pink-200/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">🌸</div>
              <span className="text-4xl block mb-2">👧</span>
              <span className="text-lg font-bold text-pink-800">Find Your Waifu</span>
              <span className="text-sm text-pink-600 block mt-1">Match with female characters</span>
            </button>
            <button
              onClick={() => handleGenderSelect("husbando")}
              className="group relative p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl hover:border-blue-400 hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">⚔️</div>
              <span className="text-4xl block mb-2">👦</span>
              <span className="text-lg font-bold text-blue-800">Find Your Husbando</span>
              <span className="text-sm text-blue-600 block mt-1">Match with male characters</span>
            </button>
            <button
              onClick={() => handleGenderSelect("both")}
              className="group relative p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-2xl hover:border-purple-400 hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">🌈</div>
              <span className="text-4xl block mb-2">🎲</span>
              <span className="text-lg font-bold text-purple-800">Surprise Me!</span>
              <span className="text-sm text-purple-600 block mt-1">Match with anyone!</span>
            </button>
          </div>
          <div className="mt-10 text-sm text-gray-400 space-y-1">
            <p>🎌 Featuring <strong>{CHARACTERS.length}+ characters</strong> from anime, manga & games</p>
            <p>🧠 <strong>Personality-based</strong> matching — not random!</p>
          </div>
        </div>
      </>
    );
  }

  // --- Result Screen ---
  if (result && showResult) {
    const c = result.character;
    const profileDesc = getPersonalityDescription(result.profile);

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-fade-in-scale">
          {/* Result Hero */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white text-center rounded-2xl shadow-2xl animate-pulse-glow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 animate-gradient" style={{backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}} />
            <div className="relative z-10 p-8 md:p-10">
              {/* Character Image */}
              <div className="flex justify-center mb-4">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden bg-white/10 flex items-center justify-center">
                  {c.imageUrl ? (
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-7xl heartbeat">{c.emoji}</span>
                  )}
                </div>
              </div>
              <p className="text-purple-200 text-sm uppercase tracking-widest mb-2">
                ✨ Your Perfect Match — {result.compatibility}% Compatible ✨
              </p>
              {result.certainty > 70 && (
                <p className="text-green-300 text-xs mb-2">🎯 High Confidence Match</p>
              )}
              {result.certainty > 40 && result.certainty <= 70 && (
                <p className="text-yellow-300 text-xs mb-2">📊 Good Match — try answering more specifically for higher accuracy</p>
              )}
              {result.certainty <= 40 && (
                <p className="text-purple-200 text-xs mb-2">🔄 Close call with other characters! Retake for more accuracy</p>
              )}
              <h2 className="text-4xl md:text-5xl font-bold mb-2">{c.name}</h2>
              <p className="text-purple-200 text-lg mb-3">🎬 {c.series}</p>
              <div className="inline-flex gap-2">
                <span className="text-sm bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">{c.personality}</span>
                <span className="text-sm bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">{c.gender === "waifu" ? "👧 Waifu" : "👦 Husbando"}</span>
              </div>
            </div>
          </div>

          {/* Character Info */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 -mt-4 relative z-10 space-y-6">
            {/* Why this character */}
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>💞</span> Why {c.name}?
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">{c.matchReason}</p>
            </div>

            {/* About */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📖</span> About {c.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">{c.description}</p>
            </div>

            {/* Personality Profile */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🧠</span> Your Personality Profile
              </h3>
              <p className="text-gray-600 text-sm mb-4 italic">{profileDesc}</p>
              <div className="grid grid-cols-5 gap-2 text-center">
                {[
                  { label: result.profile.e < 0 ? "Introvert" : "Extrovert", val: result.profile.e, color: "bg-purple-500" },
                  { label: result.profile.l < 0 ? "Heart" : "Logic", val: result.profile.l, color: "bg-pink-500" },
                  { label: result.profile.v < 0 ? "Serious" : "Playful", val: result.profile.v, color: "bg-blue-500" },
                  { label: result.profile.p < 0 ? "Relaxed" : "Driven", val: result.profile.p, color: "bg-amber-500" },
                  { label: result.profile.n < 0 ? "Independent" : "Loyal", val: result.profile.n, color: "bg-green-500" },
                ].map((item) => (
                  <div key={item.label} className="p-2 bg-white/80 rounded-lg">
                    <div className={`h-1.5 rounded-full mb-2 ${item.color}`} style={{ width: `${Math.abs(item.val / 3) * 100}%` }} />
                    <div className="font-bold text-gray-900 text-xs">{item.val.toFixed(1)}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Runner Up */}
            {result.runnerUp && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <p className="text-sm font-medium text-amber-800 flex items-center gap-2">
                  <span>🥈</span> Also a great match: <strong>{result.runnerUp.character.name}</strong> ({result.runnerUp.compatibility}%) — {result.runnerUp.character.series}
                </p>
                <p className="text-xs text-amber-600 mt-1">{result.runnerUp.character.personality}</p>
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex flex-wrap gap-3 pt-2 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: `I got ${c.name}!`, text: shareText });
                  } else {
                    navigator.clipboard.writeText(shareText);
                    alert("📋 Link copied! Share it with your friends!");
                  }
                }}
                className="flex-1 px-5 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-300/50 transition-all duration-300"
              >
                📤 Share Your Result
              </button>
              <button
                onClick={reset}
                className="px-5 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                🔄 Take Again
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6 shadow-sm" id="feedback">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💬 How can we improve?</h3>
          <FeedbackForm />
        </div>

        {/* Crunchyroll Affiliate */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6 mt-6 shadow-sm">
          <p className="text-sm text-orange-700 mb-3 flex items-center gap-2">
            <span>🎌</span> Love anime? Stream thousands of episodes!
          </p>
          <a
            href="https://www.crunchyroll.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white border border-orange-300 rounded-xl hover:border-orange-400 hover:shadow-md transition-all text-center"
          >
            <p className="font-bold text-orange-700">Watch on Crunchyroll 🍊</p>
            <p className="text-sm text-orange-500">Legal streaming, simulcasts, and classics</p>
          </a>
        </div>
      </div>
    );
  }

  // --- Quiz Screen ---
  const question = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;
  const progressEmojis = ["🌸", "🌺", "💮", "🏵️", "🌷", "🌹", "🌻", "🌼", "💐", "🌸", "🌺", "💮", "🏵️", "🌷", "🌹"];

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Progress */}
      <div className="mb-6 animate-fade-in-up">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
          <span className="flex items-center gap-2">
            <span>{progressEmojis[currentQ] || "✨"}</span>
            <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
          </span>
          <span className="font-medium text-purple-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full transition-all duration-700 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-gray-400">🤔 Thinking</span>
          <span className="text-xs text-gray-400">💕 Almost there!</span>
        </div>
      </div>

      {/* Question Card */}
      <div key={currentQ} className="question-enter">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <div className="text-3xl mb-4">{progressEmojis[currentQ] || "✨"}</div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
            {question.question}
          </h2>
          <div className="space-y-3">
            {question.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full p-4 text-left bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-purple-400 hover:from-purple-50 hover:to-pink-50 hover:shadow-lg hover:shadow-purple-200/30 transition-all duration-300 text-gray-800 font-medium group"
              >
                <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                  {answer.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Feedback form component
function FeedbackForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("anime-feedback") || "[]");
    existing.push({ name, message, date: new Date().toISOString() });
    localStorage.setItem("anime-feedback", JSON.stringify(existing));
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-4 animate-fade-in-scale">
        <p className="text-2xl mb-2">💕</p>
        <p className="text-green-600 font-medium">Thank you! Your feedback makes us better!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
      />
      <textarea
        placeholder="What did you think? Any characters we should add?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={3}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
      />
      <button
        type="submit"
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-300/50 transition-all duration-300"
      >
        Send Feedback 💬
      </button>
    </form>
  );
}
