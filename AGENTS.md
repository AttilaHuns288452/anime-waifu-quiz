# Anime Waifu Quiz — Hermes Workflow

## Stack
- Next.js 16 (static export: `output: "export"`)
- Tailwind CSS via PostCSS
- TypeScript
- Deployed on Vercel

## Commands
- `npx next build` — build (no dev server, static export only)
- `npx vercel deploy --prod` — deploy (Vercel CLI, token in auth)

## Conventions
- **Images**: DiceBear procedurally-generated avatars only (`lib/images.ts`). No external copyrighted images (AdSense compliance).
- **AdSense**: `ca-pub-4645179646749256` in layout.tsx. `ads.txt` in public/. Privacy & Terms pages required for review.
- **Characters**: 420+ characters in `lib/characters.ts` — `id` auto-generated from name, `imageUrl` field omitted (AdSense rule).
- **Quiz**: 20 questions in `lib/questions.ts`, matching logic in `lib/matching.ts`.
- **Styling**: Tailwind utility classes. Gradients use `from-purple-600 via-pink-500 to-blue-500` palette.

## Pages
- `/` — quiz (main)
- `/quiz` — same quiz
- `/library` — character browser
- `/recommendations` — anime recs by personality
- `/about` — site info
- `/privacy` — privacy policy
- `/terms` — terms of service
- `/feedback` — Google Form embed

## Logo
- Header + favicon: `/logo.png`

## AdSense Review Status
- Copyrighted images removed ✓
- Privacy/About/Terms pages added ✓
- Ready for review request in AdSense Policy Center
