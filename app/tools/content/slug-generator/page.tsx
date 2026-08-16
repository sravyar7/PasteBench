'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import ShareLink from '@/components/shared/ShareLink';

/**
 * NFD splits an accented character into its base letter plus a combining
 * mark, so stripping the marks turns "Café" into "cafe" rather than
 * dropping the letter and leaving "caf".
 */
function slugify(text: string, separator: string, lower: boolean): string {
  let out = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    // A few letters carry no combining mark and need naming outright.
    .replace(/[øØ]/g, 'o')
    .replace(/[æÆ]/g, 'ae')
    .replace(/[œŒ]/g, 'oe')
    .replace(/[đĐ]/g, 'd')
    .replace(/[ßẞ]/g, 'ss')
    .replace(/[łŁ]/g, 'l')
    .replace(/&/g, ' and ');

  if (lower) out = out.toLowerCase();

  return out
    .replace(/[^a-zA-Z0-9]+/g, separator)
    .replace(
      new RegExp(`\\${separator}{2,}`, 'g'),
      separator
    )
    .replace(new RegExp(`^\\${separator}+|\\${separator}+$`, 'g'), '');
}

const EXAMPLES = [
  'Crème Brûlée & Other Desserts',
  '10 Things I Learned in 2024!',
  'Straße — Größe & Weiß',
];

export default function SlugGenerator() {
  const searchParams = useQueryParams();
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lower, setLower] = useState(true);
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

  // Each line becomes its own slug, so a list of headings can be done at once.
  const lines = input.split('\n').filter((l) => l.trim());
  const slugs = lines.map((line) => slugify(line, separator, lower));
  const joined = slugs.join('\n');

  const handleCopy = () => {
    if (!joined) return;
    navigator.clipboard.writeText(joined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Content Tools', href: '/tools/content' }, { label: 'Slug Generator' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Slug Generator</h1>
        <p className="text-ink-muted max-w-2xl">
          Turn a headline into a clean URL segment, lowercased and hyphenated.
          Accents fold to their base letters instead of being dropped.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center h-[30px]">
            <label className="text-[13px] font-medium">Text</label>
            <span className="font-mono text-[11px] text-ink-subtle tabular-nums">
              {lines.length} {lines.length === 1 ? 'line' : 'lines'}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="One headline per line"
            className="field h-56 !font-sans !text-[14px]"
          />
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                className="btn btn-secondary btn-sm !text-[12px]"
              >
                {ex.length > 24 ? ex.slice(0, 24) + '…' : ex}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center h-[30px]">
            <label className="text-[13px] font-medium">Slugs</label>
            <button
              onClick={handleCopy}
              disabled={!joined}
              className="btn btn-secondary btn-sm"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="panel-sunken h-56 p-4 overflow-auto space-y-1.5">
            {slugs.length ? (
              slugs.map((slug, i) => (
                <code
                  key={i}
                  className="block font-mono text-[13px] text-ink break-all"
                >
                  {slug || <span className="text-ink-subtle">—</span>}
                </code>
              ))
            ) : (
              <p className="text-ink-subtle text-[13px]">Slugs appear here</p>
            )}
          </div>
        </div>
      </div>

      <div className="panel p-5 flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-3">
          <span className="text-[13px] font-medium">Separator</span>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="select"
          >
            <option value="-">Hyphen</option>
            <option value="_">Underscore</option>
            <option value=".">Dot</option>
          </select>
        </label>

        <label className="flex items-center gap-2.5 text-[13px] cursor-pointer">
          <input
            type="checkbox"
            checked={lower}
            onChange={(e) => setLower(e.target.checked)}
            className="w-4 h-4 rounded accent-[var(--ink)]"
          />
          <span>Lowercase</span>
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <ShareLink value={input} />
        <span className="text-[12.5px] text-ink-muted">
          Copies a link that reopens this tool with your input.
        </span>
      </div>

      <AdContainer slot="1111111111" format="horizontal" />
    </div>
  );
}
