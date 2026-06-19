// Static files in public/ are served automatically on Vercel.
// This script is kept as a no-op for compatibility (previously used for static export).
const fs = require("fs");
const path = require("path");

const files = ["ads.txt", "robots.txt", "sitemap.xml", "og-image.png"];
const outDir = path.join(__dirname, "..", "out");

// Only copy if out/ exists (static export mode)
if (fs.existsSync(outDir)) {
  for (const file of files) {
    const src = path.join(__dirname, "..", "public", file);
    const dest = path.join(__dirname, "..", "out", file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Copied ${file} to out/`);
    }
  }
} else {
  console.log("ℹ️  Static files served from public/ (no out/ directory needed on Vercel)");
}
