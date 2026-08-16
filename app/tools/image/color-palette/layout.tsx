import type { Metadata } from 'next';
import { buildToolMetadata, ToolSchema, BreadcrumbSchema } from '@/lib/toolPage';
import RecordVisit from '@/components/shared/RecordVisit';
import ToolFaqs from '@/components/shared/ToolFaqs';
import RelatedTools from '@/components/shared/RelatedTools';

export const metadata: Metadata = buildToolMetadata('color-palette');

/**
 * The tool itself is a client component; everything around it is server
 * rendered so the schema, questions, and cross-links are all in the HTML
 * a crawler receives.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolSchema id="color-palette" />
      <BreadcrumbSchema id="color-palette" />
      <RecordVisit id="color-palette" />
      {children}
      <div className="mt-12 space-y-12">
        <ToolFaqs id="color-palette" />
        <RelatedTools current="color-palette" />
      </div>
    </>
  );
}
