'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';

/**
 * Gates the AdSense script behind an explicit choice. The script tag isn't
 * in layout.tsx at all — it's injected here, and only after Accept — so no
 * ad cookie can be set before consent, which is what Google's EU User
 * Consent Policy requires. Declining just means the banner never asks
 * again; AdContainer renders nothing when the script was never loaded.
 *
 * The stored choice is read through useSyncExternalStore rather than an
 * effect: localStorage is unreadable while server-rendering, and the
 * 'unknown' server snapshot keeps the first client render identical to the
 * server's, so nothing is decided — or shown — until after hydration.
 */

const KEY = 'cookie-consent';

type Consent = 'accepted' | 'declined';
type Snapshot = Consent | 'undecided' | 'unknown';

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Keeps a second tab in step once a choice is made in this one.
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function getSnapshot(): Snapshot {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === 'accepted' || stored === 'declined'
      ? stored
      : 'undecided';
  } catch {
    // Private mode: ask again rather than assume consent.
    return 'undecided';
  }
}

function getServerSnapshot(): Snapshot {
  return 'unknown';
}

function store(consent: Consent) {
  try {
    localStorage.setItem(KEY, consent);
  } catch {
    // Ignore; the banner reappears next visit rather than breaking.
  }
  // The storage event doesn't fire in the tab that wrote it.
  listeners.forEach((notify) => notify());
}

function loadAdsenseScript(clientId: string) {
  if (document.querySelector('script[data-consent-adsense]')) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.crossOrigin = 'anonymous';
  script.dataset.consentAdsense = 'true';
  document.head.appendChild(script);
}

export default function CookieConsent({ adsenseId }: { adsenseId: string }) {
  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (consent === 'accepted') loadAdsenseScript(adsenseId);
  }, [consent, adsenseId]);

  if (consent !== 'undecided') return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[150] border-t border-line bg-canvas">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-[13px] text-ink-muted flex-1">
          We use cookies to show and measure ads. Your input into the tools
          never leaves your browser either way — see the{' '}
          <Link href="/privacy" className="underline">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => store('declined')}
            className="btn btn-ghost btn-sm"
          >
            Decline
          </button>
          <button
            onClick={() => store('accepted')}
            className="btn btn-primary btn-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
