import type { Metadata } from 'next';
import SiteSchema from '@/components/shared/SiteSchema';
import HomeContent from '@/components/HomeContent';

/**
 * Server shell. HomeContent reads the query string via useQueryParams,
 * which is plain client state rather than next/navigation, so the whole
 * page prerenders with its real content and needs no Suspense boundary.
 */
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <>
      <SiteSchema />
      <HomeContent />
    </>
  );
}
