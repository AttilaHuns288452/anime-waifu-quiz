import Link from "next/link";

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 prose prose-gray">
      <h1>About Anime Match</h1>
      <p>
        <strong>Anime Match</strong> is a fun personality quiz that helps you discover which anime
        waifu or husbando matches your real personality. Answer 20 short questions, and we&apos;ll
        match you with one of <strong>420+ characters</strong> from Naruto, Attack on Titan, 
        Jujutsu Kaisen, Demon Slayer, and dozens more series.
      </p>

      <h2>How It Works</h2>
      <p>
        Each answer shifts your personality profile across five axes (extroversion, logic vs heart,
        playfulness, drive, and loyalty). We compare your profile against every character&apos;s
        archetype and rank them by compatibility. No accounts, no data collection — everything
        runs in your browser.
      </p>

      <h2>Our Goal</h2>
      <p>
        We love anime and wanted to create a lighthearted, fun way for fans to engage with their
        favorite characters. This is a fan project for entertainment purposes — results are not
        scientific and should be taken with a grain of fun!
      </p>

      <h2>Content Disclaimer</h2>
      <p>
        All character names, series titles, and related imagery are trademarks of their respective
        owners. This is an unofficial fan project and is not affiliated with or endorsed by any
        anime studio or publisher. Character portrait images are procedurally generated avatars and
        not official artwork.
      </p>

      <h2>Contact</h2>
      <p>
        Have questions, suggestions, or want to report an issue? Email us at:
        <br />
        <strong>admin@animewaifuquiz.xyz</strong>
      </p>
      <p>
        Or use our <Link href="/feedback" className="text-purple-600 underline">Feedback form</Link>.
      </p>
    </div>
  );
}
