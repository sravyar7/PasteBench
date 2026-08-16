import Link from 'next/link';
import Icon from './Icon';
import { relatedTools, toolHref } from '@/lib/tools';

/**
 * Sibling links at the foot of every tool page.
 *
 * Someone arriving from a search result has otherwise seen exactly one page
 * and has no route deeper into the site. These also give the crawler an
 * internal link to each tool from every other tool.
 */
export default function RelatedTools({ current }: { current: string }) {
  const tools = relatedTools(current, 4);
  if (!tools.length) return null;

  return (
    <section className="pt-10 hairline">
      <h2 className="eyebrow mb-5">More tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <Link key={tool.id} href={toolHref(tool)} className="tool-card group">
            <span className="text-ink-subtle group-hover:text-accent transition-colors">
              <Icon name={tool.id} className="w-[18px] h-[18px]" />
            </span>
            <h3 className="text-[14px] font-medium tracking-tight mt-1">
              {tool.name}
            </h3>
            <p className="text-[12.5px] text-ink-muted leading-relaxed">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
