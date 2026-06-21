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
        <p className="text-gray-600 text-lg">
          Answer 15 fun questions and find out which anime character matches your real personality! 
          Featuring 427+ characters from Naruto, Attack on Titan, Jujutsu Kaisen, Demon Slayer, Bleach, and more.
        </p>
      <QuizLoader />
    </>
  );
}
