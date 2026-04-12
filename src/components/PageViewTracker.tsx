"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Known hostname fragments used to categorize `document.referrer` into a
// coarse source bucket. Substring match is intentional — `google.` catches
// google.com, google.de, google.co.uk, etc. without enumerating every TLD.
const SEARCH_ENGINE_HOSTS = [
  "google.",
  "bing.",
  "duckduckgo.",
  "ecosia.",
  "startpage.",
  "qwant.",
  "yandex.",
  "baidu.",
  "brave.com",
];

const SOCIAL_HOSTS = [
  "twitter.com",
  "x.com",
  "t.co",
  "facebook.com",
  "fb.com",
  "linkedin.com",
  "lnkd.in",
  "reddit.com",
  "instagram.com",
  "tiktok.com",
  "youtube.com",
  "youtu.be",
  "threads.net",
  "bsky.app",
  "mastodon.",
  "t.me",
  "wa.me",
  "api.whatsapp.com",
];

type Source = "direct" | "internal" | "search" | "social" | "external";

function categorizeReferrer(referrer: string, currentHost: string): Source {
  if (!referrer) return "direct";
  let url: URL;
  try {
    url = new URL(referrer);
  } catch {
    return "external";
  }
  const host = url.hostname.toLowerCase();
  if (host === currentHost) return "internal";
  if (SEARCH_ENGINE_HOSTS.some((s) => host.includes(s))) return "search";
  if (SOCIAL_HOSTS.some((s) => host.includes(s))) return "social";
  return "external";
}

// Tracks page views by firing a fetch to the Convex HTTP mutation endpoint on
// every route mount and every client-side navigation. Uses the same no-
// provider pattern as EmailTemplateViewer so the page works locally when
// NEXT_PUBLIC_CONVEX_URL is unset: the env-var guard short-circuits the fetch
// entirely and the component becomes a no-op.
//
// Anonymous aggregate only — no IP, no user agent, no session ID, no full
// referrer URL — just path + coarse source category + timestamp. GDPR-safe
// by construction.
//
// The `lastTrackedPath` ref serves two purposes:
//   1. Deduplicates React 18 StrictMode double-effect invocations in dev.
//   2. Classifies all post-initial views as "internal" regardless of
//      document.referrer, because document.referrer in a SPA still reflects
//      the original page load — it does not update across client-side
//      <Link> navigations. So "initial view" is the only view where we
//      trust document.referrer.
export default function PageViewTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (lastTrackedPath.current === pathname) return;

    const isInitialView = lastTrackedPath.current === null;
    lastTrackedPath.current = pathname;

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) return;

    const source: Source = isInitialView
      ? categorizeReferrer(document.referrer, window.location.hostname)
      : "internal";

    fetch(`${convexUrl}/api/mutation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "pageTracking:recordPageView",
        args: { path: pathname, source },
        format: "json",
      }),
    }).catch((err) => {
      console.warn("Page view tracking failed (non-fatal):", err);
    });
  }, [pathname]);

  return null;
}
