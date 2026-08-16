'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

const BASES = [
  { base: 2, label: 'Binary', pattern: /^[01]*$/, placeholder: '1010' },
  { base: 8, label: 'Octal', pattern: /^[0-7]*$/, placeholder: '755' },
  { base: 10, label: 'Decimal', pattern: /^\d*$/, placeholder: '255' },
  { base: 16, label: 'Hexadecimal', pattern: /^[0-9a-fA-F]*$/, placeholder: 'ff' },
];

export default function BaseConverter() {
  // Held as a BigInt so 64-bit values convert exactly. Number would start
  // losing digits past 2^53, silently, which is the failure people hit
  // when converting register values or IDs.
  // BigInt() rather than a 255n literal: literals need an ES2020 target,
  // and the constructor works regardless of what the project compiles to.
  const [value, setValue] = useState<bigint | null>(BigInt(255));
  const [source, setSource] = useState(10);
  const [draft, setDraft] = useState('255');
  const [copied, setCopied] = useState(0);

  const update = (base: number, text: string) => {
    setSource(base);
    setDraft(text);

    if (!text.trim()) {
      setValue(null);
      return;
    }
    try {
      const prefix = { 2: '0b', 8: '0o', 16: '0x', 10: '' }[base] ?? '';
      setValue(BigInt(prefix + text));
    } catch {
      setValue(null);
    }
  };

  const display = (base: number) =>
    base === source ? draft : value === null ? '' : value.toString(base);

  const invalid = draft.trim() !== '' && value === null;

  const copy = (base: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(base);
    setTimeout(() => setCopied(0), 2000);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Developer Tools', href: '/tools/developer' }, { label: 'Number Base' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Number Base Converter</h1>
        <p className="text-ink-muted max-w-2xl">
          Binary, octal, decimal, and hexadecimal side by side. Type in any
          field and the rest follow.
        </p>
      </div>

      <div className="space-y-3">
        {BASES.map((b) => {
          const text = display(b.base);
          const badChars = text !== '' && !b.pattern.test(text);
          return (
            <div key={b.base} className="panel p-4">
              <div className="flex items-center justify-between gap-4 mb-2">
                <label
                  htmlFor={`base-${b.base}`}
                  className="eyebrow"
                >
                  {b.label} · base {b.base}
                </label>
                <button
                  onClick={() => text && copy(b.base, text)}
                  disabled={!text}
                  className="btn btn-secondary btn-sm"
                >
                  {copied === b.base ? 'Copied' : 'Copy'}
                </button>
              </div>
              <input
                id={`base-${b.base}`}
                value={text}
                onChange={(e) => update(b.base, e.target.value)}
                placeholder={b.placeholder}
                spellCheck={false}
                className={`w-full bg-transparent border-0 p-0 font-mono text-[18px] tabular-nums focus:outline-none placeholder:text-ink-subtle ${
                  badChars ? 'text-red-600 dark:text-red-400' : 'text-ink'
                }`}
              />
            </div>
          );
        })}
      </div>

      {invalid && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          That isn’t a valid number in base {source}.
        </div>
      )}

      <div className="panel p-5">
        <h2 className="eyebrow mb-4">Common values</h2>
        <div className="flex flex-wrap gap-1.5">
          {['255', '1024', '65535', '4294967295'].map((n) => (
            <button
              key={n}
              onClick={() => update(10, n)}
              className="btn btn-secondary btn-sm font-mono"
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-[12.5px] text-ink-muted mt-4">
          Values are held as arbitrary-precision integers, so 64-bit numbers
          convert exactly rather than losing digits past 2<sup>53</sup>.
        </p>
      </div>

      <AdContainer slot="1919191903" format="horizontal" />
    </div>
  );
}
