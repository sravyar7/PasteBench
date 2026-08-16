'use client';

import { useEffect } from 'react';

/** Registers the offline worker once the page has settled. */
export default function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Blocked by private mode or an unsupported browser; the site
        // works normally without it.
      });
    };

    // Wait for load so registration never competes with first paint.
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);

  return null;
}
