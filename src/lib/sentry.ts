// Sentry, loaded after the page instead of with it.
//
// Importing @sentry/react statically put roughly 880 KB of source (core, session replay, browser utils) into the
// main bundle, all of which had to download and run before the page could paint. This module keeps the same
// capture* API the rest of the app already uses, but pulls Sentry in with a dynamic import once the page has
// loaded. Anything captured before that is queued and sent once Sentry is ready, so no error is dropped.
//
// Not captured: errors thrown in the short window before the page's load event (nothing is listening yet).

type SentryModule = typeof import("@sentry/react");

let sentry: SentryModule | null = null;
let loading: Promise<SentryModule> | null = null;
const queue: Array<(s: SentryModule) => void> = [];

export function initSentry(): Promise<SentryModule> {
  loading ??= import("@sentry/react").then((mod) => {
    mod.init({
      dsn: "https://6b2849f870a9dff3b140c21831846a83@o4507185345527808.ingest.us.sentry.io/4509979759083520",
      integrations: [
        mod.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
        mod.browserTracingIntegration(),
        mod.replayIntegration(),
      ],
      sendDefaultPii: true,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      tracesSampleRate: 1.0,
      enableLogs: true,
    });
    sentry = mod;
    queue.splice(0).forEach((fn) => fn(mod));
    return mod;
  });
  return loading;
}

/** Start loading Sentry once the page has finished loading (and the browser is idle, when it can tell). */
export function initSentryWhenIdle() {
  const start = () => {
    const kick = () => void initSentry();
    if ("requestIdleCallback" in window) {
      (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(kick, { timeout: 4000 });
    } else {
      setTimeout(kick, 1500);
    }
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}

function run(fn: (s: SentryModule) => void) {
  if (sentry) {
    fn(sentry);
    return;
  }
  queue.push(fn);
  void initSentry(); // an error happened: do not wait for idle
}

export const captureException = (...args: Parameters<SentryModule["captureException"]>) =>
  run((s) => void s.captureException(...args));

export const captureEvent = (...args: Parameters<SentryModule["captureEvent"]>) =>
  run((s) => void s.captureEvent(...args));

export const captureMessage = (...args: Parameters<SentryModule["captureMessage"]>) =>
  run((s) => void s.captureMessage(...args));
