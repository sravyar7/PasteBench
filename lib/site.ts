/**
 * The site's absolute origin, used for canonical URLs and the sitemap.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL — set this once a custom domain is live.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel on every build and
 *     always the production domain, so deployments are correct with no setup.
 *  3. localhost, for `next dev`.
 *
 * Never guess a public domain here. A canonical tag pointing at a host you
 * do not own tells Google the real copy of the page lives somewhere else,
 * which is a fast way to have your own pages dropped from the index.
 *
 * Server-only: VERCEL_* are not exposed to the browser, so this module must
 * not be imported by a client component.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`;

  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();
