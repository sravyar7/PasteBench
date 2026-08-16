import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SearchTrigger from './SearchTrigger';
import { BRAND, MONOGRAM } from '@/lib/brand';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-6 h-6 rounded-md bg-invert-bg text-invert-fg grid place-items-center font-mono text-[11px] font-bold tracking-tight">
            {MONOGRAM}
          </span>
          <span className="font-medium tracking-tight text-[15px]">
            {BRAND}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            className="hidden sm:inline-block px-2.5 h-8 leading-8 rounded-lg text-[13px] text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"
          >
            Articles
          </Link>
          <SearchTrigger />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
