// Post-build step: gives every public page real HTML, its own <head> tags and JSON-LD, and writes the sitemap,
// so crawlers and link scrapers that do not run JavaScript still see the content. The browser bundle then replaces
// the HTML (main.tsx uses createRoot, not hydrateRoot), so there is no hydration mismatch to worry about.
//
// How: bundle src/entry-server.tsx for Node with Vite's SSR build, then for each route from listRoutes():
//   "/"               -> dist/index.html
//   "/guides/<slug>"  -> dist/guides/<slug>/index.html   (static hosts serve these without any rewrite rule)
// The sitemap is written from the same route list, so it can never drift from the pages that exist.
// No headless browser is needed.
import { build } from "vite";
import react from "@vitejs/plugin-react-swc";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = process.cwd();
const ssrOutDir = path.join(root, "node_modules", ".prerender");
const distDir = path.join(root, "dist");

await build({
  configFile: false,
  root,
  logLevel: "warn",
  plugins: [react()],
  build: {
    ssr: path.join(root, "src", "entry-server.tsx"),
    outDir: ssrOutDir,
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
  },
});

const entry = await import(pathToFileURL(path.join(ssrOutDir, "entry-server.js")).href);
const template = await readFile(path.join(distDir, "index.html"), "utf8");

const escapeAttr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeText = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// Replace the content of one tag in the template, and fail loudly if the tag is not there
// (a silent miss would ship a page with another page's title).
function replaceOnce(source, pattern, replacement, label) {
  if (!pattern.test(source)) throw new Error(`prerender: could not find ${label} in dist/index.html`);
  return source.replace(pattern, () => replacement);
}

function buildPage(page) {
  let out = template;

  const marker = /<!--app-html-->[\s\S]*?<!--\/app-html-->/;
  out = replaceOnce(out, marker, page.html, "<!--app-html--> markers");

  out = replaceOnce(out, /<title>[\s\S]*?<\/title>/, `<title>${escapeText(page.title)}</title>`, "<title>");
  out = replaceOnce(out, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeAttr(page.description)}">`, "meta description");
  out = replaceOnce(out, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${page.url}">`, "canonical link");
  out = replaceOnce(out, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${page.url}">`, "og:url");
  out = replaceOnce(out, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeAttr(page.title)}">`, "og:title");
  out = replaceOnce(out, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeAttr(page.description)}">`, "og:description");
  out = replaceOnce(out, /<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeAttr(page.title)}">`, "twitter:title");
  out = replaceOnce(out, /<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeAttr(page.description)}">`, "twitter:description");

  // "<" is escaped so the JSON can never close the script tag.
  const json = JSON.stringify(page.schema).replace(/</g, "\\u003c");
  const ldScript = `<script id="dynamic-seo-schema" type="application/ld+json">${json}</script>`;
  out = replaceOnce(out, /<\/head>/, `  ${ldScript}\n</head>`, "</head>");

  return out;
}

const pages = entry.listRoutes().map((route) => entry.render(route));

for (const page of pages) {
  const file = page.path === "/" ? path.join(distDir, "index.html") : path.join(distDir, page.path, "index.html");
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, buildPage(page));
  console.log(`prerender: ${page.path.padEnd(48)} ${String(page.html.length).padStart(6)} chars of HTML`);
}

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages
    .map(
      (page) =>
        `  <url>\n    <loc>${page.url}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n    <priority>${page.path === "/" ? "1.0" : "0.8"}</priority>\n  </url>`
    )
    .join("\n") +
  `\n</urlset>\n`;
await writeFile(path.join(distDir, "sitemap.xml"), sitemap);
console.log(`prerender: sitemap.xml with ${pages.length} URLs`);

await rm(ssrOutDir, { recursive: true, force: true });
