import Link from 'next/link';
import { TOOLS, CATEGORIES, toolHref } from '@/lib/tools';
import { BRAND } from '@/lib/brand';

const LEGAL = [
  { name: 'Articles', href: '/blog' },
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
  { name: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10 mb-14">
          {CATEGORIES.map((category) => (
            <div key={category.id}>
              <h3 className="eyebrow mb-4">{category.name}</h3>
              <ul className="space-y-2.5">
                {TOOLS.filter((t) => t.category === category.id)
                  .slice(0, 5)
                  .map((tool) => (
                    <li key={tool.id}>
                      <Link
                        href={toolHref(tool)}
                        className="text-[13px] text-ink-muted hover:text-ink transition-colors"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="eyebrow mb-4">Site</h3>
            <ul className="space-y-2.5">
              {LEGAL.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13px] text-ink-muted hover:text-ink transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[13px] text-ink-subtle">
            Every tool runs locally in your browser. Nothing is uploaded.
          </p>
          <p className="font-mono text-[11px] text-ink-subtle">
            © {new Date().getFullYear()} {BRAND}
          </p>
        </div>
      </div>
    </footer>
  );
}
