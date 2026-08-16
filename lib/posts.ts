/**
 * Article registry.
 *
 * Each post lives at app/blog/<slug>/page.tsx and reads its metadata from
 * here, so the index, the sitemap, the feed, and the page itself can never
 * disagree about a title or a date.
 *
 * Posts exist to be worth reading on their own. A page that only restates
 * what a tool does earns nothing — the ones here answer a question people
 * genuinely hit, and link to the relevant tool because it happens to help,
 * not the other way round.
 */

export type Post = {
  slug: string;
  title: string;
  description: string;
  /** ISO date. Written by hand so it reflects publication, not deploy. */
  published: string;
  updated?: string;
  /** Rough minutes, used in the listing. */
  minutes: number;
  /** Tool ids the piece refers to, for cross-linking. */
  tools: string[];
};

export const POSTS: Post[] = [
  {
    slug: 'why-compressed-images-get-bigger',
    title: 'Why your “compressed” image came out bigger',
    description:
      'Compressing a screenshot as JPEG can double its size. The reason is what each format assumes about the picture you gave it.',
    published: '2026-08-16',
    minutes: 6,
    tools: ['image-compressor'],
  },
  {
    slug: 'base64-is-not-encryption',
    title: 'Base64 is not encryption',
    description:
      'It has no key, hides nothing, and makes data a third larger. Here is what it is actually for, and the mistakes that follow from confusing the two.',
    published: '2026-08-16',
    minutes: 5,
    tools: ['base64-encoder', 'hash-generator'],
  },
  {
    slug: 'json-rules-that-trip-people-up',
    title: 'The JSON rules that trip everyone up',
    description:
      'Trailing commas, single quotes, comments, NaN. JSON looks like JavaScript and is much stricter, and the parser error rarely says so.',
    published: '2026-08-16',
    minutes: 7,
    tools: ['json-formatter', 'json-to-csv'],
  },
  {
    slug: 'reading-a-jwt',
    title: 'What is actually inside a JWT',
    description:
      'Three base64 segments, one signature, and a lot of confusion about which part proves what. A short tour, and why decoding is not verifying.',
    published: '2026-08-16',
    minutes: 8,
    tools: ['jwt-decoder', 'base64-encoder', 'timestamp-converter'],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

/** Newest first, which is how both the index and the feed want them. */
export const postsByDate = () =>
  livePosts().sort((a, b) => b.published.localeCompare(a.published));

/**
 * Scheduling.
 *
 * A `published` date in the future holds the post back: it stays out of the
 * index, the sitemap, and the feed, and its page is marked noindex until
 * the date arrives. That allows a genuine publication cadence — write
 * several, release them weekly — without backdating anything, which would
 * put a false claim into the BlogPosting schema and the RSS feed.
 *
 * The comparison is date-only in UTC, so a post dated today is live
 * regardless of the reader's timezone.
 *
 * One caveat worth knowing: pages are prerendered, so a scheduled post
 * appears at the next build rather than at midnight on its own. A daily
 * Vercel deploy hook covers that if you start using it.
 */
const today = () => new Date().toISOString().slice(0, 10);

export const isLive = (post: Post) => post.published <= today();

export const livePosts = () => POSTS.filter(isLive);

export const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
