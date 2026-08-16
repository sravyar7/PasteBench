'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import ShareLink from '@/components/shared/ShareLink';

/**
 * Flatten nested objects into dotted keys so `{user:{name}}` becomes
 * `user.name`. Arrays of primitives are joined rather than exploded —
 * a CSV row can't hold a list, and one column per index makes the
 * header unreadable the moment two rows differ in length.
 */
function flatten(value: unknown, prefix = '', out: Record<string, string> = {}) {
  if (value === null || value === undefined) {
    out[prefix] = '';
    return out;
  }

  if (Array.isArray(value)) {
    out[prefix] = value
      .map((v) => (v !== null && typeof v === 'object' ? JSON.stringify(v) : String(v)))
      .join('; ');
    return out;
  }

  if (typeof value === 'object') {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out);
    }
    return out;
  }

  out[prefix] = String(value);
  return out;
}

/** RFC 4180: wrap in quotes when the value holds a delimiter, quote, or newline. */
function escapeCell(value: string, delimiter: string): string {
  if (
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r')
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function convert(json: string, delimiter: string): { csv: string; rows: number } {
  const parsed = JSON.parse(json);
  const list = Array.isArray(parsed) ? parsed : [parsed];

  if (list.length === 0) return { csv: '', rows: 0 };

  const flattened = list.map((row) => flatten(row));

  // Union of keys across every row, in first-seen order, so rows with
  // missing fields still line up under the right header.
  const headers: string[] = [];
  for (const row of flattened) {
    for (const key of Object.keys(row)) {
      if (!headers.includes(key)) headers.push(key);
    }
  }

  const lines = [
    headers.map((h) => escapeCell(h, delimiter)).join(delimiter),
    ...flattened.map((row) =>
      headers.map((h) => escapeCell(row[h] ?? '', delimiter)).join(delimiter)
    ),
  ];

  return { csv: lines.join('\n'), rows: flattened.length };
}

const SAMPLE = JSON.stringify(
  [
    { id: 1, name: 'Ada Lovelace', role: { title: 'Engineer', team: 'Core' }, tags: ['math', 'compilers'] },
    { id: 2, name: 'Grace Hopper', role: { title: 'Rear Admiral', team: 'Navy' }, tags: ['cobol'] },
  ],
  null,
  2
);

export default function JsonToCsv() {
  const searchParams = useQueryParams();
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [copied, setCopied] = useState(false);

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

  let csv = '';
  let rows = 0;
  let error = '';

  if (input.trim()) {
    try {
      ({ csv, rows } = convert(input, delimiter));
    } catch (err) {
      error = err instanceof SyntaxError
        ? `That isn’t valid JSON — ${err.message}`
        : 'Could not convert that input.';
    }
  }

  const handleCopy = () => {
    if (!csv) return;
    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Converter Tools', href: '/tools/converter' }, { label: 'JSON to CSV' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">JSON to CSV</h1>
        <p className="text-ink-muted max-w-2xl">
          Flatten an array of objects into spreadsheet rows, using the keys as
          headers. Nested objects become dotted columns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center h-[30px]">
            <label className="text-[13px] font-medium">JSON</label>
            <button
              onClick={() => setInput(SAMPLE)}
              className="btn btn-secondary btn-sm"
            >
              Load sample
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste an array of objects"
            className="field h-80"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center h-[30px]">
            <label className="text-[13px] font-medium">CSV</label>
            <button
              onClick={handleCopy}
              disabled={!csv}
              className="btn btn-secondary btn-sm"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="panel-sunken w-full h-80 p-4 font-mono text-[13px] leading-relaxed overflow-auto">
            {csv ? (
              <pre className="text-ink">{csv}</pre>
            ) : (
              <p className="text-ink-subtle">Rows appear here</p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          <span className="text-[13px] font-medium">Delimiter</span>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="select"
          >
            <option value=",">Comma</option>
            <option value=";">Semicolon</option>
            <option value={'\t'}>Tab</option>
            <option value="|">Pipe</option>
          </select>
        </label>

        <button onClick={download} disabled={!csv} className="btn btn-primary">
          Download .csv
        </button>

        {rows > 0 && (
          <span className="ml-auto font-mono text-[11px] text-ink-subtle tabular-nums">
            {rows} {rows === 1 ? 'row' : 'rows'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <ShareLink value={input} />
        <span className="text-[12.5px] text-ink-muted">
          Copies a link that reopens this tool with your input.
        </span>
      </div>

      <AdContainer slot="1818181819" format="horizontal" />
    </div>
  );
}
