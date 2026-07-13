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
      <p>Last updated: July 2026</p>

      <h2>Information We Collect</h2>
      <p><strong>Quiz answers</strong> are stored locally in your browser (localStorage) and are never sent to our servers. This data is used only to calculate your quiz result and is not shared with any third party.</p>
      <p><strong>Feedback submissions</strong> are collected via an embedded Google Form. Google's privacy policy governs that data — we do not store it ourselves.</p>
      <p>We do <strong>not</strong> require accounts, collect email addresses, or store personal information on our servers.</p>

      <h2>Cookies & Third-Party Advertising</h2>
      <p>We use <strong>Google AdSense</strong> to display ads. AdSense uses cookies and web beacons to serve personalized ads based on your visits to this and other websites. You can learn more about Google's advertising practices and opt out of personalized advertising at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.</p>
      <p>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites on the Internet.</p>
      <p>Users may opt out of personalized advertising by visiting <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">Ads Settings</a>. Alternatively, you can opt out of third-party vendor cookies by visiting the <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">Network Advertising Initiative opt-out page</a>.</p>

      <h2>Data Retention</h2>
      <p>Quiz data stored in your browser's localStorage persists until you clear your browser data. No server-side storage occurs. We do not retain, process, or transfer any personal data because we do not collect any.</p>

      <h2>Your Rights (GDPR / CCPA)</h2>
      <p>Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete data we hold about you. Since we do not collect personal data on our servers, no action is needed from us. For cookie-based data collected by AdSense, please manage your preferences via Google's Ads Settings linked above.</p>

      <h2>Children's Privacy</h2>
      <p>This site is not directed at children under 13. We do not knowingly collect any information from children. If you believe a child has provided us with data, contact us and we will investigate.</p>

      <h2>Changes to This Policy</h2>
      <p>We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>

      <h2>Contact</h2>
      <p>If you have questions about this privacy policy, please contact us at <strong>admin@animewaifuquiz.xyz</strong>.</p>
    </div>
  );
}
