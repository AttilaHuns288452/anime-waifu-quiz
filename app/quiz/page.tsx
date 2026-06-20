import type { Metadata } from "next";
import QuizLoader from "@/app/QuizLoader";

export const metadata: Metadata = {
  title: "Take the Quiz — Anime Waifu/Husbando Personality Test",
  description:
    "Answer 15 fun questions and discover which anime character matches your real personality! Hundreds of possible matches from your favorite series.",
};

export default function QuizPage() {
  return <QuizLoader />;
}
