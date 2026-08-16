'use client';

import { useState, useMemo } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

const normalise = (text: string) =>
  text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').split(/\s+/).filter(Boolean);

/**
 * Overlap is measured on word n-grams ("shingles") rather than on single
 * words. Two unrelated passages about the same subject share plenty of
 * individual words; sharing a run of five in the same order is what
 * actually signals copied text.
 */
function shingles(words: string[], size: number): string[] {
  if (words.length < size) return words.length ? [words.join(' ')] : [];
  return Array.from({ length: words.length - size + 1 }, (_, i) =>
    words.slice(i, i + size).join(' ')
  );
}

function analyse(a: string, b: string, size: number) {
  const wordsA = normalise(a);
  const wordsB = normalise(b);

  const setA = new Set(shingles(wordsA, size));
  const setB = new Set(shingles(wordsB, size));

  if (setA.size === 0 || setB.size === 0) {
    return { jaccard: 0, containment: 0, matches: [] as string[], wordsA, wordsB };
  }

  const shared = [...setA].filter((s) => setB.has(s));
  const union = new Set([...setA, ...setB]).size;

  // Jaccard treats both passages symmetrically. Containment asks the more
  // useful question for this tool: how much of the shorter passage turns
  // up in the longer one.
  const jaccard = (shared.length / union) * 100;
  const containment = (shared.length / Math.min(setA.size, setB.size)) * 100;

  // Collapse overlapping shingles into the longest runs, so a copied
  // sentence reads as one match instead of a dozen fragments.
  const merged: string[] = [];
  for (const phrase of shared) {
    const absorbed = merged.findIndex(
      (m) => m.includes(phrase) || phrase.includes(m)
    );
    if (absorbed === -1) merged.push(phrase);
    else if (phrase.length > merged[absorbed].length) merged[absorbed] = phrase;
  }

  return {
    jaccard,
    containment,
    matches: merged.sort((x, y) => y.length - x.length).slice(0, 40),
    wordsA,
    wordsB,
  };
}

export default function DuplicateTextChecker() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [size, setSize] = useState(5);

  const { jaccard, containment, matches, wordsA, wordsB } = useMemo(
    () => analyse(left, right, size),
    [left, right, size]
  );

  const ready = wordsA.length > 0 && wordsB.length > 0;

  const verdict =
    containment >= 60 ? 'Substantially the same' :
    containment >= 25 ? 'Noticeable overlap' :
    containment > 0 ? 'Slight overlap' : 'No shared phrases';

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Content Tools', href: '/tools/content' }, { label: 'Duplicate Text' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Duplicate Text Checker</h1>
        <p className="text-ink-muted max-w-2xl">
          Compare two passages and see which phrases they share. Matching runs
          on word sequences, so common vocabulary alone won’t register.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { label: 'First passage', value: left, set: setLeft, count: wordsA.length },
          { label: 'Second passage', value: right, set: setRight, count: wordsB.length },
        ].map((pane) => (
          <div key={pane.label} className="space-y-3">
            <div className="flex justify-between items-center h-[30px]">
              <label className="text-[13px] font-medium">{pane.label}</label>
              <span className="font-mono text-[11px] text-ink-subtle tabular-nums">
                {pane.count} {pane.count === 1 ? 'word' : 'words'}
              </span>
            </div>
            <textarea
              value={pane.value}
              onChange={(e) => pane.set(e.target.value)}
              placeholder="Paste text"
              className="field h-64"
            />
          </div>
        ))}
      </div>

      <div className="panel p-4 flex items-center justify-between gap-4">
        <div>
          <span className="text-[13px] font-medium">Phrase length</span>
          <p className="text-[12.5px] text-ink-muted mt-0.5">
            Shorter catches more, and raises false positives.
          </p>
        </div>
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="select shrink-0"
        >
          {[3, 4, 5, 6, 8].map((n) => (
            <option key={n} value={n}>{n} words</option>
          ))}
        </select>
      </div>

      {ready && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Verdict', value: verdict, mono: false },
              { label: 'Containment', value: `${containment.toFixed(1)}%`, mono: true },
              { label: 'Jaccard', value: `${jaccard.toFixed(1)}%`, mono: true },
            ].map((stat) => (
              <div key={stat.label} className="panel p-4">
                <p className="eyebrow mb-2">{stat.label}</p>
                <p
                  className={`text-[15px] ${
                    stat.mono ? 'font-mono tabular-nums text-2xl font-medium tracking-tight' : 'font-medium'
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-medium">Shared phrases</h2>
              <span className="font-mono text-[11px] text-ink-subtle tabular-nums">
                {matches.length}
              </span>
            </div>
            {matches.length > 0 ? (
              <div className="panel-sunken p-4 space-y-2 max-h-80 overflow-auto">
                {matches.map((phrase, i) => (
                  <p key={i} className="font-mono text-[12.5px] leading-relaxed">
                    <mark className="bg-accent-soft text-ink px-1 py-0.5 rounded">
                      {phrase}
                    </mark>
                  </p>
                ))}
              </div>
            ) : (
              <div className="panel-sunken p-6 text-center">
                <p className="text-[13px] text-ink-subtle">
                  No run of {size} words appears in both passages.
                </p>
              </div>
            )}
          </div>

          <p className="text-[13px] text-ink-muted">
            This compares the two passages you provide. It does not search the
            web, so it can’t tell you whether either one was published
            somewhere else.
          </p>
        </>
      )}

      <AdContainer slot="1414141414" format="horizontal" />
    </div>
  );
}
