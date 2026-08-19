import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import type { Viewport } from "next";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#7c3aed",
};

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
  metadataBase: new URL("https://www.animewaifucompatibility.xyz"),
  title: "Which Anime Waifu/Husbando Are You? — Personality Quiz",
  description: "Take the 20-question personality quiz and discover which anime character matches your real personality! Featuring 427+ waifus and husbandos from Naruto, Attack on Titan, Jujutsu Kaisen, Demon Slayer, and more!",
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
  alternates: {
    canonical: "https://www.animewaifucompatibility.xyz",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.animewaifucompatibility.xyz",
    siteName: "Anime Waifu Compatibility Quiz",
    title: "Which Anime Waifu/Husbando Are You? — Personality Quiz",
    description: "Answer 20 fun questions and discover your perfect anime character match! 427+ characters from Naruto, AOT, JJK, Demon Slayer, and more!",
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
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Anime Waifu/Husbando Personality Quiz",
              description: "Answer 20 fun questions and discover which anime character matches your real personality! Featuring 427+ characters from 137 anime series.",
              url: "https://www.animewaifucompatibility.xyz",
              author: { "@type": "Organization", name: "AnimeWaifuQuiz" },
              publisher: { "@type": "Organization", name: "AnimeWaifuQuiz" },
              applicationCategory: "QuizApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Personality quiz",
                "Waifu and husbando matching",
                "427+ anime characters",
                "Character library",
                "Anime recommendations",
              ],
            }),
          }}
        />
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AnimeWaifuQuiz",
              url: "https://www.animewaifucompatibility.xyz",
              logo: "https://www.animewaifucompatibility.xyz/og-image.png",
              description: "Free anime personality quiz with 427+ characters.",
            }),
          }}
        />
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Anime Waifu Compatibility Quiz",
              url: "https://www.animewaifucompatibility.xyz",
              description: "Discover which anime character matches your personality.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.animewaifucompatibility.xyz/?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50">
        <SiteHeader />
        <main className="flex-1 animate-fade-in-up">
          {children}
        </main>
        <footer className="mt-auto border-t border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6 md:items-start md:justify-between">
              <div>
                <div className="font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">💕 Anime Waifu/Husbando Quiz</div>
                <p className="text-sm text-gray-500 mt-1 max-w-md">For entertainment purposes. Find your personality match among 427+ characters from 137 series.</p>
                <p className="text-xs text-gray-400 mt-2">Not affiliated with any anime studio or publisher.</p>
              </div>
              <div className="flex gap-8 text-sm">
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-gray-700">Explore</span>
                  <a href="/quiz" className="text-gray-500 hover:text-purple-600">Quiz</a>
                  <a href="/library" className="text-gray-500 hover:text-purple-600">Library</a>
                  <a href="/recommendations" className="text-gray-500 hover:text-purple-600">Anime Recs</a>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-gray-700">Info</span>
                  <a href="/about" className="text-gray-500 hover:text-purple-600">About</a>
                  <a href="/feedback" className="text-gray-500 hover:text-purple-600">Feedback</a>
                  <a href="/privacy" className="text-gray-500 hover:text-purple-600">Privacy</a>
                  <a href="/terms" className="text-gray-500 hover:text-purple-600">Terms</a>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} Anime Match — Made with 💜 for anime fans</p>
              <a href="https://www.effectivecpmnetwork.com/yuy7hxfcs?key=f38b2e62893ef70d40541caadb150281" target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold shadow hover:shadow-md transition-shadow">🔥 Trending Anime Deals</a>
            </div>
          </div>
        </footer>
        <Analytics />
        <Script strategy="afterInteractive" src="https://pl30918940.effectivecpmnetwork.com/08/75/2f/08752fe5250645d76d3a55aff93dcec8.js" />
        <Script strategy="afterInteractive" src="https://pl30918941.effectivecpmnetwork.com/9d/b1/a6/9db1a61b58266168902e57d4487e1c2e.js" />
      </body>
    </html>
  );
}
