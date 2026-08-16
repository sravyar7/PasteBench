import { ImageResponse } from 'next/og';
import { getPost, formatDate } from '@/lib/posts';
import { BRAND, MONOGRAM } from '@/lib/brand';

export const runtime = 'edge';

/** Share card for an article. Without it, a shared post previews blank. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPost(slug);

  const title = post?.title ?? BRAND;
  const description = post?.description ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0a0a',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#fafaf9',
              color: '#0a0a0a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {MONOGRAM}
          </div>
          <div style={{ color: '#fafaf9', fontSize: 26, fontWeight: 500 }}>
            {BRAND}
          </div>
          <div
            style={{
              marginLeft: 'auto',
              color: '#a1a1aa',
              fontSize: 20,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            Article
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div
            style={{
              color: '#fafaf9',
              // Long headlines need to step down or they overflow the card.
              fontSize: title.length > 44 ? 56 : 68,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: '#a1a1aa',
              fontSize: 26,
              lineHeight: 1.4,
              maxWidth: 940,
            }}
          >
            {description.length > 120
              ? description.slice(0, 117) + '…'
              : description}
          </div>
        </div>

        {/* Built as a flat array rather than a conditional fragment: Satori
            requires an explicit display on any element with more than one
            child, and a fragment slipped past that check at build time and
            failed at request time instead. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {(post
            ? [formatDate(post.published), '·', `${post.minutes} min read`]
            : [BRAND]
          ).map((text, i) => (
            <div
              key={i}
              style={{ color: text === '·' ? '#3f3f46' : '#a1a1aa', fontSize: 22 }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Deterministic per URL, so let the CDN and social scrapers keep it.
      // Set here rather than in next.config so it replaces the framework
      // default instead of arriving alongside it as a second header.
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
    }
  );
}
