import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Which Anime Waifu/Husbando Are You? — Personality Quiz",
  description: "Take the 15-question personality quiz and discover which anime character matches your real personality! Featuring 70+ waifus and husbandos from Naruto, Attack on Titan, Jujutsu Kaisen, Demon Slayer, and more!",
  keywords: [
    "anime waifu quiz",
    "which anime character are you",
    "anime personality test",
    "waifu match",
    "husbando quiz",
    "anime quiz",
    "manga character quiz",
  ],
  authors: [{ name: "AnimeWaifuQuiz" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.animewaifucompatibility.xyz",
    siteName: "Anime Waifu Compatibility Quiz",
    title: "Which Anime Waifu/Husbando Are You? — Personality Quiz",
    description: "Answer 15 fun questions and discover your perfect anime character match! 70+ characters from Naruto, AOT, JJK, Demon Slayer, and more!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Anime Waifu/Husbando Personality Quiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Which Anime Waifu/Husbando Are You?",
    description: "Find out which anime character matches your personality!",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4645179646749256"
            crossOrigin="anonymous"></script>
      </head>
      <body className="min-h-full flex flex-col bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              💕 Anime Match
            </a>
            <nav className="flex gap-4 text-sm text-gray-600">
              <a href="/" className="hover:text-purple-600">Quiz</a>
              <a href="#feedback" className="hover:text-purple-600">Feedback</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="mt-auto py-6 px-4 text-center text-sm text-gray-400">
          <p>💕 Anime Waifu/Husbando Personality Quiz — For entertainment purposes</p>
          <p className="mt-1">
            <a href="/privacy" className="hover:text-purple-600">Privacy</a>
            {" · "}
            <a href="/terms" className="hover:text-purple-600">Terms</a>
            {" · "}
            <a href="/feedback" className="hover:text-purple-600">Feedback</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
