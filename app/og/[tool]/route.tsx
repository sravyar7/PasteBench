import { ImageResponse } from 'next/og';
import { getTool, categoryName } from '@/lib/tools';
import { BRAND, MONOGRAM } from '@/lib/brand';

export const runtime = 'edge';

/**
 * Share card for a tool, addressed explicitly from the page's metadata.
 *
 * The tool pages live in static directories (app/tools/developer/…), so a
 * dynamic `opengraph-image` segment never matches them — a static path
 * takes precedence and the image silently goes missing. Serving it from
 * one addressable route avoids duplicating a file into all 24 folders.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tool: string }> }
) {
  const { tool: toolId } = await params;
  const tool = getTool(toolId);

  const name = tool?.name ?? BRAND;
  const description =
    tool?.description ?? 'Utilities that run in your browser';
  const label = tool ? categoryName(tool.category) : 'Tools';

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
            {label}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              color: '#fafaf9',
              fontSize: 76,
              fontWeight: 600,
              letterSpacing: -2.5,
              lineHeight: 1.05,
            }}
          >
            {name}
          </div>
          <div
            style={{
              color: '#a1a1aa',
              fontSize: 30,
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            {description}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ color: '#a1a1aa', fontSize: 22 }}>Free</div>
          <div style={{ color: '#3f3f46', fontSize: 22 }}>·</div>
          <div style={{ color: '#a1a1aa', fontSize: 22 }}>No account</div>
          <div style={{ color: '#3f3f46', fontSize: 22 }}>·</div>
          <div style={{ color: '#a1a1aa', fontSize: 22 }}>
            Runs in your browser
          </div>
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
