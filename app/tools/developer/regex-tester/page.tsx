'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

export default function RegexTester() {
  const searchParams = useQueryParams();
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [flags, setFlags] = useState('g');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const param = searchParams.get('input');
    if (param) {
      try {
        setTestString(decodeURIComponent(param));
      } catch {
        // Ignore malformed encoding
      }
    }
  }, [searchParams]);

  const handleTest = () => {
    setError('');
    setOutput('');

    if (!pattern.trim()) {
      setError('Please enter a regex pattern');
      return;
    }

    if (!testString.trim()) {
      setError('Please enter test string');
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches = testString.match(regex);

      if (matches) {
        setOutput(`✓ ${matches.length} match(es) found:\n\n${matches.map((m, i) => `${i + 1}. ${m}`).join('\n')}`);
      } else {
        setOutput('✗ No matches found');
      }
    } catch (err) {
      setError(`Invalid regex: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setPattern('');
    setTestString('');
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Developer Tools', href: '/tools/developer' }, { label: 'Regex Tester' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Regex Tester</h1>
        <p className="text-ink-muted max-w-2xl">
          Write a pattern and see what it matches in your sample text as you type.
        </p>
      </div>

      <div className="space-y-4">
        {/* Pattern Input */}
        <div>
          <label className="text-[13px] font-medium mb-2 block">Regular Expression Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="/pattern/flags"
            className="w-full px-4 py-2 rounded-lg border border-line bg-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Flags */}
        <div>
          <label className="text-[13px] font-medium mb-2 block">Flags</label>
          <div className="flex gap-4">
            {['g', 'i', 'm', 's'].map(flag => (
              <label key={flag} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.includes(flag)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFlags(flags + flag);
                    } else {
                      setFlags(flags.replace(flag, ''));
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-ink font-mono">{flag}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-ink-subtle mt-2">g=global, i=case-insensitive, m=multiline, s=dotAll</p>
        </div>

        {/* Test String */}
        <div>
          <label className="text-[13px] font-medium mb-2 block">Test String</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test..."
            className="field h-40"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex justify-between items-center mb-2 h-9">
            <label className="text-[13px] font-medium block">Results</label>
            {output ? (
              <button
                onClick={handleCopy}
                className="btn btn-secondary btn-sm"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            ) : (
              <div className="h-[30px]" />
            )}
          </div>
          <div className="panel-sunken w-full h-40 p-4 font-mono text-[13px] leading-relaxed overflow-auto">
            {output ? (
              <pre className="text-ink">{output}</pre>
            ) : (
              <p className="text-ink-subtle">Results will appear here...</p>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleTest}
          className="btn btn-primary"
        >
          Test
        </button>
        <button
          onClick={handleClear}
          className="btn btn-ghost"
        >
          Clear
        </button>
      </div>

      {/* Ad Space */}
      <div className="py-4">
        <AdContainer slot="5555555555" format="horizontal" />
      </div>
    </div>
  );
}
