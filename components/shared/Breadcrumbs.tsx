import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-[13px] text-ink-subtle mb-7">
      <Link href="/" className="hover:text-ink transition-colors">
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span aria-hidden="true" className="text-line-strong">
            /
          </span>
          {item.href ? (
            <Link href={item.href} className="hover:text-ink transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-muted">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
