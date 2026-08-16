'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import ShareLink from '@/components/shared/ShareLink';

export default function CaseConverter() {
  const searchParams = useQueryParams();
  const [input, setInput] = useState('');
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

  const cases = {
    uppercase: (s: string) => s.toUpperCase(),
    lowercase: (s: string) => s.toLowerCase(),
    titlecase: (s: string) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
    camelcase: (s: string) => s.split(/[\s_-]+/).map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)).join(''),
    snakecase: (s: string) => s.toLowerCase().replace(/[\s-]/g, '_'),
    kebabcase: (s: string) => s.toLowerCase().replace(/[\s_]/g, '-'),
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Content Tools', href: '/tools/content' }, { label: 'Case Converter' }]} />
      <div>
        <h1 className="headline text-[2rem] mb-2.5">Case Converter</h1>
        <p className="text-ink-muted max-w-2xl">
          Switch text between camelCase, snake_case, kebab-case, Title Case, upper, and lower.
        </p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text here..."
        className="field h-40"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(cases).map(([name, fn]) => {
          const result = fn(input);
          return (
            <div key={name} className="p-4 rounded-lg bg-surface-sunken border border-line">
              <p className="text-[13px] font-medium mb-2 capitalize">{name.replace(/case$/, '')}</p>
              <div className="relative">
                <code className="block font-mono text-sm text-ink-muted break-all mb-2">{result || '—'}</code>
                <button
                  onClick={() => handleCopy(result)}
                  className={`text-xs px-2 py-1 rounded transition ${
                    copied === result ? 'bg-green-600 text-white' : 'btn-secondary'
                  }`}
                >
                  {copied === result ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <ShareLink value={input} />
        <span className="text-[12.5px] text-ink-muted">
          Copies a link that reopens this tool with your input.
        </span>
      </div>

      <div className="py-4">
        <AdContainer slot="1010101010" format="horizontal" />
      </div>
    </div>
  );
}
