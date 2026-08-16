'use client';

import { useEffect } from 'react';

interface AdContainerProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
}

declare global {
  interface Window {
    // A plain queue until adsbygoogle.js loads and takes it over.
    adsbygoogle?: unknown[];
  }
}

// Inlined at build time, so this reads the same on the server and in the
// browser. Deciding it per-environment instead would render nothing into
// the HTML and an <ins> on the client, which fails hydration.
const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const HAS_CLIENT_ID = Boolean(
  CLIENT_ID && CLIENT_ID !== 'ca-pub-0000000000000000'
);

export default function AdContainer({ slot = '0000000000', format = 'auto' }: AdContainerProps) {
  useEffect(() => {
    if (!HAS_CLIENT_ID) return;
    try {
      // Queues the slot whether or not the script has loaded: adsbygoogle is
      // an array until then, and the script drains it on arrival. Waiting for
      // the script instead would leave slots empty when consent is given
      // after the page has already rendered.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // A blocked or failed script shouldn't take the page down.
    }
  }, [slot]);

  if (!HAS_CLIENT_ID) {
    return null;
  }

  return (
    <div className="panel-sunken p-4 min-h-[250px] flex items-center justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
