"use client";

import { useState } from "react";
import { CHARACTERS } from "@/lib/characters";
import { playBakaSound, isTsundere } from "@/lib/sound-effects";
import { getCharacterImageWithGender } from "@/lib/images";

type FilterType = "all" | "waifu" | "husbando";

export default function CharacterLibrary() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  // Calculate filtered characters on every render (420 items, fast enough)
  console.log('🕵️ Library: search=' + JSON.stringify(search) + ' filter=' + filter + ' chars=' + CHARACTERS.length);
  const filtered = (() => {
    let chars = CHARACTERS;
    if (filter === "waifu") chars = chars.filter(c => c.gender === "waifu");
    if (filter === "husbando") chars = chars.filter(c => c.gender === "husbando");
    if (search.trim()) {
      const q = search.toLowerCase();
      console.log('🔍 filtering with q=' + JSON.stringify(q));
      chars = chars.filter(c => {
        const match = c.name.toLowerCase().includes(q) || c.series.toLowerCase().includes(q);
        if (match && !c.name.toLowerCase().includes(q)) console.log('  MATCH by series: ' + c.name + ' (' + c.series + ') q=' + q);
        if (match && !c.series.toLowerCase().includes(q)) console.log('  MATCH by name: ' + c.name + ' (' + c.series + ') q=' + q);
        return match;
      });
      console.log('🔍 filtered result count=' + chars.length);
    }
    return chars;
  })();

  const selectedChar = selected ? CHARACTERS.find(c => c.id === selected) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        📚 Character Library
      </h1>
      <p className="text-gray-500 mb-6">
        Browse all {CHARACTERS.length} characters and see who's compatible with you!
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex gap-2">
          {[
            { key: "all" as FilterType, label: "✨ All", cls: "bg-purple-600" },
            { key: "waifu" as FilterType, label: "👧 Waifus", cls: "bg-pink-600" },
            { key: "husbando" as FilterType, label: "👦 Husbandos", cls: "bg-blue-600" },
          ].map(({ key, label, cls }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === key
                  ? `${cls} text-white shadow-md`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search characters or series..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
        />
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Character Grid */}
        <div className={`grid gap-3 ${selectedChar ? "lg:w-1/2" : "w-full"} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${selectedChar ? "lg:grid-cols-2" : ""}`}>
          {filtered.map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                if (isTsundere({ name: ch.name, series: ch.series })) {
                  playBakaSound();
                }
                setSelected(selected === ch.id ? null : ch.id);
              }}
              className={`group p-4 rounded-2xl border-2 transition-all text-center ${
                selected === ch.id
                  ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-200/30"
                  : "border-gray-100 bg-white hover:border-purple-300 hover:shadow-md"
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden border-2 border-gray-200">
                <img
                  src={getCharacterImageWithGender(ch.name, ch.gender, ch.imageUrl)}
                  alt={ch.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">{ch.name}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{ch.series}</p>
              <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${
                ch.gender === "waifu" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"
              }`}>
                {ch.gender === "waifu" ? "👧 Waifu" : "👦 Husbando"}
              </span>
            </button>
          ))}
        </div>

        {/* Character Detail Panel */}
        {selectedChar && (
          <div className="lg:w-1/2 animate-fade-in-up">
            <div className="bg-white sticky top-24 rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 p-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-white/40 overflow-hidden shadow-xl bg-white/10">
                  <img
                    src={getCharacterImageWithGender(selectedChar.name, selectedChar.gender, selectedChar.imageUrl)}
                    alt={selectedChar.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <h2 className="text-2xl font-bold text-white mt-3">{selectedChar.name}</h2>
                <p className="text-purple-200">🎬 {selectedChar.series}</p>
                <span className="inline-block mt-2 text-xs bg-white/20 rounded-full px-3 py-1 text-white">
                  {selectedChar.personality}
                </span>
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
    </div>
  );
}
