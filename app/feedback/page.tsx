import type { Metadata } from "next";
import FeedbackForm from "./FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback & Suggestions — Anime Waifu Compatibility Quiz",
  description:
    "Share your feedback, suggest new characters, or report bugs. Help us make the Anime Waifu/Husbando personality quiz even better!",
  alternates: {
    canonical: "https://www.animewaifucompatibility.xyz/feedback",
  },
};

export default function FeedbackPage() {
  return <FeedbackForm />;
}
