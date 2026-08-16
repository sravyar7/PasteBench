'use client';

import { useEffect, useMemo } from 'react';

interface AdContainerProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
}

export default function AdContainer({ slot = '0000000000', format = 'auto' }: AdContainerProps) {
  const hasClientId = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    return clientId && clientId !== 'ca-pub-0000000000000000';
  }, []);

  useEffect(() => {
    if (hasClientId && typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        // Ignore AdSense errors
      }
    }
  }, [slot, hasClientId]);

  if (!hasClientId) {
    return null;
  }

  return (
    <div className="panel-sunken p-4 min-h-[250px] flex items-center justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
