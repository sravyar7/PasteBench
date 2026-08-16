'use client';

/**
 * Last-resort boundary. This one replaces the entire document — the root
 * layout is what failed — so it carries its own html and body, and cannot
 * use the design tokens or any shared component.
 *
 * Styles are inline and duplicated on purpose: reaching for the stylesheet
 * here would depend on the thing that just broke.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#0a0a0a',
          color: '#fafaf9',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <main style={{ maxWidth: '32rem' }}>
          <p
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#8d8d95',
              margin: '0 0 1rem',
            }}
          >
            Something went wrong
          </p>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 560,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              margin: '0 0 1rem',
            }}
          >
            The page failed to load.
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: '#a1a1aa',
              margin: '0 0 2rem',
            }}
          >
            This is our fault, not yours. Nothing you typed was sent anywhere —
            the tools run entirely on your device, so there was never anything
            for us to receive or lose.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                height: '2.375rem',
                padding: '0 1rem',
                borderRadius: '0.625rem',
                border: 0,
                background: '#fafaf9',
                color: '#0a0a0a',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                height: '2.375rem',
                padding: '0 1rem',
                borderRadius: '0.625rem',
                border: '1px solid #383838',
                color: '#fafaf9',
                fontSize: 13,
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              All tools
            </a>
          </div>
          {error.digest && (
            <p
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                fontSize: 11,
                color: '#8d8d95',
                marginTop: '2.5rem',
              }}
            >
              Reference: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
