import type { Metadata } from 'next';
import { buildToolMetadata, ToolSchema, BreadcrumbSchema } from '@/lib/toolPage';
import RecordVisit from '@/components/shared/RecordVisit';
import ToolFaqs from '@/components/shared/ToolFaqs';
import RelatedTools from '@/components/shared/RelatedTools';

export const metadata: Metadata = buildToolMetadata('line-tools');

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolSchema id="line-tools" />
      <BreadcrumbSchema id="line-tools" />
      <RecordVisit id="line-tools" />
      {children}
      <div className="mt-12 space-y-12">
        <ToolFaqs id="line-tools" />
        <RelatedTools current="line-tools" />
      </div>
    </>
  );
}
