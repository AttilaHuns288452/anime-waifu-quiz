import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Anime Waifu Compatibility Quiz",
  description:
    "Terms of service for the Anime Waifu/Husbando Personality Quiz. A fun fan project for entertainment purposes — results are not scientific.",
};

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 prose prose-gray">
      <h1>Terms of Service</h1>
      <p>This is a fun personality quiz for entertainment purposes. Results are not scientific or guaranteed.</p>
      <h2>Use</h2>
      <p>Free to use. No accounts needed. Feel free to share your results!</p>
      <h2>Disclaimer</h2>
      <p>All character names and series are property of their respective owners. This is a fan project.</p>
    </div>
  );
}