'use client';

import { useState, useMemo } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

type Sort = 'none' | 'asc' | 'desc' | 'length' | 'shuffle' | 'reverse';

/**
 * Natural sort: compare digit runs as numbers so item2 lands before item10.
 * Plain lexicographic order puts item10 first, which is almost never wanted.
 */
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  // Fisher-Yates with crypto randomness — a sort() with a random comparator
  // is biased and, in some engines, undefined behaviour.
  for (let i = out.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function LineTools() {
  const [input, setInput] = useState('');
  const [sort, setSort] = useState<Sort>('none');
  const [dedupe, setDedupe] = useState(false);
  const [trim, setTrim] = useState(true);
  const [dropBlank, setDropBlank] = useState(true);
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [addNumbers, setAddNumbers] = useState(false);
  const [copied, setCopied] = useState(false);
  const [nonce, setNonce] = useState(0);

  const { output, inCount, outCount, removed } = useMemo(() => {
    let lines = input.split('\n');
    const before = input.trim() === '' ? 0 : lines.length;

    if (trim) lines = lines.map((l) => l.trim());
    if (dropBlank) lines = lines.filter((l) => l.trim() !== '');

    let dropped = 0;
    if (dedupe) {
      const seen = new Set<string>();
      lines = lines.filter((l) => {
        const key = caseInsensitive ? l.toLowerCase() : l;
        if (seen.has(key)) {
          dropped++;
          return false;
        }
        seen.add(key);
        return true;
      });
    }

    if (sort === 'asc') lines = [...lines].sort((a, b) => collator.compare(a, b));
    else if (sort === 'desc') lines = [...lines].sort((a, b) => collator.compare(b, a));
    else if (sort === 'length') lines = [...lines].sort((a, b) => a.length - b.length);
    else if (sort === 'reverse') lines = [...lines].reverse();
    else if (sort === 'shuffle') lines = shuffle(lines);

    const numbered = addNumbers
      ? lines.map((l, i) => `${String(i + 1).padStart(String(lines.length).length, ' ')}. ${l}`)
      : lines;

    return {
      output: numbered.join('\n'),
      inCount: before,
      outCount: lines.length,
      removed: dropped,
    };
    // nonce lets the shuffle button produce a new order on demand.
  }, [input, sort, dedupe, trim, dropBlank, caseInsensitive, addNumbers, nonce]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const options = [
    { label: 'Remove duplicates', on: dedupe, set: setDedupe },
    { label: 'Trim whitespace', on: trim, set: setTrim },
    { label: 'Drop blank lines', on: dropBlank, set: setDropBlank },
    { label: 'Ignore case', on: caseInsensitive, set: setCaseInsensitive },
    { label: 'Number the lines', on: addNumbers, set: setAddNumbers },
  ];

  const sorts: { id: Sort; label: string }[] = [
    { id: 'none', label: 'Original' },
    { id: 'asc', label: 'A → Z' },
    { id: 'desc', label: 'Z → A' },
    { id: 'length', label: 'By length' },
    { id: 'reverse', label: 'Reversed' },
    { id: 'shuffle', label: 'Shuffled' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Content Tools', href: '/tools/content' }, { label: 'Line Tools' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Sort and Deduplicate Lines</h1>
        <p className="text-ink-muted max-w-2xl">
          Clean up a list: drop repeats, sort it, strip blanks and stray
          whitespace. Sorting is natural, so item2 comes before item10.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center h-[30px]">
            <label className="text-[13px] font-medium">Input</label>
            <span className="font-mono text-[11px] text-ink-subtle tabular-nums">
              {inCount} {inCount === 1 ? 'line' : 'lines'}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="One item per line"
            className="field h-80"
            spellCheck={false}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center h-[30px]">
            <label className="text-[13px] font-medium">Result</label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="btn btn-secondary btn-sm"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="panel-sunken w-full h-80 p-4 font-mono text-[13px] leading-relaxed overflow-auto">
            {output ? (
              <pre className="text-ink whitespace-pre-wrap">{output}</pre>
            ) : (
              <p className="text-ink-subtle">Cleaned lines appear here</p>
            )}
          </div>
        </div>
      </div>

      {inCount > 0 && (
        <div className="flex flex-wrap items-center gap-4 font-mono text-[12.5px] text-ink-muted tabular-nums">
          <span>{outCount} out</span>
          {removed > 0 && (
            <span className="text-accent">{removed} duplicate{removed === 1 ? '' : 's'} removed</span>
          )}
          {sort === 'shuffle' && (
            <button onClick={() => setNonce((n) => n + 1)} className="btn btn-secondary btn-sm ml-auto">
              Shuffle again
            </button>
          )}
        </div>
      )}

      <div className="panel p-5 space-y-5">
        <div>
          <p className="eyebrow mb-3">Order</p>
          <div className="flex flex-wrap gap-1.5">
            {sorts.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`h-8 px-3 rounded-lg text-[13px] font-medium transition-colors ${
                  sort === s.id
                    ? 'bg-invert-bg text-invert-fg'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-muted'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hairline pt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => (
            <label
              key={opt.label}
              className="flex items-center gap-2.5 text-[13px] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={opt.on}
                onChange={(e) => opt.set(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--ink)]"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <AdContainer slot="2020202003" format="horizontal" />
    </div>
  );
}
