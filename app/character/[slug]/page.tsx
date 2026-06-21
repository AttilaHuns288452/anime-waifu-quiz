import type { Metadata } from "next";
import Link from "next/link";
import { CHARACTERS, type Character } from "@/lib/characters";
import { getCharacterImageWithGender } from "@/lib/images";

// Pre-render all character pages at build time
export function generateStaticParams() {
  return CHARACTERS.map((ch) => ({ slug: ch.id }));
}

// Dynamic metadata per character
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const ch = CHARACTERS.find((c) => c.id === params.slug);
  if (!ch) return { title: "Character Not Found" };

  const title = `${ch.name} — Anime Waifu/Husbando Personality Quiz`;
  const description = ch.description;
  const url = `https://www.animewaifucompatibility.xyz/character/${ch.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title,
      description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: ch.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

function TraitBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${(value / 3) * 100}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-4 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

export default function CharacterPage({ params }: { params: { slug: string } }) {
  const ch = CHARACTERS.find((c) => c.id === params.slug);

  if (!ch) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl mb-4">😕</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Character Not Found</h2>
        <p className="text-gray-500 mb-6">This character doesn't exist in our database.</p>
        <Link href="/library" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
          Browse All Characters
        </Link>
      </div>
    );
  }

  const imageUrl = getCharacterImageWithGender(ch.name, ch.gender, ch.imageUrl);
  const filterParam = ch.gender === "waifu" ? "waifu" : "husbando";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/library" className="hover:text-purple-600">Library</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{ch.name}</span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 p-6 md:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,white_0%,transparent_70%)]" />
          <div className="relative">
            <div className="w-28 h-28 mx-auto rounded-full border-4 border-white/40 overflow-hidden shadow-xl bg-white/10">
              <img
                src={imageUrl}
                alt={ch.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = "none";
                  img.parentElement!.innerHTML = `<span class="text-5xl">${ch.emoji}</span>`;
                }}
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-4">
              {ch.emoji} {ch.name}
            </h1>
            <p className="text-purple-200 text-lg mt-1">🎬 {ch.series}</p>
            <span className="inline-block mt-3 text-sm bg-white/20 rounded-full px-4 py-1.5 text-white backdrop-blur-sm">
              {ch.personality}
            </span>
            <span className={`inline-block mt-3 ml-2 text-sm rounded-full px-4 py-1.5 text-white backdrop-blur-sm ${
              ch.gender === "waifu" ? "bg-pink-500/40" : "bg-blue-500/40"
            }`}>
              {ch.gender === "waifu" ? "👧 Waifu" : "👦 Husbando"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-8">
          {/* About */}
          <section>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">📖 About</h2>
            <p className="text-gray-700 leading-relaxed">{ch.description}</p>
          </section>

          {/* Match Reason */}
          <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">💞 Why You Match</h2>
            <p className="text-gray-700 leading-relaxed">{ch.matchReason}</p>
          </section>

          {/* Personality Traits */}
          <section>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">🧠 Personality Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TraitBar
                label={ch.traits.e < 0 ? "Introvert" : "Extrovert"}
                value={Math.abs(ch.traits.e)}
                color="bg-purple-500"
              />
              <TraitBar
                label={ch.traits.l < 0 ? "Heart" : "Logic"}
                value={Math.abs(ch.traits.l)}
                color="bg-pink-500"
              />
              <TraitBar
                label={ch.traits.v < 0 ? "Serious" : "Playful"}
                value={Math.abs(ch.traits.v)}
                color="bg-blue-500"
              />
              <TraitBar
                label={ch.traits.p < 0 ? "Relaxed" : "Driven"}
                value={Math.abs(ch.traits.p)}
                color="bg-amber-500"
              />
              <TraitBar
                label={ch.traits.n < 0 ? "Independent" : "Loyal"}
                value={Math.abs(ch.traits.n)}
                color="bg-green-500"
              />
            </div>
          </section>

          {/* Season / Zodiac placeholder */}
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/quiz"
              className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              🌸 Take the Quiz — Match With {ch.name}
            </Link>
            <Link
              href={`/library?filter=${filterParam}`}
              className="flex-1 text-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
            >
              📚 Browse More {ch.gender === "waifu" ? "Waifus" : "Husbandos"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
