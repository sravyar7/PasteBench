'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Segment-level boundary for the tool pages.
 *
 * Tools run untrusted input through parsers and regexes, so a crash is a
 * question of when. Without this, the whole app falls back to Next's
 * default screen and the user loses the header, the nav, and any sense
 * that the rest of the site still works.
 */
export default function ToolError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Console only — there's no error-reporting backend, and shipping
    // user input off the device would contradict the privacy policy.
    console.error('Tool crashed:', error);
  }, [error]);

  return (
    <div className="max-w-xl py-16">
      <p className="eyebrow mb-4">Something broke</p>
      <h1 className="headline text-[1.75rem] mb-4">This tool hit an error.</h1>
      <p className="text-ink-muted text-[15px] leading-relaxed mb-8">
        Most often this is input the tool didn’t expect. Your data was never
        sent anywhere — it stayed in this tab, and it is gone now that the
        page has reset.
      </p>

      <div className="flex flex-wrap gap-3 mb-10">
        <button onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-secondary">
          All tools
        </Link>
      </div>

      {error.digest && (
        <p className="font-mono text-[11px] text-ink-subtle">
          Reference: {error.digest}
        </p>
      )}
    </div>
  );
}
