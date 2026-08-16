'use client';

import { useState, useCallback, useEffect } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

type Mode = 'number' | 'string' | 'uuid';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** Uniform integer in [min, max] via rejection sampling on a 32-bit draw. */
function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  if (range <= 0) return min;
  const limit = Math.floor(0xffffffff / range) * range;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return min + (buf[0] % range);
}

function randomString(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

export default function RandomGenerator() {
  const [mode, setMode] = useState<Mode>('number');
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const lo = parseInt(min, 10);
    const hi = parseInt(max, 10);

    const next = Array.from({ length: count }, () => {
      if (mode === 'uuid') return crypto.randomUUID();
      if (mode === 'string') return randomString(length);
      if (isNaN(lo) || isNaN(hi)) return '';
      return String(randomInt(Math.min(lo, hi), Math.max(lo, hi)));
    });

    setResults(next.filter(Boolean));
  }, [mode, min, max, length, count]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = () => {
    if (!results.length) return;
    navigator.clipboard.writeText(results.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rangeInvalid =
    mode === 'number' && (isNaN(parseInt(min, 10)) || isNaN(parseInt(max, 10)));

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Converter Tools', href: '/tools/converter' }, { label: 'Random Generator' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Random Generator</h1>
        <p className="text-ink-muted max-w-2xl">
          Random numbers, strings, and throwaway IDs for testing and seed data.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(['number', 'string', 'uuid'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`h-8 px-3 rounded-lg text-[13px] font-medium capitalize transition-colors ${
              mode === m
                ? 'bg-invert-bg text-invert-fg'
                : 'text-ink-muted hover:text-ink hover:bg-surface-muted'
            }`}
          >
            {m === 'uuid' ? 'UUID' : m}
          </button>
        ))}
      </div>

      <div className="panel p-5 space-y-4">
        {mode === 'number' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="eyebrow block">Minimum</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="field !py-2.5 !text-[15px] tabular-nums"
              />
            </div>
            <div className="space-y-2">
              <label className="eyebrow block">Maximum</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                className="field !py-2.5 !text-[15px] tabular-nums"
              />
            </div>
          </div>
        )}

        {mode === 'string' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="len" className="text-[13px] font-medium">
                Length
              </label>
              <span className="font-mono text-[13px] tabular-nums">{length}</span>
            </div>
            <input
              id="len"
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-[var(--ink)]"
            />
          </div>
        )}

        {mode === 'uuid' && (
          <p className="text-[13px] text-ink-muted">
            Version 4 UUIDs from the browser’s own generator.
          </p>
        )}

        <div className="hairline pt-4 flex items-center justify-between">
          <label htmlFor="count" className="text-[13px] font-medium">
            How many
          </label>
          <select
            id="count"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="select"
          >
            {[1, 5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {rangeInvalid ? (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          Enter a number for both the minimum and the maximum.
        </div>
      ) : (
        results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between h-[30px]">
              <span className="text-[13px] font-medium">Results</span>
              <button onClick={handleCopy} className="btn btn-secondary btn-sm">
                {copied ? 'Copied' : 'Copy all'}
              </button>
            </div>
            <div className="panel-sunken p-4 font-mono text-[13px] leading-relaxed max-h-72 overflow-auto">
              {results.map((r, i) => (
                <div key={i} className="text-ink break-all">{r}</div>
              ))}
            </div>
          </div>
        )
      )}

      <button onClick={generate} className="btn btn-primary">
        Generate again
      </button>

      <AdContainer slot="1818181822" format="horizontal" />
    </div>
  );
}
