import type { Metadata } from 'next';
import { buildToolMetadata, ToolSchema, BreadcrumbSchema } from '@/lib/toolPage';
import RecordVisit from '@/components/shared/RecordVisit';
import ToolFaqs from '@/components/shared/ToolFaqs';
import RelatedTools from '@/components/shared/RelatedTools';

export const metadata: Metadata = buildToolMetadata('cron-parser');

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolSchema id="cron-parser" />
      <BreadcrumbSchema id="cron-parser" />
      <RecordVisit id="cron-parser" />
      {children}
      <div className="mt-12 space-y-12">
        <ToolFaqs id="cron-parser" />
        <RelatedTools current="cron-parser" />
      </div>
    </>
  );
}
