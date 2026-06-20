import type { Metadata } from "next";
import AnimeRecommendations from "../services/AnimeRecommend";

export const metadata: Metadata = {
  title: "Anime Recommendations — Discover New Series Based on Your Match",
  description:
    "Get personalized anime recommendations based on your quiz results! Discover new series featuring characters similar to your personality match.",
};

export default function RecommendationsPage() {
  return <AnimeRecommendations />;
}
