// isTsundere helper for non-client modules
// For the full version with sound effects, use @/lib/sound-effects

export function isTsundere(args?: { archetype?: string; series?: string; name?: string }): boolean {
  const archetype = args?.archetype;
  const series = args?.series;
  const name = args?.name;

  if (archetype) {
    const tsundereArchetypes = ['tsundere_soul', 'tsundere', 'fearless_fighter', 'ice_fire_prince'];
    if (tsundereArchetypes.includes(archetype)) return true;
  }

  if (series) {
    const tsundereSeries = ['Nisekoi', 'Kaguya-sama', 'Toradora', 'Shakugan no Shana', 'Maid-Sama!', 'Koi to Yobu ni wa Kimochi Warui', 'Osananajimi'];
    if (tsundereSeries.includes(series)) return true;
  }

  if (name) {
    const knownTsunderes = [
      'Taiga Aisaka',
      'Chitoge Kirisaki',
      'Misaki Ayuzawa',
      'Kyouko Hori',
      'Shizuku Mizutani',
      'Kirino Kousaka',
      'Louise Françoise Le Blanc',
      'Asuka Langley Soryu',
      'Kagome',
      'Yuno Gasai',
      'Rin Hsien',
      'Itsuomi Nagi',
      'Maki Nishikino',
      'Holo',
    ];
    if (knownTsunderes.includes(name)) return true;
  }

  return false;
}
