'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import ShareLink from '@/components/shared/ShareLink';

export default function UrlEncoder() {
  const searchParams = useQueryParams();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
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

  const handleEncode = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter text to encode');
      return;
    }

    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
    } catch (err) {
      setError('Failed to encode. Please check your input.');
    }
  };

  const handleDecode = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter URL-encoded text to decode');
      return;
    }

    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
    } catch (err) {
      setError('Invalid URL encoding. Please check your input.');
    }
  };

  const handleAutoDetect = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter text');
      return;
    }

    try {
      // Try to decode first
      const decoded = decodeURIComponent(input);
      if (decoded !== input) {
        setOutput(decoded);
      } else {
        // If no change, encode instead
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
      }
    } catch (err) {
      setError('Failed to process. Please check your input.');
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
    setError('');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Developer Tools', href: '/tools/developer' }, { label: 'URL Encoder' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">URL Encoder and Decoder</h1>
        <p className="text-ink-muted max-w-2xl">
          Percent-encode text for query strings and paths, or decode a URL that arrived escaped.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-3">
          <div className="flex items-center h-9">
            <label className="text-[13px] font-medium">Input</label>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode or URL-encoded text to decode..."
            className="field h-80"
          />
        </div>

        {/* Output Section */}
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

      {/* Error/Status Message */}
      {error && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          {error}
        </div>
      )}

      {/* Action Buttons */}
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
          onClick={handleAutoDetect}
          className="btn btn-secondary"
        >
          Auto Detect
        </button>
        <button
          onClick={handleClear}
          className="btn btn-ghost"
        >
          Clear
        </button>
      </div>

      {/* Ad Space */}
      <div className="flex items-center gap-3 pt-2">
        <ShareLink value={input} />
        <span className="text-[12.5px] text-ink-muted">
          Copies a link that reopens this tool with your input.
        </span>
      </div>

      <div className="py-4">
        <AdContainer slot="3333333333" format="horizontal" />
      </div>

      {/* Common Use Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-line">
        <div>
          <h3 className="text-[14px] font-medium mb-2">Example: Text to URL</h3>
          <p className="text-sm text-ink-muted font-mono">
            "Hello World!" → "Hello%20World%21"
          </p>
        </div>
        <div>
          <h3 className="text-[14px] font-medium mb-2">Use Cases</h3>
          <ul className="text-sm text-ink-muted space-y-1">
            <li>• Query parameters</li>
            <li>• API requests</li>
            <li>• Email addresses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
