// Build-time only: scripts/prerender.mjs bundles this file for Node and calls listRoutes() / render().
// It is never part of the browser bundle.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import i18n from "./i18n";
import { LandingPage } from "./features/landing/LandingPage";
import { GuidePage } from "./features/guides/GuidePage";
import { GUIDES } from "./content/guides";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  LANDING_UPDATED,
  SITE_URL,
  buildGuideSchema,
  buildLandingSchema,
  getFaqs,
} from "./utils/seo";

export interface PrerenderedPage {
  path: string;
  url: string;
  title: string;
  description: string;
  lastmod: string;
  html: string;
  schema: unknown;
}

/** Every public, indexable route. The sitemap is generated from this same list. */
export function listRoutes(): string[] {
  return ["/", ...GUIDES.map((g) => `/guides/${g.slug}`)];
}

export function render(path: string): PrerenderedPage {
  void i18n.changeLanguage("en");

  if (path === "/") {
    const html = renderToString(
      <StaticRouter location="/">
        <LandingPage user={null} onLogout={() => {}} theme="light" setTheme={() => {}} />
      </StaticRouter>
    );
    return {
      path,
      url: `${SITE_URL}/`,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      lastmod: LANDING_UPDATED,
      html,
      schema: buildLandingSchema(getFaqs((key) => i18n.t(key))),
    };
  }

  const guide = GUIDES.find((g) => `/guides/${g.slug}` === path);
  if (!guide) throw new Error(`prerender: no page for route ${path}`);

  const html = renderToString(
    <StaticRouter location={path}>
      <GuidePage user={null} slug={guide.slug} />
    </StaticRouter>
  );
  return {
    path,
    url: `${SITE_URL}${path}`,
    title: guide.title,
    description: guide.description,
    lastmod: guide.updated,
    html,
    schema: buildGuideSchema(guide),
  };
}
