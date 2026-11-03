import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";
import { useSEO } from "../../components/hooks/useSEO";
import { AI_LIMITS_NOTE, GUIDES, getGuideBySlug } from "../../content/guides";
import { buildGuideSchema } from "../../utils/seo";
import { NotFoundPage } from "../misc/NotFoundPage";

interface GuidePageProps {
  user: unknown;
  /** Used by the build-time prerender, which has no router params. */
  slug?: string;
}

export function GuidePage({ user, slug: slugProp }: GuidePageProps) {
  const params = useParams();
  const navigate = useNavigate();
  const guide = getGuideBySlug(slugProp ?? params.slug);

  // Hooks must run on every render, so the fallback values keep useSEO safe when the slug is unknown.
  useSEO({
    title: guide?.title ?? "Guide not found - CreatorsAI",
    description: guide?.description ?? "This guide does not exist.",
    path: guide ? `/guides/${guide.slug}` : "/404",
    schema: guide ? buildGuideSchema(guide) : undefined,
    noindex: !guide,
  });

  if (!guide) return <NotFoundPage />;

  const others = GUIDES.filter((g) => g.slug !== guide.slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between max-w-4xl">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-primary">
            <span aria-hidden="true">🙏</span> CreatorsAI
          </Link>
          <button
            onClick={() => navigate(user ? "/chat" : "/login")}
            className="px-4 py-2 rounded-md text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer"
          >
            {user ? "Open chat" : "Log in"}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-10 md:py-16 max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-primary">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> All guides
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{guide.name}</span>
        </nav>

        <div className="flex items-center gap-3 mb-4">
          <span className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl" aria-hidden="true">
            {guide.avatar}
          </span>
          <p className="text-sm font-semibold text-muted-foreground">
            {guide.name} · {guide.tradition}
          </p>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-balance">{guide.h1}</h1>
        <p className="text-lg text-muted-foreground mb-8">{guide.lead}</p>

        <button
          onClick={() => navigate(user ? "/chat" : "/login")}
          className="px-6 py-3 rounded-md font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-colors inline-flex items-center gap-2 mb-12 cursor-pointer"
        >
          <MessageSquare className="w-5 h-5" aria-hidden="true" />
          Chat with the {guide.name}
        </button>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">About the {guide.tradition} tradition</h2>
          <div className="space-y-4 leading-relaxed text-foreground/90">
            {guide.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{guide.topicsHeading}</h2>
          <ul className="list-disc pl-6 space-y-2">
            {guide.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Questions to start with</h2>
          <ul className="space-y-3">
            {guide.sampleQuestions.map((question) => (
              <li key={question} className="rounded-xl border border-border bg-card px-4 py-3">
                “{question}”
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-muted/40 p-5">
          <h2 className="text-lg font-bold mb-2">What this AI guide is, and is not</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{AI_LIMITS_NOTE}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
          <dl className="space-y-5">
            {guide.faqs.map((faq) => (
              <div key={faq.q}>
                <dt className="font-semibold mb-1">{faq.q}</dt>
                <dd className="text-muted-foreground leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="other-guides">
          <h2 id="other-guides" className="text-2xl font-bold mb-4">
            Other guides
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  to={`/guides/${other.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:bg-muted/60 transition-colors"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span aria-hidden="true" className="text-2xl">{other.avatar}</span>
                    <span className="min-w-0">
                      <span className="block font-semibold truncate">{other.name}</span>
                      <span className="block text-sm text-muted-foreground truncate">{other.tradition}</span>
                    </span>
                  </span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} CreatorsAI. <Link to="/" className="underline">Home</Link>
        </p>
      </footer>
    </div>
  );
}
