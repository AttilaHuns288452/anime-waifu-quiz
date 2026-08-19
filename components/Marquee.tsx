"use client";
import { CHARACTERS } from "@/lib/characters";
import { getCharacterImageWithGender } from "@/lib/images";

export default function Marquee({ ids }: { ids: string[] }) {
  const chars = ids.map(id => CHARACTERS.find(c => c.id === id)).filter(Boolean) as typeof CHARACTERS;
  const doubled = [...chars, ...chars];
  return (
    <div className="bg-white border-y border-gray-100 py-3">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-3 text-xs text-gray-500 mb-2">
        <span className="font-semibold text-gray-700">Featuring</span>
        <span className="hidden sm:inline">— hover to pause</span>
        <a href="/library" className="ml-auto text-purple-600 hover:underline font-medium">View all →</a>
      </div>
      <div className="marquee">
        <div className="marquee-track gap-3 pr-3">
          {doubled.map((ch, i) => (
            <a key={ch.id + "-" + i} href={`/character/${ch.id}`} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors shrink-0">
              <span className="w-8 h-8 rounded-full overflow-hidden bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <img src={getCharacterImageWithGender(ch.name, ch.gender, ch.imageUrl)} alt={ch.name} className="w-full h-full object-cover object-top" loading="lazy" decoding="async" onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />
              </span>
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{ch.name}</span>
              <span className="text-xs text-gray-400 hidden sm:inline">· {ch.series}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
