import { useEffect } from "react";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  DEFAULT_KEYWORDS,
  DEFAULT_ROBOTS,
  DEFAULT_TITLE,
  NOINDEX_ROBOTS,
  absoluteUrl,
} from "../../utils/seo";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  /** JSON-LD object, or an array of objects, written into <head>. */
  schema?: Record<string, unknown> | Record<string, unknown>[];
  /** Path of this page, e.g. "/". Used for the canonical link and og:url. */
  path?: string;
  /** Absolute image URL for og:image / twitter:image. */
  image?: string;
  /** Keep the page out of search results (login, app screens, 404). */
  noindex?: boolean;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function applyMeta(p: Required<Pick<SEOProps, "title" | "description" | "keywords" | "image" | "path">> & { robots: string }) {
  const url = absoluteUrl(p.path);
  document.title = p.title;
  setMeta("name", "description", p.description);
  setMeta("name", "keywords", p.keywords);
  setMeta("name", "robots", p.robots);
  setCanonical(url);
  setMeta("property", "og:url", url);
  setMeta("property", "og:title", p.title);
  setMeta("property", "og:description", p.description);
  setMeta("property", "og:image", p.image);
  setMeta("name", "twitter:title", p.title);
  setMeta("name", "twitter:description", p.description);
  setMeta("name", "twitter:image", p.image);
}

export function useSEO({ title, description, keywords = DEFAULT_KEYWORDS, schema, path = "/", image = DEFAULT_IMAGE, noindex = false }: SEOProps) {
  const schemaJson = schema ? JSON.stringify(schema) : "";

  useEffect(() => {
    applyMeta({ title, description, keywords, image, path, robots: noindex ? NOINDEX_ROBOTS : DEFAULT_ROBOTS });

    let script = document.head.querySelector<HTMLScriptElement>('script[id="dynamic-seo-schema"]');
    if (schemaJson) {
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("id", "dynamic-seo-schema");
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = schemaJson;
    } else if (script) {
      script.remove();
    }

    // Restore the site defaults when the page unmounts so the next route never inherits this page's tags.
    return () => {
      applyMeta({
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        keywords: DEFAULT_KEYWORDS,
        image: DEFAULT_IMAGE,
        path: "/",
        robots: DEFAULT_ROBOTS,
      });
      document.head.querySelector('script[id="dynamic-seo-schema"]')?.remove();
    };
  }, [title, description, keywords, schemaJson, path, image, noindex]);
}
