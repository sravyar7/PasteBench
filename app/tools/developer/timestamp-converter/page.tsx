'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import ShareLink from '@/components/shared/ShareLink';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * A 10-digit epoch is seconds, 13 digits is milliseconds. Guessing from
 * magnitude is what every other converter does and it's what people
 * expect — pasting 1700000000 should not land in 1970.
 */
function toMillis(raw: string): number | null {
  const digits = raw.trim().replace(/[^0-9-]/g, '');
  if (!digits || !/^-?\d+$/.test(digits)) return null;
  const n = Number(digits);
  if (!Number.isFinite(n)) return null;
  return Math.abs(n) < 1e11 ? n * 1000 : n;
}

function formatParts(d: Date, utc: boolean) {
  const get = utc
    ? {
        y: d.getUTCFullYear(), mo: d.getUTCMonth() + 1, da: d.getUTCDate(),
        h: d.getUTCHours(), mi: d.getUTCMinutes(), s: d.getUTCSeconds(),
      }
    : {
        y: d.getFullYear(), mo: d.getMonth() + 1, da: d.getDate(),
        h: d.getHours(), mi: d.getMinutes(), s: d.getSeconds(),
      };
  return `${get.y}-${pad(get.mo)}-${pad(get.da)} ${pad(get.h)}:${pad(get.mi)}:${pad(get.s)}`;
}

function relative(ms: number): string {
  const diff = ms - Date.now();
  const abs = Math.abs(diff);
  const units: [number, string][] = [
    [31536000000, 'year'], [2592000000, 'month'], [86400000, 'day'],
    [3600000, 'hour'], [60000, 'minute'], [1000, 'second'],
  ];
  for (const [size, label] of units) {
    if (abs >= size) {
      const n = Math.round(abs / size);
      return diff < 0
        ? `${n} ${label}${n === 1 ? '' : 's'} ago`
        : `in ${n} ${label}${n === 1 ? '' : 's'}`;
    }
  }
  return 'just now';
}

export default function TimestampConverter() {
  const searchParams = useQueryParams();
  const [raw, setRaw] = useState('');
  const [utc, setUtc] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  const [copied, setCopied] = useState('');

  // Rendering Date.now() during SSR would mismatch on hydration, so the
  // clock only starts client-side.
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const input = searchParams.get('input');
    if (input) {
      try {
        setRaw(decodeURIComponent(input));
      } catch {
        // Ignore malformed encoding
      }
    }
  }, [searchParams]);

  const millis = toMillis(raw);
  const date = millis !== null ? new Date(millis) : null;
  const valid = date !== null && !isNaN(date.getTime());

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const rows = valid && date
    ? [
        ['Formatted', formatParts(date, utc)],
        ['ISO 8601', date.toISOString()],
        ['RFC 2822', date.toUTCString()],
        ['Seconds', String(Math.floor(date.getTime() / 1000))],
        ['Milliseconds', String(date.getTime())],
        ['Relative', relative(date.getTime())],
      ]
    : [];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Developer Tools', href: '/tools/developer' }, { label: 'Timestamp Converter' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Unix Timestamp Converter</h1>
        <p className="text-ink-muted max-w-2xl">
          Paste an epoch to read it as a date, or take the current time in
          whichever format you need. Seconds and milliseconds are detected
          automatically.
        </p>
      </div>

      <div className="panel p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-1.5">Current epoch</p>
          <code className="font-mono text-2xl font-medium tabular-nums tracking-tight">
            {now !== null ? Math.floor(now / 1000) : '—'}
          </code>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => now && copy('now', String(Math.floor(now / 1000)))}
            className="btn btn-secondary btn-sm"
          >
            {copied === 'now' ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={() => now && setRaw(String(Math.floor(now / 1000)))}
            className="btn btn-secondary btn-sm"
          >
            Use this
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="ts" className="text-[13px] font-medium block">
          Timestamp
        </label>
        <input
          id="ts"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="1700000000"
          inputMode="numeric"
          className="field !py-3 !text-[16px] tabular-nums"
        />
      </div>

      {raw.trim() && !valid && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          That doesn’t read as a Unix timestamp. Try a number like 1700000000.
        </div>
      )}

      {valid && (
        <>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'local', label: 'Local time' },
              { id: 'utc', label: 'UTC' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setUtc(opt.id === 'utc')}
                className={`h-8 px-3 rounded-lg text-[13px] font-medium transition-colors ${
                  (opt.id === 'utc') === utc
                    ? 'bg-invert-bg text-invert-fg'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-muted'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="panel p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="eyebrow mb-1">{label}</p>
                  <code className="font-mono text-[13.5px] text-ink break-all">
                    {value}
                  </code>
                </div>
                <button
                  onClick={() => copy(label, value)}
                  className="btn btn-secondary btn-sm shrink-0"
                >
                  {copied === label ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex items-center gap-3 pt-2">
        <ShareLink value={raw} />
        <span className="text-[12.5px] text-ink-muted">
          Copies a link that reopens this tool with your input.
        </span>
      </div>

      <AdContainer slot="1919191901" format="horizontal" />
    </div>
  );
}
