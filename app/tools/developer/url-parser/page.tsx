'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import ShareLink from '@/components/shared/ShareLink';

const SAMPLE =
  'https://user:pw@shop.example.co.uk:8443/catalogue/shoes?colour=blue%20green&size=42&size=43#reviews';

export default function UrlParser() {
  const searchParams = useQueryParams();
  const [input, setInput] = useState(SAMPLE);
  const [copied, setCopied] = useState('');

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

  let url: URL | null = null;
  let error = '';

  const trimmed = input.trim();
  if (trimmed) {
    try {
      url = new URL(trimmed);
    } catch {
      error = trimmed.includes('://')
        ? 'That is not a URL the browser can parse.'
        : 'A URL needs a scheme — try prefixing it with https://';
    }
  }

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  // Repeated keys are legal and meaningful, so group rather than overwrite.
  const params: [string, string[]][] = url
    ? [...new Set(url.searchParams.keys())].map((k) => [
        k,
        url!.searchParams.getAll(k),
      ])
    : [];

  const parts = url
    ? ([
        ['Scheme', url.protocol.replace(':', '')],
        ['Username', url.username],
        ['Password', url.password ? '•'.repeat(url.password.length) : ''],
        ['Host', url.hostname],
        ['Port', url.port || '(default)'],
        ['Path', url.pathname],
        ['Query', url.search.replace(/^\?/, '')],
        ['Fragment', url.hash.replace(/^#/, '')],
        ['Origin', url.origin],
      ] as [string, string][]).filter(([, v]) => v !== '')
    : [];

  const segments = url
    ? url.pathname.split('/').filter(Boolean).map(decodeURIComponent)
    : [];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Developer Tools', href: '/tools/developer' }, { label: 'URL Parser' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">URL Parser</h1>
        <p className="text-ink-muted max-w-2xl">
          Break a URL into its parts and read the query string as a table, with
          repeated parameters kept separate and escaping decoded.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center h-[30px]">
          <label htmlFor="url" className="text-[13px] font-medium">URL</label>
          <button onClick={() => setInput(SAMPLE)} className="btn btn-secondary btn-sm">
            Load sample
          </button>
        </div>
        <textarea
          id="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com/path?key=value"
          className="field h-24"
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          {error}
        </div>
      )}

      {url && (
        <>
          <div className="space-y-2">
            {parts.map(([label, value]) => (
              <div key={label} className="panel p-4 flex items-center justify-between gap-4">
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

          {segments.length > 0 && (
            <div className="panel p-5">
              <h2 className="eyebrow mb-3">Path segments</h2>
              <ol className="flex flex-wrap items-center gap-2 font-mono text-[13px]">
                {segments.map((seg, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-surface-muted border border-line">
                      {seg}
                    </span>
                    {i < segments.length - 1 && (
                      <span className="text-ink-subtle">/</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {params.length > 0 && (
            <div className="panel p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="eyebrow">Query parameters</h2>
                <span className="font-mono text-[11px] text-ink-subtle tabular-nums">
                  {params.length}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-left">
                      <th className="eyebrow pb-2 pr-4 font-normal">Key</th>
                      <th className="eyebrow pb-2 font-normal">Value (decoded)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {params.map(([key, values]) => (
                      <tr key={key} className="border-t border-line">
                        <td className="py-2 pr-4 font-mono text-ink align-top break-all">
                          {key}
                        </td>
                        <td className="py-2 font-mono text-ink-muted break-all">
                          {values.map((v, i) => (
                            <div key={i}>
                              {v || <span className="text-ink-subtle">(empty)</span>}
                            </div>
                          ))}
                          {values.length > 1 && (
                            <span className="text-[11px] text-ink-subtle">
                              repeated {values.length} times
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex items-center gap-3 pt-2">
        <ShareLink value={input} />
        <span className="text-[12.5px] text-ink-muted">
          Copies a link that reopens this tool with your input.
        </span>
      </div>

      <AdContainer slot="2020202002" format="horizontal" />
    </div>
  );
}
