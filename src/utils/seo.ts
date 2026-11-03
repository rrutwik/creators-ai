// Single source of truth for site-wide SEO values.
// index.html carries the same defaults for crawlers that do not run JavaScript.
import type { GuidePageContent } from "../content/guides";

export const SITE_URL ="https://creatorsai.techkarmic.com";
export const SITE_NAME = "CreatorsAI";
export const DEFAULT_TITLE = "CreatorsAI - Connect with AI Spiritual Guides & Deities";
export const DEFAULT_DESCRIPTION =
  "Chat with AI spiritual guides inspired by Krishna, Shiva, Jesus, Ganesha and Buddha for daily wisdom and mindfulness. Free credits to start.";
export const DEFAULT_KEYWORDS =
  "spiritual chatbot, AI krishna, AI jesus, AI buddha, chat with deities, Gita AI, religious wisdom, mindfulness, spiritual guides, creatorsai";
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
export const DEFAULT_ROBOTS = "index, follow, max-image-preview:large";
export const NOINDEX_ROBOTS = "noindex, nofollow";

/** Last substantive edit of the landing page copy, used for the sitemap's lastmod (bump when the text changes). */
export const LANDING_UPDATED = "2026-11-03";

export const FAQ_COUNT = 4;

export interface Faq {
  q: string;
  a: string;
}

/** Landing page FAQ pairs from the i18n keys landing.faq.q1..q4 / a1..a4. */
export const getFaqs = (t: (key: string) => string): Faq[] =>
  Array.from({ length: FAQ_COUNT }, (_, i) => ({
    q: t(`landing.faq.q${i + 1}`),
    a: t(`landing.faq.a${i + 1}`),
  }));

// Structured data for the landing page. There is deliberately no aggregateRating: we have no real review data to back it.
// Used by LandingPage (client) and by scripts/prerender.mjs (build time), so both emit the same JSON-LD.
export const buildLandingSchema = (faqs: Faq[]) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icons/icon-512x512.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      url: SITE_URL,
      operatingSystem: "Web, Android, iOS",
      applicationCategory: "LifestyleApplication",
      description: DEFAULT_DESCRIPTION,
      offers: { "@type": "Offer", price: "0.00", priceCurrency: "INR" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
});

/** WebPage + BreadcrumbList + FAQPage for a /guides/<slug> page. Shared by the page (client) and the build-time prerender. */
export const buildGuideSchema = (guide: GuidePageContent) => {
  const url = `${SITE_URL}/guides/${guide.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: guide.title,
        description: guide.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        dateModified: guide.updated,
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: guide.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
};

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : path.replace(/\/+$/, "")}`;
