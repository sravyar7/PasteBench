'use client';

import { useState, useEffect, useCallback } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

const SETS = {
  lower: { label: 'Lowercase', chars: 'abcdefghijklmnopqrstuvwxyz' },
  upper: { label: 'Uppercase', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  digits: { label: 'Digits', chars: '0123456789' },
  symbols: { label: 'Symbols', chars: '!@#$%^&*()_+-=[]{}|;:,.<>?' },
};

type SetKey = keyof typeof SETS;

/**
 * Rejection sampling over crypto.getRandomValues.
 *
 * Math.random() is seeded predictably and must never generate a password.
 * Taking `byte % length` instead would bias toward the first characters of
 * the alphabet whenever 256 isn't a multiple of it, so values landing in
 * the ragged tail are discarded and redrawn.
 */
function randomChars(alphabet: string, count: number): string {
  const limit = Math.floor(256 / alphabet.length) * alphabet.length;
  let out = '';

  while (out.length < count) {
    const bytes = new Uint8Array(count - out.length);
    crypto.getRandomValues(bytes);
    for (const byte of bytes) {
      if (byte < limit) out += alphabet[byte % alphabet.length];
    }
  }

  return out;
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(20);
  const [enabled, setEnabled] = useState<Record<SetKey, boolean>>({
    lower: true,
    upper: true,
    digits: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const activeKeys = (Object.keys(SETS) as SetKey[]).filter((k) => enabled[k]);
  const alphabet = activeKeys.map((k) => SETS[k].chars).join('');

  const generate = useCallback(() => {
    if (!alphabet) {
      setPassword('');
      return;
    }
    setPassword(randomChars(alphabet, length));
  }, [alphabet, length]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // log2(alphabet^length), the standard way to state password strength.
  const bits = alphabet
    ? Math.floor(length * Math.log2(alphabet.length))
    : 0;

  const strength =
    bits >= 128 ? 'Very strong' : bits >= 80 ? 'Strong' : bits >= 60 ? 'Adequate' : 'Weak';

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Converter Tools', href: '/tools/converter' }, { label: 'Password Generator' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Password Generator</h1>
        <p className="text-ink-muted max-w-2xl">
          Generate a random password at the length you want, with the character
          sets you pick.
        </p>
      </div>

      <div className="panel p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <code className="font-mono text-[15px] leading-relaxed break-all text-ink">
            {password || (
              <span className="text-ink-subtle">Select at least one character set</span>
            )}
          </code>
          <button
            onClick={handleCopy}
            disabled={!password}
            className="btn btn-secondary btn-sm shrink-0"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="hairline pt-3 flex items-center justify-between">
          <span className="eyebrow">{strength}</span>
          <span className="font-mono text-[11px] text-ink-subtle tabular-nums">
            {bits} bits of entropy
          </span>
        </div>
      </div>

      <div className="panel p-5 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="length" className="text-[13px] font-medium">
              Length
            </label>
            <span className="font-mono text-[13px] tabular-nums">{length}</span>
          </div>
          <input
            id="length"
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-[var(--ink)]"
          />
        </div>

        <div className="hairline pt-5 grid grid-cols-2 gap-3">
          {(Object.keys(SETS) as SetKey[]).map((key) => (
            <label
              key={key}
              className="flex items-center gap-2.5 text-[13px] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={enabled[key]}
                onChange={(e) =>
                  setEnabled((prev) => ({ ...prev, [key]: e.target.checked }))
                }
                className="w-4 h-4 rounded accent-[var(--ink)]"
              />
              <span>{SETS[key].label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={generate} disabled={!alphabet} className="btn btn-primary">
        Generate another
      </button>

      <p className="text-[13px] text-ink-muted">
        Values come from the browser’s cryptographic random number generator,
        not <code className="font-mono text-[12px]">Math.random()</code>. Nothing
        is transmitted or stored.
      </p>

      <AdContainer slot="1818181818" format="horizontal" />
    </div>
  );
}
