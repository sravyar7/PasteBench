'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Link from 'next/link';
import AdContainer from '@/components/shared/AdContainer';
import Icon from '@/components/shared/Icon';
import { TOOLS, CATEGORIES, toolHref } from '@/lib/tools';

export default function HomeContent() {
  const searchParams = useQueryParams();
  const [category, setCategory] = useState('');

  useEffect(() => {
    const param = searchParams.get('category');
    // Validated, so a stale or hand-edited value shows every tool rather
    // than an unexplained empty grid.
    if (param && CATEGORIES.some((c) => c.id === param)) setCategory(param);
  }, [searchParams]);

  // Searching lives in the palette. The hero field below opens it rather
  // than filtering here, so there is one search behaviour rather than two
  // that look the same and do different things.
  const openPalette = () =>
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true })
    );

  const filtered = useMemo(
    () => TOOLS.filter((tool) => !category || tool.category === category),
    [category]
  );

  // One section per category when unfiltered; a single unlabelled section
  // once a category is picked, since the heading would just repeat the
  // active filter chip.
  const sections = useMemo(() => {
    if (category) {
      return [{ id: category, name: '', blurb: '', tools: filtered }];
    }
    return CATEGORIES.map((c) => ({
      ...c,
      tools: TOOLS.filter((t) => t.category === c.id),
    }));
  }, [category, filtered]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 grid-veil pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">{TOOLS.length} tools</p>
            <h1 className="display text-[2.75rem] sm:text-6xl mb-6">
              The utilities you
              <br />
              keep googling.
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed max-w-xl">
              Formatters, encoders, and converters for the small jobs that
              interrupt real work. They run inside this tab — whatever you paste
              stays on your machine.
            </p>
          </div>

          {/* The prominent way into the palette. A button rather than an
              input, so it can't look like a field that swallows typing. */}
          <button
            onClick={openPalette}
            className="mt-10 w-full max-w-md h-11 flex items-center gap-3 pl-3.5 pr-2 rounded-xl bg-surface border border-line text-left hover:border-line-strong transition-colors"
          >
            <Icon name="search" className="w-4 h-4 text-ink-subtle shrink-0" />
            <span className="text-[14px] text-ink-subtle flex-1">
              Search {TOOLS.length} tools
            </span>
            <kbd className="hidden sm:flex items-center font-mono text-[10px] text-ink-subtle border border-line rounded px-1.5 py-1">
              ⌘K
            </kbd>
          </button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 py-8">
          <button
            onClick={() => setCategory('')}
            className={`h-8 px-3 rounded-lg text-[13px] font-medium transition-colors ${
              !category
                ? 'bg-invert-bg text-invert-fg'
                : 'text-ink-muted hover:text-ink hover:bg-surface-muted'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`h-8 px-3 rounded-lg text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors ${
                category === cat.id
                  ? 'bg-invert-bg text-invert-fg'
                  : 'text-ink-muted hover:text-ink hover:bg-surface-muted'
              }`}
            >
              <Icon name={cat.id} className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          ))}
          <span className="ml-auto font-mono text-[11px] text-ink-subtle tabular-nums">
            {filtered.length} {filtered.length === 1 ? 'tool' : 'tools'}
          </span>
        </div>

        {/* Grouped into sections when showing everything. Thirty cards in
            one undifferentiated grid gives the eye nothing to navigate by;
            a single category is short enough to stay flat. */}
        {sections.map((section) => (
          <section key={section.id} className="mb-12 last:mb-0">
            {!category && (
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className="text-[15px] font-medium tracking-tight">
                  {section.name}
                </h2>
                <span className="text-[13px] text-ink-muted">
                  {section.blurb}
                </span>
                <Link
                  href={`/tools/${section.id}`}
                  className="ml-auto text-[13px] text-ink-muted hover:text-ink transition-colors shrink-0"
                >
                  View all
                </Link>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.tools.map((tool) => (
                <Link key={tool.id} href={toolHref(tool)} className="tool-card group">
                  <span className="text-ink-subtle group-hover:text-accent transition-colors">
                    <Icon name={tool.id} className="w-[18px] h-[18px]" />
                  </span>
                  <h3 className="text-[15px] font-medium tracking-tight mt-1">
                    {tool.name}
                  </h3>
                  <p className="text-[13px] text-ink-muted leading-relaxed">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Ad */}
        <div className="mt-16">
          <AdContainer slot="0000000000" format="horizontal" />
        </div>

        {/* Notes — concrete claims, not badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-line border border-line rounded-xl overflow-hidden mt-20">
          {[
            {
              title: 'Nothing leaves the tab',
              body: 'Every tool is JavaScript running locally. There is no upload step and no server to send your input to.',
            },
            {
              title: 'No account, no limits',
              body: 'No sign-up wall, no daily quota, and no email capture before you can use a formatter.',
            },
            {
              title: 'Links carry your input',
              body: 'Most tools read from the URL, so you can share a prewired link instead of pasting instructions.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-canvas p-6">
              <h3 className="text-[14px] font-medium tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="text-[13px] text-ink-muted leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
