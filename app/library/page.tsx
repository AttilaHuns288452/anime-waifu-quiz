import type { Metadata } from "next";
import CharacterLibrary from "../services/CharacterLibrary";

export const metadata: Metadata = {
  title: "Character Library — Browse 70+ Anime Waifus & Husbandos",
  description:
    "Browse and discover 70+ anime characters from Naruto, Attack on Titan, Jujutsu Kaisen, Demon Slayer, and more! View their stats, anime origins, and personality traits.",
  alternates: {
    canonical: "https://www.animewaifucompatibility.xyz/library",
  },
};

export default function LibraryPage() {
  return <CharacterLibrary />;
}
