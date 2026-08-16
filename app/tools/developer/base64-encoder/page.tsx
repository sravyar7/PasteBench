'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import ShareLink from '@/components/shared/ShareLink';

export default function Base64Encoder() {
  const searchParams = useQueryParams();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
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

  const handleEncode = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter text to encode');
      return;
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch (err) {
      setError('Failed to encode. Please check your input.');
    }
  };

  const handleDecode = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter base64 to decode');
      return;
    }

    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
    } catch (err) {
      setError('Invalid Base64. Please check your input.');
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
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
    } catch {
      // If decode fails, encode instead
      try {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } catch (err) {
        setError('Failed to process. Please check your input.');
      }
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
      <Breadcrumbs items={[{ label: 'Developer Tools', href: '/tools/developer' }, { label: 'Base64 Encoder' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Base64 Encoder and Decoder</h1>
        <p className="text-ink-muted max-w-2xl">
          Encode text to Base64 or read it back out. Padding is handled for you.
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
            placeholder="Enter text to encode or Base64 to decode..."
            className="field h-80"
          />
          <p className="text-xs text-ink-subtle">
            Character count: {input.length} | Encoded size: {Math.ceil((input.length * 4) / 3)} bytes
          </p>
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
        <AdContainer slot="2222222222" format="horizontal" />
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-line">
        <div>
          <h3 className="text-[14px] font-medium mb-2">Encode</h3>
          <p className="text-sm text-ink-muted">Convert text to Base64 format</p>
        </div>
        <div>
          <h3 className="text-[14px] font-medium mb-2">Decode</h3>
          <p className="text-sm text-ink-muted">Convert Base64 back to text</p>
        </div>
        <div>
          <h3 className="text-[14px] font-medium mb-2">Auto detect</h3>
          <p className="text-sm text-ink-muted">Automatically detect and convert</p>
        </div>
      </div>
    </div>
  );
}
