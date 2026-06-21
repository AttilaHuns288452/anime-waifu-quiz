// Generate sitemap.xml at build time
// Run with: node scripts/generate-sitemap.js

const fs = require("fs");
const path = require("path");

const BASE_URL = "https://www.animewaifucompatibility.xyz";

// Load all characters for sitemap
const charactersPath = path.join(__dirname, "..", "lib", "characters.ts");
const charactersFile = fs.readFileSync(charactersPath, "utf-8");
const charIds = [...charactersFile.matchAll(/id:\s+"([^"]+)"/g)].map(m => m[1]);
console.log(`Found ${charIds.length} characters for sitemap`);

const STATIC_PAGES = [
  { url: "", changefreq: "weekly", priority: 1.0 },
  { url: "/quiz", changefreq: "weekly", priority: 0.9 },
  { url: "/library", changefreq: "weekly", priority: 0.8 },
  { url: "/recommendations", changefreq: "weekly", priority: 0.7 },
  { url: "/feedback", changefreq: "monthly", priority: 0.5 },
  { url: "/privacy", changefreq: "yearly", priority: 0.3 },
  { url: "/terms", changefreq: "yearly", priority: 0.3 },
];

function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];

  const staticUrls = STATIC_PAGES.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);

  const charUrls = charIds.map(id => `  <url>
    <loc>${BASE_URL}/character/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...charUrls].join("\n")}
</urlset>`;

  const publicPath = path.join(__dirname, "..", "public", "sitemap.xml");
  const outPath = path.join(__dirname, "..", "out", "sitemap.xml");

  fs.writeFileSync(publicPath, sitemap);

  try {
    fs.writeFileSync(outPath, sitemap);
  } catch (e) {
    // out dir may not exist
  }

  console.log(`✅ Sitemap generated: ${STATIC_PAGES.length} static + ${charIds.length} character pages`);
}

generateSitemap();
