import type { Metadata } from "next";
import QuizLoader from "@/app/QuizLoader";

export const metadata: Metadata = {
  title: "Take the Quiz — Anime Waifu/Husbando Personality Test",
  description:
    "Answer 15 fun questions and discover which anime character matches your real personality! Hundreds of possible matches from your favorite series.",
  alternates: {
    canonical: "https://www.animewaifucompatibility.xyz/quiz",
  },
  openGraph: {
    url: "https://www.animewaifucompatibility.xyz/quiz",
    title: "Take the Quiz — Anime Waifu/Husbando Personality Test",
    description: "Answer 15 fun questions and discover which anime character matches your real personality! Hundreds of possible matches from Naruto, AOT, JJK, and more.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Anime Waifu/Husbando Personality Quiz" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Take the Quiz — Anime Waifu/Husbando Personality Test",
    description: "Answer 15 fun questions and find your perfect anime character match!",
    images: ["/og-image.png"],
  },
};

export default function QuizPage() {
  return <QuizLoader />;
}
