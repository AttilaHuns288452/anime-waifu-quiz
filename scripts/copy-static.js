// Copy static files to out folder after build
const fs = require("fs");
const path = require("path");

const files = ["ads.txt", "robots.txt", "sitemap.xml", "og-image.png"];

const outDir = path.join(__dirname, "..", "out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

for (const file of files) {
  const src = path.join(__dirname, "..", "public", file);
  const dest = path.join(__dirname, "..", "out", file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied ${file} to out/`);
  }
}
