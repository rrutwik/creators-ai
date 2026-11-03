import { Link } from "react-router-dom";
import { SEO } from "../../components/SEO";

export function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <SEO
        title="Page not found - CreatorsAI"
        description="This page does not exist. Go back to CreatorsAI to chat with AI spiritual guides."
        path="/404"
        noindex
      />
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4" aria-hidden="true">🙏</p>
        <h1 className="text-3xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find the page you were looking for.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/95 transition-colors"
        >
          Back to CreatorsAI
        </Link>
      </div>
    </main>
  );
}
