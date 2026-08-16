import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Offline',
  description: 'You are offline. Tools you have already opened still work.',
  robots: { index: false, follow: false },
};

export default function Offline() {
  return (
    <div className="max-w-xl mx-auto w-full px-5 sm:px-6 py-24">
      <p className="eyebrow mb-4">No connection</p>
      <h1 className="headline text-[2rem] mb-5">You’re offline.</h1>
      <p className="text-ink-muted text-[15px] leading-relaxed mb-8">
        This page hasn’t been cached yet. Any tool you’ve opened before will
        still work exactly as normal — they run on your device, not on a
        server, so losing the network doesn’t stop them.
      </p>
      <Link href="/" className="btn btn-primary">
        Back to the tools
      </Link>
    </div>
  );
}
