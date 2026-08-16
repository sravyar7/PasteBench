'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

// SubtleCrypto ships these four in every current browser. There is no
// MD5 here on purpose: the platform doesn't provide it, and pulling in a
// broken-by-design digest to fill a row on the page isn't worth it.
const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function HashGenerator() {
  const searchParams = useQueryParams();
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const inputParam = searchParams.get('input');
    if (inputParam) {
      try {
        setInput(decodeURIComponent(inputParam));
      } catch {
        // Ignore malformed encoding
      }
    }
  }, [searchParams]);

  // Digest on every keystroke — these are fast enough that a button would
  // just be an extra click.
  useEffect(() => {
    let cancelled = false;

    if (!input) {
      setResults({});
      return;
    }

    const bytes = new TextEncoder().encode(input);

    Promise.all(
      ALGORITHMS.map(async (algo) => [
        algo,
        toHex(await crypto.subtle.digest(algo, bytes)),
      ])
    ).then((entries) => {
      if (!cancelled) setResults(Object.fromEntries(entries));
    });

    return () => {
      cancelled = true;
    };
  }, [input]);

  const handleCopy = (algo: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(algo);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Developer Tools', href: '/tools/developer' }, { label: 'Hash Generator' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Hash Generator</h1>
        <p className="text-ink-muted max-w-2xl">
          SHA-1 through SHA-512 for any string, computed as you type.
        </p>
      </div>

      <div>
        <label className="text-[13px] font-medium mb-2 block">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste anything"
          className="field h-32"
        />
      </div>

      <div className="space-y-2">
        {ALGORITHMS.map((algo) => (
          <div key={algo} className="panel p-4">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="eyebrow">{algo}</span>
              <button
                onClick={() => results[algo] && handleCopy(algo, results[algo])}
                disabled={!results[algo]}
                className="btn btn-secondary btn-sm"
              >
                {copied === algo ? 'Copied' : 'Copy'}
              </button>
            </div>
            <code className="block font-mono text-[12.5px] leading-relaxed text-ink break-all">
              {results[algo] || (
                <span className="text-ink-subtle">—</span>
              )}
            </code>
          </div>
        ))}
      </div>

      <p className="text-[13px] text-ink-muted">
        Hashing runs through the browser’s built-in WebCrypto implementation,
        so your input is never sent anywhere. SHA-1 is included because older
        systems still ask for it — don’t use it for anything security-related.
      </p>

      <AdContainer slot="6666666666" format="horizontal" />
    </div>
  );
}
