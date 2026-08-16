import type { NextConfig } from 'next';

/**
 * Response headers.
 *
 * No Content-Security-Policy here, on purpose. A useful one would need
 * 'unsafe-inline' anyway — the theme script has to run before first paint
 * and every page carries inline JSON-LD — and it would have to whitelist
 * the whole Google ad-serving chain, which redirects across domains that
 * change without notice. A CSP that silently kills the ads, or that is
 * loose enough to permit inline scripts regardless, buys close to nothing
 * on a site with no accounts, no sessions, and no server-side state.
 *
 * The one place untrusted markup reaches innerHTML is the Markdown
 * preview, and that is sanitised with DOMPurify at the point of use, which
 * is the defence that actually applies.
 */
const securityHeaders = [
  // Stop browsers guessing a content type and running a file as script.
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Don't leak the full URL — tool pages can carry ?input= — to other origins.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // Nothing here needs hardware; deny it so a compromised dependency can't ask.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },

  // Framing is refused rather than restricted: no page here is meant to be
  // embedded, and clickjacking a tool that reads the clipboard is a real risk.
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },

  // Two years, subdomains included. Vercel already redirects to HTTPS;
  // this stops the first request going out in plaintext at all.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
