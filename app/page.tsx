import type { Metadata } from "next";
import QuizLoader from "./QuizLoader";
import { CHARACTERS } from "@/lib/characters";
import Marquee from "@/components/Marquee";

export const metadata: Metadata = {
  title: "Which Anime Waifu/Husbando Are You? — Personality Quiz",
  description:
    "Take the 20-question personality quiz and discover which anime character matches your real personality! Featuring 427+ waifus and husbandos from Naruto, Attack on Titan, Jujutsu Kaisen, Demon Slayer, and more!",
};

const MARQUEE = [
  "hinata-hyuga","mikasa-ackerman","rem","yor-forger","nobara-kugisaki","shinobu-kocho","asuna-yuuki","marin-kitagawa","frieren","boa-hancock",
  "gojo-satoru","levi-ackerman","itachi-uchiha","kakashi-hatake","eren-yeager","tanjiro-kamado","zoro","luffy","killua-zoldyck","eren-yeager",
].map(id => CHARACTERS.find(c=>c.id===id)).filter(Boolean) as typeof CHARACTERS;

const FAQ = [
  { q: "How does the matching work?", a: "You answer 20 personality questions across 5 traits (Extroversion, Logic, Playfulness, Drive, Loyalty). We score every character on the same 5 axes and rank by weighted distance — the closest match wins. No randomness." },
  { q: "How many characters?", a: "427 characters across 137 series — waifus and husbandos from Naruto, Attack on Titan, Jujutsu Kaisen, Demon Slayer, One Piece, Bleach, Spy x Family, Frieren, and 130+ more." },
  { q: "Is it free? Do I need to sign up?", a: "100% free, no signup, no email. Take the quiz, get your match and top-10 ranking instantly. Share your result with one tap." },
  { q: "Can I browse all characters?", a: "Yes — open the Library to filter by waifu/husbando, search by name or series, sort, and view full personality profiles for every character." },
];

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_40%)] opacity-20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold tracking-wide border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> 427 CHARACTERS · 137 SERIES · 5 TRAITS
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight leading-[0.95]">
            Discover Your<br />
            <span className="bg-white text-transparent bg-clip-text">Anime Match</span>
          </h1>
          <p className="mt-4 text-white/85 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Answer 20 fun questions and find your perfect <strong className="text-white">waifu or husbando</strong> — personality-matched, not random. Like Akinator, but for anime.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#quiz" className="px-7 py-3.5 rounded-full bg-white text-purple-700 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Take the Quiz — 2 min →</a>
            <a href="/library" className="px-7 py-3.5 rounded-full bg-white/10 border border-white/30 text-white font-semibold backdrop-blur hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Browse 427 Characters</a>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl mx-auto">
            {[
              { k: "427+", v: "Characters" },
              { k: "137", v: "Series" },
              { k: "20 Qs", v: "Personality match" },
            ].map(s => (
              <div key={s.k} className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 py-3">
                <div className="text-xl font-extrabold">{s.k}</div>
                <div className="text-xs text-white/80">{s.v}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] text-white/70">
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">✓ No signup</span>
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">✓ Instant result</span>
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">✓ Shareable</span>
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">✓ Top 10 ranking</span>
          </div>
        </div>
      </section>

      {/* MARQUEE - client component to avoid onError in server */}
      <Marquee ids={MARQUEE.map(c=>c.id)} />

      {/* QUIZ */}
      <div id="quiz" className="scroll-mt-16">
        <QuizLoader />
      </div>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">How it works</h2>
        <p className="text-center text-gray-500 mt-2">Three steps to your perfect match</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { n: "01", t: "Pick your vibe", d: "Choose Waifu, Husbando, or Surprise Me — we filter the 427 characters accordingly.", icon: "🎭" },
            { n: "02", t: "Answer 20 questions", d: "Quick personality quiz — 1-tap answers, keyboard 1–4 supported, progress saved instantly.", icon: "✨" },
            { n: "03", t: "Get your match", d: "See your #1 match, compatibility %, certainty, and full Top 10 ranking. Share in one tap.", icon: "💕" },
          ].map(s => (
            <div key={s.n} className="relative p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center text-lg">{s.icon}</div>
              <div className="absolute top-4 right-4 text-xs font-bold text-gray-300">{s.n}</div>
              <h3 className="mt-4 font-bold text-gray-900">{s.t}</h3>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a href="#quiz" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold shadow hover:shadow-lg hover:scale-[1.02] transition-all">Start now — find your match →</a>
        </div>
      </section>

      {/* WHY + TRUST */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-purple-700">427+ Characters</h3>
            <p className="text-sm text-gray-600 mt-1">From Naruto, AOT, JJK, Demon Slayer, Bleach and 130+ series — every portrait loaded, every profile unique.</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-purple-700">Smart Matching</h3>
            <p className="text-sm text-gray-600 mt-1">Weighted 5-axis personality distance + axis bonuses. Your Top 10 is ranked, not random.</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-purple-700">100% Free & Private</h3>
            <p className="text-sm text-gray-600 mt-1">No signup, no tracking. Your answers stay in your browser. Results are shareable via link.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-gray-500">
          <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200">🔒 No data collected</span>
          <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200">⚡ ~2 minutes</span>
          <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200">🎌 137 anime & games</span>
          <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200">💬 Feedback → we add characters</span>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold text-gray-900">FAQ</h2>
        <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white overflow-hidden">
          {FAQ.map(f => (
            <details key={f.q} className="group p-5 open:bg-gray-50">
              <summary className="list-none flex items-center justify-between cursor-pointer font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg">
                <span>{f.q}</span><span className="ml-4 text-gray-400 group-open:rotate-45 transition-transform">＋</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">Want a character added? <a href="/feedback" className="text-purple-600 hover:underline font-medium">Send feedback</a> — we actually read it.</p>
      </section>
    </>
  );
}
