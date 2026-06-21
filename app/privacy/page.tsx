import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Anime Waifu Compatibility Quiz",
  description:
    "Our privacy policy explains how we handle your data. We don't collect personal information — quiz answers stay in your browser only.",
  alternates: {
    canonical: "https://www.animewaifucompatibility.xyz/privacy",
  },
};

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 prose prose-gray">
      <h1>Privacy Policy</h1>
      <p>We don't collect personal data. Quiz answers are stored locally in your browser only. No tracking, no cookies, no accounts.</p>
      <h2>What we store</h2>
      <ul>
        <li>Quiz answers — stored in your browser (localStorage) for feedback purposes only</li>
        <li>Feedback messages — stored locally (you choose to submit)</li>
      </ul>
      <h2>Third parties</h2>
      <p>We use Google AdSense which may use cookies for personalized ads. See Google's privacy policy for details.</p>
      <p>Contact: admin@animewaifuquiz.xyz</p>
    </div>
  );
}