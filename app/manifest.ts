import type { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';
import { BRAND } from '@/lib/brand';

/**
 * Installable app manifest.
 *
 * Every tool is client-side JavaScript, so once the assets are cached the
 * whole site genuinely works with no network — which is worth advertising
 * rather than leaving as an accident of the architecture.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND,
    short_name: BRAND,
    description: `${TOOLS.length} formatters, encoders, and converters that run in your browser. No account, nothing uploaded.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    categories: ['utilities', 'developer', 'productivity'],
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      { name: 'JSON Formatter', url: '/tools/developer/json-formatter' },
      { name: 'Base64', url: '/tools/developer/base64-encoder' },
      { name: 'Word Counter', url: '/tools/content/word-counter' },
      { name: 'QR Code', url: '/tools/image/qr-code-generator' },
    ],
  };
}
