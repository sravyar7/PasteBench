import Link from 'next/link';
import Icon from '@/components/shared/Icon';
import { TOOLS, toolHref } from '@/lib/tools';

export default function NotFound() {
  // A handful of the most-searched tools, so a dead link still lands
  // somewhere useful.
  const suggestions = TOOLS.filter((t) =>
    ['json-formatter', 'base64-encoder', 'word-counter', 'qr-code-generator'].includes(t.id)
  );

  return (
    <div className="max-w-2xl mx-auto w-full px-5 sm:px-6 py-24 sm:py-32">
      <p className="eyebrow mb-4">Error 404</p>
      <h1 className="display text-[2.5rem] sm:text-5xl mb-5">
        This page isn’t here.
      </h1>
      <p className="text-ink-muted text-[15px] leading-relaxed mb-10 max-w-lg">
        The address may be mistyped, or the tool may have been renamed. The
        full list is on the home page.
      </p>

      <Link href="/" className="btn btn-primary mb-14">
        Browse all tools
      </Link>

      <div className="pt-10 hairline">
        <h2 className="eyebrow mb-5">Frequently used</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((tool) => (
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
      </div>
    </div>
  );
}
