import type { Metadata } from "next";
import QuizLoader from "./QuizLoader";

export const metadata: Metadata = {
  title: "Which Anime Waifu/Husbando Are You? — Personality Quiz",
  description:
    "Take the 15-question personality quiz and discover which anime character matches your real personality! Featuring 70+ waifus and husbandos from Naruto, Attack on Titan, Jujutsu Kaisen, Demon Slayer, and more!",
};

export default function Home() {
  return (
    <>
      <h1 className="sr-only">Which Anime Waifu/Husbando Are You? — Personality Quiz</h1>
      <section className="max-w-4xl mx-auto px-4 mb-6 text-center">
        <h2 className="text-3xl font-bold text-purple-800 mb-3">Discover Your Anime Match</h2>
        <p className="text-gray-600 text-lg">
          Answer 15 fun questions and find out which anime character matches your real personality! 
          Featuring 70+ characters from Naruto, Attack on Titan, Jujutsu Kaisen, Demon Slayer, Bleach, and more.
        </p>
      </section>
      <QuizLoader />
    </>
  );
}
