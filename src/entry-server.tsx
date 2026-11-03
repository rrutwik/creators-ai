// Build-time only: scripts/prerender.mjs bundles this file for Node and calls render().
// It is never part of the browser bundle.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import i18n from "./i18n";
import { LandingPage } from "./features/landing/LandingPage";
import { buildLandingSchema, getFaqs } from "./utils/seo";

export function render() {
  void i18n.changeLanguage("en");
  const html = renderToString(
    <StaticRouter location="/">
      <LandingPage user={null} onLogout={() => {}} theme="light" setTheme={() => {}} />
    </StaticRouter>
  );
  const schema = buildLandingSchema(getFaqs((key) => i18n.t(key)));
  return { html, schema };
}
