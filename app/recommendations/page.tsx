import type { Metadata } from "next";
import AnimeRecommendations from "../services/AnimeRecommend";

export const metadata: Metadata = {
  title: "Anime Recommendations — Discover New Series Based on Your Match",
  description:
    "Get personalized anime recommendations based on your quiz results! Discover new series featuring characters similar to your personality match.",
  alternates: {
    canonical: "https://www.animewaifucompatibility.xyz/recommendations",
  },
  openGraph: {
    url: "https://www.animewaifucompatibility.xyz/recommendations",
    title: "Anime Recommendations — Discover New Series Based on Your Match",
    description: "Get personalized anime recommendations based on your quiz results! Discover new series featuring characters similar to your match.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Anime Recommendations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anime Recommendations — Discover New Series Based on Your Match",
    description: "Get personalized anime recommendations based on your quiz results!",
    images: ["/og-image.png"],
  },
};

export default function RecommendationsPage() {
  return <AnimeRecommendations />;
}
