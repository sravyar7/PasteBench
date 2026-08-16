'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import ShareLink from '@/components/shared/ShareLink';

/**
 * RFC 4180 parser, character by character.
 *
 * A split on the delimiter breaks the moment a field contains one inside
 * quotes — which is exactly what quoting exists for, and common in any
 * export containing addresses or prose.
 */
function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        // A doubled quote inside a quoted field is one literal quote.
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

/** Turn "12"/"true"/"null" into real JSON types when asked. */
function coerce(value: string): unknown {
  const trimmed = value.trim();
  if (trimmed === '') return '';
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;
  // Leading zeros usually mean an identifier, not a number.
  if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return value;
}

const SAMPLE = `name,role,team,active
Ada Lovelace,"Engineer, Core",Platform,true
Grace Hopper,Rear Admiral,Navy,true
Katherine Johnson,Mathematician,Flight,false`;

export default function CsvToJson() {
  const searchParams = useQueryParams();
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [typed, setTyped] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const param = searchParams.get('input');
    if (param) {
      try {
        setInput(decodeURIComponent(param));
      } catch {
        // Ignore malformed encoding
      }
    }
  }, [searchParams]);

  let json = '';
  let count = 0;
  let error = '';

  if (input.trim()) {
    try {
      const rows = parseCsv(input, delimiter);
      if (rows.length === 0) {
        error = 'No rows found in that input.';
      } else {
        const headers = hasHeader
          ? rows[0].map((h, i) => h.trim() || `column_${i + 1}`)
          : rows[0].map((_, i) => `column_${i + 1}`);
        const body = hasHeader ? rows.slice(1) : rows;

        const objects = body.map((cells) =>
          Object.fromEntries(
            headers.map((key, i) => [
              key,
              typed ? coerce(cells[i] ?? '') : cells[i] ?? '',
            ])
          )
        );

        count = objects.length;
        json = JSON.stringify(objects, null, 2);
      }
    } catch {
      error = 'That input could not be parsed as CSV.';
    }
  }

  const handleCopy = () => {
    if (!json) return;
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    if (!json) return;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Converter Tools', href: '/tools/converter' }, { label: 'CSV to JSON' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">CSV to JSON</h1>
        <p className="text-ink-muted max-w-2xl">
          Turn spreadsheet rows into an array of objects, using the header line
          as keys. Quoted fields containing commas are handled properly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center h-[30px]">
            <label className="text-[13px] font-medium">CSV</label>
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
            placeholder="Paste rows, header line first"
            className="field h-80"
            spellCheck={false}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center h-[30px]">
            <label className="text-[13px] font-medium">JSON</label>
            <button
              onClick={handleCopy}
              disabled={!json}
              className="btn btn-secondary btn-sm"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="panel-sunken w-full h-80 p-4 font-mono text-[13px] leading-relaxed overflow-auto">
            {json ? (
              <pre className="text-ink">{json}</pre>
            ) : (
              <p className="text-ink-subtle">Objects appear here</p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          {error}
        </div>
      )}

      <div className="panel p-5 flex flex-wrap items-center gap-x-6 gap-y-4">
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

        <label className="flex items-center gap-2.5 text-[13px] cursor-pointer">
          <input
            type="checkbox"
            checked={hasHeader}
            onChange={(e) => setHasHeader(e.target.checked)}
            className="w-4 h-4 rounded accent-[var(--ink)]"
          />
          <span>First row is a header</span>
        </label>

        <label className="flex items-center gap-2.5 text-[13px] cursor-pointer">
          <input
            type="checkbox"
            checked={typed}
            onChange={(e) => setTyped(e.target.checked)}
            className="w-4 h-4 rounded accent-[var(--ink)]"
          />
          <span>Convert numbers and booleans</span>
        </label>

        <button
          onClick={download}
          disabled={!json}
          className="btn btn-primary sm:ml-auto"
        >
          Download .json
        </button>
      </div>

      {count > 0 && (
        <p className="font-mono text-[11px] text-ink-subtle tabular-nums">
          {count} {count === 1 ? 'object' : 'objects'}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <ShareLink value={input} />
        <span className="text-[12.5px] text-ink-muted">
          Copies a link that reopens this tool with your input.
        </span>
      </div>

      <AdContainer slot="1919191906" format="horizontal" />
    </div>
  );
}
