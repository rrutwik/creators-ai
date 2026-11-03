// Post-build step: puts the landing page's real HTML and JSON-LD into dist/index.html so crawlers and
// link scrapers that do not run JavaScript still see the content. The browser bundle then replaces it
// (main.tsx uses createRoot, not hydrateRoot), so there is no hydration mismatch to worry about.
//
// How: bundle src/entry-server.tsx for Node with Vite's SSR build, call render(), then splice the result
// into the marked block in dist/index.html. No headless browser is needed.
import { build } from "vite";
import react from "@vitejs/plugin-react-swc";
import { readFile, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = process.cwd();
const ssrOutDir = path.join(root, "node_modules", ".prerender");
const distHtml = path.join(root, "dist", "index.html");

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
const { html, schema } = entry.render();

let page = await readFile(distHtml, "utf8");

const marker = /<!--app-html-->[\s\S]*?<!--\/app-html-->/;
if (!marker.test(page)) {
  throw new Error("prerender: <!--app-html--> markers not found in dist/index.html");
}
page = page.replace(marker, () => html);

// "<" is escaped so the JSON can never close the script tag.
const json = JSON.stringify(schema).replace(/</g, "\\u003c");
const ldScript = `<script id="dynamic-seo-schema" type="application/ld+json">${json}</script>`;
page = page.replace("</head>", () => `  ${ldScript}\n</head>`);

await writeFile(distHtml, page);
await rm(ssrOutDir, { recursive: true, force: true });

console.log(`prerender: wrote landing page (${html.length} chars of HTML) into dist/index.html`);
