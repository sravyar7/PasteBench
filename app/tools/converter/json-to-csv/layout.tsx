import type { Metadata } from 'next';
import { buildToolMetadata, ToolSchema, BreadcrumbSchema } from '@/lib/toolPage';
import RecordVisit from '@/components/shared/RecordVisit';
import ToolFaqs from '@/components/shared/ToolFaqs';
import RelatedTools from '@/components/shared/RelatedTools';

export const metadata: Metadata = buildToolMetadata('json-to-csv');

/**
 * The tool itself is a client component; everything around it is server
 * rendered so the schema, questions, and cross-links are all in the HTML
 * a crawler receives.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolSchema id="json-to-csv" />
      <BreadcrumbSchema id="json-to-csv" />
      <RecordVisit id="json-to-csv" />
      {children}
      <div className="mt-12 space-y-12">
        <ToolFaqs id="json-to-csv" />
        <RelatedTools current="json-to-csv" />
      </div>
    </>
  );
}
