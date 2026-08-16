'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Icon from './Icon';
import { TOOLS, toolHref, categoryName, type Tool } from '@/lib/tools';
import { getRecent } from '@/lib/recent';

/**
 * Rank by where the query lands: a name that starts with it beats a name
 * that merely contains it, which beats a description match. Without this a
 * search for "json" surfaces the JSON-to-CSV converter above the formatter
 * purely on array order.
 */
function score(tool: Tool, query: string): number {
  const q = query.toLowerCase();
  const name = tool.name.toLowerCase();

  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  if (name.includes(q)) return 2;
  if (tool.id.includes(q)) return 3;
  if (tool.description.toLowerCase().includes(q)) return 4;
  return Infinity;
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // With no query the panel lists every tool, recents first. Showing a
  // slice of the registry instead would misrepresent the catalogue: the
  // first six entries are all developer tools, so the palette looked like
  // that was all the site had.
  const { results, recentCount } = useMemo(() => {
    if (query.trim()) {
      const ranked = TOOLS.map((tool) => ({ tool, rank: score(tool, query) }))
        .filter(({ rank }) => rank !== Infinity)
        .sort((a, b) => a.rank - b.rank)
        .map(({ tool }) => tool);
      return { results: ranked, recentCount: 0 };
    }

    const recentTools = recent
      .map((id) => TOOLS.find((t) => t.id === id))
      .filter((t): t is Tool => !!t);
    const rest = TOOLS.filter((t) => !recentTools.some((r) => r.id === t.id));

    return {
      results: [...recentTools, ...rest],
      recentCount: recentTools.length,
    };
  }, [query, recent]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  const go = useCallback(
    (tool: Tool) => {
      close();
      router.push(toolHref(tool));
    },
    [close, router]
  );

  // Global shortcut. Ignored while typing so it can't hijack a tool's input.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setRecent(getRecent());
        setOpen((v) => !v);
        return;
      }

      if (e.key === '/' && !typing && !open) {
        e.preventDefault();
        setRecent(getRecent());
        setOpen(true);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /**
   * Modal focus handling.
   *
   * Without the trap, Tab walks out of the panel into the 60-odd controls
   * behind the overlay — invisible to a sighted keyboard user and
   * incoherent to a screen reader. Focus also has to come back to whatever
   * opened the palette, or dismissing it drops the user at the top of the
   * document.
   */
  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', trap);
    return () => {
      document.removeEventListener('keydown', trap);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={close}
      />

      <div
        ref={panelRef}
        className="relative w-full max-w-lg panel overflow-hidden shadow-2xl"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 px-4 h-12 border-b border-line">
          <span className="text-ink-subtle shrink-0">
            <Icon name="search" className="w-4 h-4" />
          </span>
          {/* Combobox pattern: focus stays in the input while
              aria-activedescendant names the highlighted row, which is how
              a screen reader announces what Enter will open. */}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools"
            className="flex-1 bg-transparent border-0 p-0 text-[14px] focus:outline-none placeholder:text-ink-subtle"
            aria-label="Search tools"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={
              results[active] ? `palette-opt-${results[active].id}` : undefined
            }
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="font-mono text-[10px] text-ink-subtle border border-line rounded px-1.5 py-0.5 shrink-0">
            esc
          </kbd>
        </div>

        <div
          ref={listRef}
          id="palette-results"
          role="listbox"
          aria-label="Tools"
          className="max-h-[19rem] overflow-y-auto p-1.5"
        >
          {results.length > 0 ? (
            results.map((tool, i) => (
              <div key={tool.id}>
                {/* Headings sit inside the loop so they land between the
                    right rows without disturbing the flat index. */}
                {!query.trim() && i === 0 && recentCount > 0 && (
                  <p className="eyebrow px-2.5 py-2">Recent</p>
                )}
                {!query.trim() && i === recentCount && (
                  <p className="eyebrow px-2.5 py-2">
                    {recentCount > 0 ? 'All tools' : `All ${results.length} tools`}
                  </p>
                )}
              <button
                data-index={i}
                id={`palette-opt-${tool.id}`}
                role="option"
                aria-selected={i === active}
                tabIndex={-1}
                onClick={() => go(tool)}
                onMouseMove={() => setActive(i)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${
                  i === active ? 'bg-surface-muted' : ''
                }`}
              >
                <span
                  className={
                    i === active ? 'text-accent shrink-0' : 'text-ink-subtle shrink-0'
                  }
                >
                  <Icon name={tool.id} className="w-4 h-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium truncate">
                    {tool.name}
                  </span>
                  <span className="block text-[12px] text-ink-muted truncate">
                    {tool.description}
                  </span>
                </span>
                <span className="font-mono text-[10px] text-ink-subtle shrink-0">
                  {categoryName(tool.category)}
                </span>
              </button>
              </div>
            ))
          ) : (
            <p className="px-2.5 py-8 text-center text-[13px] text-ink-subtle">
              No tool matches “{query}”.
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 px-4 h-9 border-t border-line font-mono text-[10px] text-ink-subtle">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span className="ml-auto">{results.length} shown</span>
        </div>
      </div>
    </div>
  );
}
