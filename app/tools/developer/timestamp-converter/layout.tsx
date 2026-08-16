import type { Metadata } from 'next';
import { buildToolMetadata, ToolSchema, BreadcrumbSchema } from '@/lib/toolPage';
import RecordVisit from '@/components/shared/RecordVisit';
import ToolFaqs from '@/components/shared/ToolFaqs';
import RelatedTools from '@/components/shared/RelatedTools';

export const metadata: Metadata = buildToolMetadata('timestamp-converter');

/**
 * The tool itself is a client component; everything around it is server
 * rendered so the schema, questions, and cross-links are all in the HTML
 * a crawler receives.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolSchema id="timestamp-converter" />
      <BreadcrumbSchema id="timestamp-converter" />
      <RecordVisit id="timestamp-converter" />
      {children}
      <div className="mt-12 space-y-12">
        <ToolFaqs id="timestamp-converter" />
        <RelatedTools current="timestamp-converter" />
      </div>
    </>
  );
}
