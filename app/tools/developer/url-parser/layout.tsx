import type { Metadata } from 'next';
import { buildToolMetadata, ToolSchema, BreadcrumbSchema } from '@/lib/toolPage';
import RecordVisit from '@/components/shared/RecordVisit';
import ToolFaqs from '@/components/shared/ToolFaqs';
import RelatedTools from '@/components/shared/RelatedTools';

export const metadata: Metadata = buildToolMetadata('url-parser');

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolSchema id="url-parser" />
      <BreadcrumbSchema id="url-parser" />
      <RecordVisit id="url-parser" />
      {children}
      <div className="mt-12 space-y-12">
        <ToolFaqs id="url-parser" />
        <RelatedTools current="url-parser" />
      </div>
    </>
  );
}
