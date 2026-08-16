/**
 * The site's name, in one place.
 *
 * It was previously written out in 29 spots across 18 files — the header,
 * the footer, every share card, the manifest, the RSS channel, the schema
 * publisher, and the prose of the privacy policy. Renaming meant finding
 * all of them and missing some.
 *
 * Safe to import from client components: no environment variables here.
 * The origin lives in lib/site.ts, which is server-only.
 */
export const BRAND = 'PasteBench';

/**
 * The square logo mark. Derived from the capitals in BRAND so it follows a
 * rename automatically — "OnlineTools" gives OT, "PasteBench" gives PB —
 * with the first two letters as a fallback for an all-lowercase name.
 */
export const MONOGRAM = (() => {
  const capitals = BRAND.replace(/[^A-Z]/g, '');
  if (capitals.length >= 2) return capitals.slice(0, 2);
  return BRAND.slice(0, 2).toUpperCase();
})();

/** Used wherever the name needs a following noun, e.g. the RSS channel. */
export const BRAND_ARTICLES = `${BRAND} Articles`;
