import { getFaqs } from '@/lib/toolFaqs';
import { getTool, toolHref } from '@/lib/tools';
import { SITE_URL } from '@/lib/site';

/**
 * FAQ block plus its schema.
 *
 * Two jobs: answer the questions people arrive with, and give the page
 * enough indexable prose to rank for the long-tail phrasing of those
 * questions. The markup makes it eligible for an expandable result.
 *
 * Rendered as plain details/summary — no JavaScript, so the answers are
 * in the HTML whether or not the crawler runs scripts.
 */
export default function ToolFaqs({ id }: { id: string }) {
  const faqs = getFaqs(id);
  if (!faqs.length) return null;

  const tool = getTool(id);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(tool ? { url: `${SITE_URL}${toolHref(tool)}` } : {}),
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section className="pt-10 hairline">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h2 className="eyebrow mb-5">Common questions</h2>
      <div className="space-y-px bg-line border border-line rounded-xl overflow-hidden">
        {faqs.map((faq) => (
          <details key={faq.q} className="group bg-canvas">
            <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none text-[14px] font-medium hover:bg-surface-muted transition-colors">
              <span className="flex-1">{faq.q}</span>
              <span className="text-ink-subtle shrink-0 transition-transform group-open:rotate-45 text-[18px] leading-none">
                +
              </span>
            </summary>
            <p className="px-5 pb-5 -mt-1 text-[13.5px] text-ink-muted leading-relaxed max-w-2xl">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
