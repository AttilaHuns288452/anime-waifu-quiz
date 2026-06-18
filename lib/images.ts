"use client";

// Get avatar URL for any character - guaranteed 100% coverage
// Real AniList photo if available, otherwise DiceBear generated avatar
export function getCharacterImage(name: string, realImageUrl?: string): string {
  if (realImageUrl) return realImageUrl;
  // DiceBear generates a unique anime-style avatar from any text seed
  // URL-safe encode the name so special characters don't break it
  const seed = encodeURIComponent(name.replace(/\s+/g, '_'));
  // lorelei for waifu-friendly style, or we can offer options
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,ffd5dc,ffdfbf,d1d4f9`;
}

export function getCharacterImageWithGender(name: string, gender: string, realImageUrl?: string): string {
  if (realImageUrl) return realImageUrl;
  const seed = encodeURIComponent(name.replace(/\s+/g, '_'));
  if (gender === 'husbando') {
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=d1d4f9,c0aede,b6e3f4`;
  }
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,ffd5dc,ffdfbf`;
}
