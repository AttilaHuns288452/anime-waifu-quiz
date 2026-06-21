import type { Metadata } from "next";
import CharacterLibrary from "../services/CharacterLibrary";

export const metadata: Metadata = {
  title: "Character Library — Browse 427+ Anime Waifus & Husbandos",
  description:
    "Browse and discover 427+ anime characters from Naruto, Attack on Titan, Jujutsu Kaisen, Demon Slayer, and more! View their stats, anime origins, and personality traits.",
  alternates: {
    canonical: "https://www.animewaifucompatibility.xyz/library",
  },
  openGraph: {
    url: "https://www.animewaifucompatibility.xyz/library",
    title: "Character Library — Browse 427+ Anime Waifus & Husbandos",
    description: "Browse 427+ anime characters from Naruto, AOT, JJK, Demon Slayer, and more! View their stats, origins, and personality traits.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Anime Character Library" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Character Library — Browse 427+ Anime Waifus & Husbandos",
    description: "Browse 427+ anime characters and discover their personality traits!",
    images: ["/og-image.png"],
  },
};

export default function LibraryPage() {
  return <CharacterLibrary />;
}
