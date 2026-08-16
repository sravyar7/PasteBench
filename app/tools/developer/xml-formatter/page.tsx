'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import ShareLink from '@/components/shared/ShareLink';

export default function XmlFormatter() {
  const searchParams = useQueryParams();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

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

  const formatXml = (xml: string, indent: number): string => {
    const tab = ' '.repeat(indent);
    let formatted = '';
    let depth = 0;
    let inTag = false;
    let tagContent = '';

    for (let i = 0; i < xml.length; i++) {
      const char = xml[i];

      if (char === '<') {
        if (tagContent.trim()) {
          formatted += tagContent.trim() + '\n';
          tagContent = '';
        }
        inTag = true;
        tagContent = char;
      } else if (char === '>') {
        tagContent += char;
        inTag = false;

        const isClosing = tagContent.includes('</');
        const isSelfClosing = tagContent.includes('/>');
        const isComment = tagContent.includes('<!--');
        const isDeclaration = tagContent.includes('<?');

        if (isClosing && !isDeclaration && !isComment) {
          depth = Math.max(0, depth - 1);
        }

        formatted += tab.repeat(depth) + tagContent.trim() + '\n';

        if (!isClosing && !isSelfClosing && !isComment && !isDeclaration) {
          depth++;
        }
        tagContent = '';
      } else if (inTag) {
        tagContent += char;
      } else if (char.trim()) {
        tagContent += char;
      }
    }

    return formatted.trim();
  };

  const handleFormat = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter XML to format');
      return;
    }

    try {
      const formatted = formatXml(input, indentSize);
      setOutput(formatted);
    } catch (err) {
      setError('Invalid XML. Please check your input.');
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
      <Breadcrumbs items={[{ label: 'Developer Tools', href: '/tools/developer' }, { label: 'XML Formatter' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">XML Formatter</h1>
        <p className="text-ink-muted max-w-2xl">
          Indent nested XML so the structure is readable, and spot the tag you forgot to close.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center h-9">
            <label className="text-[13px] font-medium">Input XML</label>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste XML"
            className="field h-80"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center h-9">
            <label className="text-[13px] font-medium">Output XML</label>
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
          <div className="panel-sunken w-full h-80 p-4 font-mono text-[13px] leading-relaxed overflow-auto">
            {output ? (
              <pre className="text-ink">{output}</pre>
            ) : (
              <p className="text-ink-subtle">Output appears here</p>
            )}
          </div>
        </div>
      </div>

      <div className="panel p-4">
        <label className="flex items-center gap-2">
          <span className="text-[13px] font-medium">Indent Size:</span>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="select"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
          </select>
        </label>
      </div>

      {error && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleFormat}
          className="btn btn-primary"
        >
          Format
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
        <AdContainer slot="8888888888" format="horizontal" />
      </div>
    </div>
  );
}
