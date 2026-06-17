"use client";

import { useState } from "react";
import { QUESTIONS } from "@/lib/questions";
import { QuizAnswer, QuizResult, findMatches, getPersonalityDescription } from "@/lib/matching";
import { CHARACTERS } from "@/lib/characters";

type Gender = "waifu" | "husbando" | "both";

export default function AnimeQuiz() {
  const [gender, setGender] = useState<Gender | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showAlready, setShowAlready] = useState(false);

  const handleGenderSelect = (g: Gender) => {
    setGender(g);
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
  };

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers, { questionId: QUESTIONS[currentQ].id, answerIndex: index }];
    setAnswers(newAnswers);

    if (currentQ + 1 >= QUESTIONS.length) {
      const res = findMatches(newAnswers, gender!);
      setResult(res);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const reset = () => {
    setGender(null);
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
  };

  const shareText = result
    ? `I got ${result.character.name} (${result.compatibility}% match)! Find your anime waifu/husbando: https://animewaifuquiz.xyz`
    : "";

  // --- Gender Selection Screen ---
  if (!gender) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-6">💕</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Which Anime Waifu / Husbando Are You?
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Answer 15 fun questions and discover your perfect anime character match — based on your real personality!
        </p>
        <div className="grid gap-4 max-w-sm mx-auto">
          <button
            onClick={() => handleGenderSelect("waifu")}
            className="group p-5 bg-pink-50 border-2 border-pink-300 rounded-2xl hover:border-pink-500 hover:shadow-lg transition-all"
          >
            <span className="text-3xl block mb-1">👧</span>
            <span className="text-lg font-semibold text-pink-800">Show Me Waifus</span>
            <span className="text-sm text-pink-600 block mt-1">I want a female character match</span>
          </button>
          <button
            onClick={() => handleGenderSelect("husbando")}
            className="group p-5 bg-blue-50 border-2 border-blue-300 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <span className="text-3xl block mb-1">👦</span>
            <span className="text-lg font-semibold text-blue-800">Show Me Husbandos</span>
            <span className="text-sm text-blue-600 block mt-1">I want a male character match</span>
          </button>
          <button
            onClick={() => handleGenderSelect("both")}
            className="group p-5 bg-purple-50 border-2 border-purple-300 rounded-2xl hover:border-purple-500 hover:shadow-lg transition-all"
          >
            <span className="text-3xl block mb-1">🌈</span>
            <span className="text-lg font-semibold text-purple-800">Surprise Me!</span>
            <span className="text-sm text-purple-600 block mt-1">Match with anyone — waifu or husbando!</span>
          </button>
        </div>
        <div className="mt-10 text-sm text-gray-400 space-y-1">
          <p>✨ Featuring {CHARACTERS.length}+ characters from anime, manga & games</p>
          <p>🧠 Personality-based matching — not random!</p>
        </div>
      </div>
    );
  }

  // --- Result Screen ---
  if (result) {
    const c = result.character;
    const profileDesc = getPersonalityDescription(result.profile);

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Result Hero */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 p-8 text-white text-center">
            <div className="text-6xl mb-3">{c.emoji}</div>
            <p className="text-purple-200 text-sm uppercase tracking-wide mb-1">
              Your perfect match — {result.compatibility}% compatible
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-1">{c.name}</h2>
            <p className="text-purple-200 text-lg">{c.series}</p>
            <p className="text-sm mt-2 bg-white/20 rounded-full px-4 py-1 inline-block">{c.personality}</p>
          </div>

          {/* Character Info */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Why {c.name}?</h3>
              <p className="text-gray-700 leading-relaxed">{c.matchReason}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About {c.name}</h3>
              <p className="text-gray-600 leading-relaxed">{c.description}</p>
            </div>

            {/* Personality Profile */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Personality Profile</h3>
              <p className="text-gray-600 text-sm mb-3">{profileDesc}</p>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div>
                  <div className="font-bold text-gray-900">{result.profile.e.toFixed(1)}</div>
                  <div className="text-gray-500">{result.profile.e < 0 ? "Introvert" : "Extrovert"}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900">{result.profile.l.toFixed(1)}</div>
                  <div className="text-gray-500">{result.profile.l < 0 ? "Heart" : "Head"}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900">{result.profile.v.toFixed(1)}</div>
                  <div className="text-gray-500">{result.profile.v < 0 ? "Serious" : "Playful"}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900">{result.profile.p.toFixed(1)}</div>
                  <div className="text-gray-500">{result.profile.p < 0 ? "Relaxed" : "Driven"}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900">{result.profile.n.toFixed(1)}</div>
                  <div className="text-gray-500">{result.profile.n < 0 ? "Independent" : "Loyal"}</div>
                </div>
              </div>
            </div>

            {/* Runner Up */}
            {result.runnerUp && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-medium text-amber-800 mb-1">
                  Close second: {result.runnerUp.character.name} ({result.runnerUp.compatibility}%) — {result.runnerUp.character.series}
                </p>
                <p className="text-xs text-amber-600">{result.runnerUp.character.personality}</p>
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `I got ${c.name}!`,
                      text: shareText,
                    });
                  } else {
                    navigator.clipboard.writeText(shareText);
                    alert("Link copied! Share it with your friends! 🎉");
                  }
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                📤 Share Your Result
              </button>
              <button
                onClick={reset}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
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

        {/* Affiliate */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-3">🎌 Love anime? Check out:</p>
          <a
            href="https://www.crunchyroll.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-orange-50 border border-orange-200 rounded-xl hover:border-orange-400 transition-all text-center"
          >
            <p className="font-medium text-orange-800">Watch on Crunchyroll 🍊</p>
            <p className="text-sm text-orange-600">Stream thousands of anime episodes legally</p>
          </a>
        </div>
      </div>
    );
  }

  // --- Quiz Screen ---
  const question = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          {question.question}
        </h2>
        <div className="space-y-3">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full p-4 text-left bg-gray-50 border border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 hover:shadow-md transition-all text-gray-800 font-medium"
            >
              {answer.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simple feedback form component
function FeedbackForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, log to console (in future, send to email/API)
    console.log("Feedback:", { name, message });
    setSent(true);
    // Store in localStorage for now
    const existing = JSON.parse(localStorage.getItem("anime-feedback") || "[]");
    existing.push({ name, message, date: new Date().toISOString() });
    localStorage.setItem("anime-feedback", JSON.stringify(existing));
  };

  if (sent) {
    return <p className="text-green-600 font-medium">Thank you! Your feedback helps us improve 💕</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <textarea
        placeholder="What did you think? Any characters we should add?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
      >
        Send Feedback 💬
      </button>
    </form>
  );
}
