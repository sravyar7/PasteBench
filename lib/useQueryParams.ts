'use client';

import { useState, useEffect } from 'react';

/**
 * Reads the URL query string without opting the page out of static HTML.
 *
 * next/navigation's useSearchParams forces everything above it to render
 * on demand, or — inside a Suspense boundary on a prerendered route — makes
 * Next emit the *fallback* into the static HTML. That left 17 tool pages
 * shipping an empty shell: no heading, no description, no content until
 * JavaScript ran. Crawlers and link unfurlers saw nothing.
 *
 * Reading location.search after mount keeps the whole page prerenderable.
 * The trade-off is that a client-side navigation between two URLs that
 * differ only by query string won't re-read — nothing on this site does
 * that, and full HTML for every crawler is worth more.
 *
 * The API matches URLSearchParams so callers keep using .get().
 */
const EMPTY = new URLSearchParams();

export function useQueryParams(): URLSearchParams {
  const [params, setParams] = useState<URLSearchParams>(EMPTY);

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  return params;
}
