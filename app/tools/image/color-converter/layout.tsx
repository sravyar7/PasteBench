import type { Metadata } from 'next';
import { buildToolMetadata, ToolSchema, BreadcrumbSchema } from '@/lib/toolPage';
import RecordVisit from '@/components/shared/RecordVisit';
import ToolFaqs from '@/components/shared/ToolFaqs';
import RelatedTools from '@/components/shared/RelatedTools';

export const metadata: Metadata = buildToolMetadata('color-converter');

/**
 * The tool itself is a client component; everything around it is server
 * rendered so the schema, questions, and cross-links are all in the HTML
 * a crawler receives.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolSchema id="color-converter" />
      <BreadcrumbSchema id="color-converter" />
      <RecordVisit id="color-converter" />
      {children}
      <div className="mt-12 space-y-12">
        <ToolFaqs id="color-converter" />
        <RelatedTools current="color-converter" />
      </div>
    </>
  );
}
