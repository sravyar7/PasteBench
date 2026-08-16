import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CommandPalette from '@/components/shared/CommandPalette';
import ServiceWorker from '@/components/shared/ServiceWorker';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { TOOLS } from '@/lib/tools';
import { SITE_URL } from '@/lib/site';
import { BRAND } from '@/lib/brand';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-code',
  display: 'swap',
});

// Derived, so adding a tool can't leave a stale count in the title.
const TITLE = `${BRAND} — ${TOOLS.length} utilities that run in your browser`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Child pages set a bare title; the template appends the brand.
  title: {
    default: TITLE,
    template: `%s · ${BRAND}`,
  },
  description:
    'Formatters, encoders, converters and generators for everyday development work. Nothing uploads, nothing is stored, and there is no account to make.',
  // Search Console's HTML-tag verification. Set the env var to the content
  // value Google gives you; omitted entirely when unset.
  verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }
    : undefined,
  keywords:
    'json formatter, base64 encoder, url encoder, regex tester, qr code generator, word counter, color converter, developer tools',
  openGraph: {
    title: TITLE,
    description:
      'Formatters, encoders, converters and generators for everyday development work. Nothing uploads, nothing is stored.',
    type: 'website',
  },
};

// Applied before first paint so the correct theme is already on <html>.
const THEME_SCRIPT = `
try {
  var stored = localStorage.getItem('theme');
  var dark = stored ? stored === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  if (dark) document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const hasAdsense = adsenseId && adsenseId !== 'ca-pub-0000000000000000';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {hasAdsense && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans bg-canvas text-ink flex flex-col min-h-screen`}
      >
        {/* Visible only once focused, so keyboard users can jump the
            header instead of tabbing it on every page. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:btn focus:btn-primary"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 w-full">
          {children}
        </main>
        <Footer />
        <CommandPalette />
        <ServiceWorker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
