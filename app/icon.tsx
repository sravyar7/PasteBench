import { ImageResponse } from 'next/og';
import { MONOGRAM } from '@/lib/brand';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

/** App icon, generated so there's no binary asset to keep in sync. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#fafaf9',
          fontSize: 210,
          fontWeight: 700,
          letterSpacing: -10,
          fontFamily: 'sans-serif',
        }}
      >
        {MONOGRAM}
      </div>
    ),
    size
  );
}
