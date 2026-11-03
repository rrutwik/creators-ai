import { useSEO } from "./hooks/useSEO";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

/** Renders nothing; sets this route's <head> tags (and restores the defaults on unmount). */
export function SEO(props: SEOProps) {
  useSEO(props);
  return null;
}
