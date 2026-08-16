'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import ShareLink from '@/components/shared/ShareLink';

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};

const ENTITY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(HTML_ENTITIES).map(([k, v]) => [v, k])
);

export default function HtmlEncoder() {
  const searchParams = useQueryParams();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const inputParam = searchParams.get('input');
    if (inputParam) {
      try {
        const decoded = decodeURIComponent(inputParam);
        setInput(decoded);
      } catch (e) {
        // Ignore decoding errors
      }
    }
  }, [searchParams]);

  const encodeHtml = (text: string): string => {
    return text.replace(/[&<>"'\/]/g, (char) => HTML_ENTITIES[char] || char);
  };

  const decodeHtml = (text: string): string => {
    let result = text;
    Object.entries(ENTITY_MAP).forEach(([entity, char]) => {
      result = result.replace(new RegExp(entity, 'g'), char);
    });
    return result;
  };

  const handleEncode = () => {
    if (input.trim()) {
      setOutput(encodeHtml(input));
    }
  };

  const handleDecode = () => {
    if (input.trim()) {
      setOutput(decodeHtml(input));
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
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Developer Tools', href: '/tools/developer' }, { label: 'HTML Encoder' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">HTML Entity Encoder</h1>
        <p className="text-ink-muted max-w-2xl">
          Escape angle brackets, quotes, and ampersands so markup renders as text, or reverse it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center h-9">
            <label className="text-[13px] font-medium">Input</label>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter HTML or entities..."
            className="field h-80"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center h-9">
            <label className="text-[13px] font-medium">Output</label>
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
          <div className="panel-sunken w-full h-80 p-4 font-mono text-[13px] leading-relaxed overflow-auto break-all">
            {output ? (
              <pre className="text-ink whitespace-pre-wrap">{output}</pre>
            ) : (
              <p className="text-ink-subtle">Output appears here</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleEncode}
          className="btn btn-primary"
        >
          Encode
        </button>
        <button
          onClick={handleDecode}
          className="btn btn-secondary"
        >
          Decode
        </button>
        <button
          onClick={handleClear}
          className="btn btn-ghost"
        >
          Clear
        </button>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <ShareLink value={input} />
        <span className="text-[12.5px] text-ink-muted">
          Copies a link that reopens this tool with your input.
        </span>
      </div>

      <div className="py-4">
        <AdContainer slot="7777777777" format="horizontal" />
      </div>
    </div>
  );
}
