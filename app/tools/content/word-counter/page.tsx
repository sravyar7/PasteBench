'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import ShareLink from '@/components/shared/ShareLink';

export default function WordCounter() {
  const searchParams = useQueryParams();
  const [text, setText] = useState('');

  useEffect(() => {
    const inputParam = searchParams.get('input');
    if (inputParam) {
      try {
        const decoded = decodeURIComponent(inputParam);
        setText(decoded);
      } catch (e) {
        // Ignore decoding errors
      }
    }
  }, [searchParams]);

  const countStats = (str: string) => {
    const chars = str.length;
    const charsNoSpaces = str.replace(/\s/g, '').length;
    const words = str.trim() ? str.trim().split(/\s+/).length : 0;
    const lines = str ? str.split('\n').length : 0;
    const paragraphs = str.trim() ? str.trim().split(/\n\n+/).length : 0;
    const sentences = str ? (str.match(/[.!?]+/g) || []).length : 0;

    return { chars, charsNoSpaces, words, lines, paragraphs, sentences };
  };

  const stats = countStats(text);

  const StatCard = ({ label, value }: { label: string; value: number }) => (
    <div className="panel p-4">
      <p className="eyebrow">{label}</p>
      <p className="text-2xl font-medium tabular-nums tracking-tight mt-1">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Content Tools', href: '/tools/content' }, { label: 'Word Counter' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Word Counter</h1>
        <p className="text-ink-muted max-w-2xl">
          Words, characters, sentences, lines, and paragraphs, counted as you type.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type text"
        className="field h-64"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Characters" value={stats.chars} />
        <StatCard label="Chars (no spaces)" value={stats.charsNoSpaces} />
        <StatCard label="Words" value={stats.words} />
        <StatCard label="Lines" value={stats.lines} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Sentences" value={stats.sentences} />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <ShareLink value={text} />
        <span className="text-[12.5px] text-ink-muted">
          Copies a link that reopens this tool with your input.
        </span>
      </div>

      <div className="py-4">
        <AdContainer slot="9999999999" format="horizontal" />
      </div>
    </div>
  );
}
