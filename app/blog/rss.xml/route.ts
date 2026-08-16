import { postsByDate } from '@/lib/posts';
import { SITE_URL } from '@/lib/site';
import { BRAND_ARTICLES } from '@/lib/brand';

/** XML has five characters that must be escaped inside text nodes. */
const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const dynamic = 'force-static';

export function GET() {
  const posts = postsByDate();
  const updated = posts[0]?.published ?? new Date().toISOString().slice(0, 10);

  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${new Date(p.published + 'T00:00:00Z').toUTCString()}</pubDate>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BRAND_ARTICLES}</title>
    <link>${SITE_URL}/blog</link>
    <description>Notes on image formats, encodings, JSON, tokens, and the mistakes that come with them.</description>
    <language>en</language>
    <lastBuildDate>${new Date(updated + 'T00:00:00Z').toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
