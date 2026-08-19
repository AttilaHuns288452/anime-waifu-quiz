"use client";

import { useState, Fragment, useMemo } from "react";
import Link from "next/link";
import { CHARACTERS } from "@/lib/characters";
import { playBakaSound, isTsundere } from "@/lib/sound-effects";
import { getCharacterImageWithGender } from "@/lib/images";
import AdBannerWaifu from "@/components/AdBannerWaifu";

type FilterType = "all" | "waifu" | "husbando";
type SortType = "name" | "series";

export default function CharacterLibrary() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortType>("name");
  const [selected, setSelected] = useState<string | null>(null);
  const [visible, setVisible] = useState(48);

  const filtered = useMemo(() => {
    let chars = [...CHARACTERS];
    if (filter === "waifu") chars = chars.filter(c => c.gender === "waifu");
    if (filter === "husbando") chars = chars.filter(c => c.gender === "husbando");
    if (search.trim()) {
      const q = search.toLowerCase();
      chars = chars.filter(c => c.name.toLowerCase().includes(q) || c.series.toLowerCase().includes(q));
    }
    chars.sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : a.series.localeCompare(b.series) || a.name.localeCompare(b.name));
    return chars;
  }, [filter, search, sort]);

  const activeFilters = (filter !== "all" ? 1 : 0) + (search.trim() ? 1 : 0);
  const shown = filtered.slice(0, visible);
  const selectedChar = selected ? CHARACTERS.find(c => c.id === selected) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        📚 Character Library
      </h1>
      <p className="text-gray-500 mb-6">
        Browse all {CHARACTERS.length} characters — {filtered.length} matching
        {activeFilters > 0 && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-purple-600 text-white text-xs font-bold">{activeFilters} filter{activeFilters>1?"s":""} active</span>}
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex gap-2">
          {[
            { key: "all" as FilterType, label: "✨ All", cls: "bg-purple-600" },
            { key: "waifu" as FilterType, label: "👧 Waifus", cls: "bg-pink-600" },
            { key: "husbando" as FilterType, label: "👦 Husbandos", cls: "bg-blue-600" },
          ].map(({ key, label, cls }) => (
            <button
              key={key}
              onClick={() => { setFilter(key); setVisible(48); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                filter === key ? `${cls} text-white shadow-md` : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto flex-wrap">
          <select value={sort} onChange={e => setSort(e.target.value as SortType)} className="px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400">
            <option value="name">Sort: Name A–Z</option>
            <option value="series">Sort: Series A–Z</option>
          </select>
          {activeFilters > 0 && (
            <button onClick={() => { setFilter("all"); setSearch(""); setVisible(48); }} className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Clear ✕</button>
          )}
        </div>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search characters or series..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setVisible(48); }}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-semibold text-gray-900">No characters found</p>
          <p className="text-sm text-gray-500 mt-1">Try a different search or clear filters</p>
          <button onClick={() => { setFilter("all"); setSearch(""); }} className="mt-4 px-5 py-2.5 rounded-full bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700">Clear filters</button>
        </div>
      ) : (
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Character Grid */}
          <div className={`${selectedChar ? "lg:w-1/2" : "w-full"}`}>
            <div className={`grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${selectedChar ? "lg:grid-cols-2" : ""}`}>
              {shown.map((ch, idx) => (
                <Fragment key={ch.id}>
                  <button
                    onClick={() => {
                      if (isTsundere({ name: ch.name, series: ch.series })) playBakaSound();
                      setSelected(selected === ch.id ? null : ch.id);
                    }}
                    className={`group flex flex-col overflow-hidden rounded-xl border-2 transition-all text-center bg-white hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                      selected === ch.id ? "border-purple-500 shadow-lg shadow-purple-200/30" : "border-gray-100 hover:border-purple-300"
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                      {/* skeleton pulse behind image */}
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-purple-100 to-pink-100" aria-hidden />
                      <img
                        src={getCharacterImageWithGender(ch.name, ch.gender, ch.imageUrl)}
                        alt={`${ch.name} from ${ch.series}`}
                        className="relative w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{ch.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{ch.series}</p>
                      <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium ${ch.gender === "waifu" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}>
                        {ch.gender === "waifu" ? "👧 Waifu" : "👦 Husbando"}
                      </span>
                      <Link href={`/character/${ch.id}`} className="block mt-2 text-[11px] text-purple-600 hover:text-purple-800 font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded" onClick={(e) => e.stopPropagation()}>
                        View Profile →
                      </Link>
                    </div>
                  </button>
                  {(idx + 1) % 8 === 0 && idx !== shown.length - 1 && (
                    <div className="col-span-2 sm:col-span-3 md:col-span-4">
                      <AdBannerWaifu />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
            {visible < filtered.length && (
              <div className="text-center mt-6">
                <button onClick={() => setVisible(v => Math.min(v + 24, filtered.length))} className="px-6 py-3 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400">
                  Load 24 more — {filtered.length - visible} remaining
                </button>
                <p className="text-xs text-gray-400 mt-2">Showing {shown.length} of {filtered.length}</p>
              </div>
            )}
            {filtered.length > 48 && visible >= filtered.length && (
              <p className="text-center text-xs text-gray-400 mt-6">Showing all {filtered.length} characters</p>
            )}
          </div>

          {/* Character Detail Panel */}
          {selectedChar && (
            <div className="lg:w-1/2 animate-fade-in-up">
              <div className="bg-white sticky top-[72px] rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 p-6 text-center">
                  <div className="w-32 h-40 mx-auto rounded-2xl border-4 border-white/40 overflow-hidden shadow-xl bg-white/10">
                    <img
                      src={getCharacterImageWithGender(selectedChar.name, selectedChar.gender, selectedChar.imageUrl)}
                      alt={`${selectedChar.name} from ${selectedChar.series}`}
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                      decoding="async"
                      onError={(e) => { const img=e.target as HTMLImageElement; img.style.display='none'; img.parentElement!.innerHTML=`<span class="text-5xl flex items-center justify-center h-full">${selectedChar.emoji}</span>`; }}
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-3">{selectedChar.name}</h2>
                  <p className="text-purple-200">🎬 {selectedChar.series}</p>
                  <span className="inline-block mt-2 text-xs bg-white/20 rounded-full px-3 py-1 text-white">{selectedChar.personality}</span>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">📖 About</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{selectedChar.description}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">💞 Who's Compatible?</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{selectedChar.matchReason}</p>
                  </div>
                  <Link href={`/character/${selectedChar.id}`} className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400">
                    🌟 View Full Profile Page
                  </Link>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">🧠 Personality Profile</h3>
                    <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                      {[
                        { label: selectedChar.traits.e < 0 ? "Introvert" : "Extrovert", val: Math.abs(selectedChar.traits.e), color: "bg-purple-500" },
                        { label: selectedChar.traits.l < 0 ? "Heart" : "Logic", val: Math.abs(selectedChar.traits.l), color: "bg-pink-500" },
                        { label: selectedChar.traits.v < 0 ? "Serious" : "Playful", val: Math.abs(selectedChar.traits.v), color: "bg-blue-500" },
                        { label: selectedChar.traits.p < 0 ? "Relaxed" : "Driven", val: Math.abs(selectedChar.traits.p), color: "bg-amber-500" },
                        { label: selectedChar.traits.n < 0 ? "Independent" : "Loyal", val: Math.abs(selectedChar.traits.n), color: "bg-green-500" },
                      ].map((item) => (
                        <div key={item.label} className="p-1.5 bg-gray-50 rounded-lg">
                          <div className={`h-1 rounded-full mb-1 ${item.color}`} style={{ width: `${(item.val / 3) * 100}%` }} />
                          <div className="font-bold text-gray-700 text-[10px]">{item.val.toFixed(1)}</div>
                          <div className="text-gray-400 text-[9px] mt-0.5">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
