import { ImageResponse } from 'next/og';
import { TOOLS } from '@/lib/tools';
import { BRAND, MONOGRAM } from '@/lib/brand';

export const runtime = 'edge';
export const alt = `${BRAND} — utilities that run in your browser`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
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
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#fafaf9',
              fontSize: 78,
              fontWeight: 600,
              letterSpacing: -2.5,
              lineHeight: 1.05,
            }}
          >
            The utilities you
          </div>
          <div
            style={{
              color: '#fafaf9',
              fontSize: 78,
              fontWeight: 600,
              letterSpacing: -2.5,
              lineHeight: 1.05,
            }}
          >
            keep googling.
          </div>
        </div>

        {/* Each cell is one interpolated string. Satori rejects an element
            with more than one child unless display is explicit, and
            `{TOOLS.length} free tools` is two text nodes, not one — which
            failed at request time while the build still reported success. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {[`${TOOLS.length} free tools`, '·', 'No account', '·', 'Nothing uploaded'].map(
            (text, i) => (
              <div
                key={i}
                style={{ color: text === '·' ? '#3f3f46' : '#a1a1aa', fontSize: 24 }}
              >
                {text}
              </div>
            )
          )}
        </div>
      </div>
    ),
    size
  );
}
