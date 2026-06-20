import type { Metadata } from "next";
import QuizLoader from "./QuizLoader";

export const metadata: Metadata = {
  title: "Which Anime Waifu/Husbando Are You? — Personality Quiz",
  description:
    "Take the 15-question personality quiz and discover which anime character matches your real personality! Featuring 70+ waifus and husbandos from Naruto, Attack on Titan, Jujutsu Kaisen, Demon Slayer, and more!",
};

export default function Home() {
  return <QuizLoader />;
}
