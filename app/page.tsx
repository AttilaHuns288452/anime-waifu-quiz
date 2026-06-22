import type { Metadata } from "next";
import QuizLoader from "./QuizLoader";

export const metadata: Metadata = {
  title: "Which Anime Waifu/Husbando Are You? — Personality Quiz",
  description:
    "Take the 15-question personality quiz and discover which anime character matches your real personality! Featuring 427+ waifus and husbandos from Naruto, Attack on Titan, Jujutsu Kaisen, Demon Slayer, and more!",
};

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold text-purple-800 mb-3 text-center">Discover Your Anime Match</h1>
      <p className="text-gray-600 text-lg text-center max-w-2xl mx-auto mb-6">
        Answer 15 fun questions and find out which anime character matches your real personality! 
        Featuring 427+ characters from Naruto, Attack on Titan, Jujutsu Kaisen, Demon Slayer, Bleach, and more.
      </p>
      <QuizLoader />
      <section className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Why Take This Quiz?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-white rounded-lg shadow-sm border border-purple-100">
            <h3 className="font-semibold text-purple-700 mb-1">427+ Characters</h3>
            <p className="text-sm text-gray-600">From Naruto, AOT, JJK, Demon Slayer, Bleach and 40+ anime series.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm border border-purple-100">
            <h3 className="font-semibold text-purple-700 mb-1">Smart Matching</h3>
            <p className="text-sm text-gray-600">Our algorithm pairs you with characters based on your real personality traits.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm border border-purple-100">
            <h3 className="font-semibold text-purple-700 mb-1">100% Free</h3>
            <p className="text-sm text-gray-600">No sign-up needed. Just answer 15 questions and get your match instantly.</p>
          </div>
        </div>
      </section>
    </>
  );
}
