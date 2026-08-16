'use client';


import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

export default function CodeBeautifier() {
  const searchParams = useQueryParams();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    const inputParam = searchParams.get('input');
    const langParam = searchParams.get('language');

    if (inputParam) {
      try {
        const decoded = decodeURIComponent(inputParam);
        setInput(decoded);
      } catch (e) {
        // Ignore decoding errors
      }
    }

    if (langParam) {
      const lang = langParam.toLowerCase();
      if (['javascript', 'json', 'html', 'xml'].includes(lang)) {
        setLanguage(lang);
      }
    }
  }, [searchParams]);

  const beautifyCode = (code: string, lang: string, indent: number): string => {
    let result = code;
    const indentStr = ' '.repeat(indent);

    if (lang === 'javascript' || lang === 'json') {
      let depth = 0;
      let inString = false;
      let stringChar = '';
      let formatted = '';

      for (let i = 0; i < result.length; i++) {
        const char = result[i];
        const prevChar = i > 0 ? result[i - 1] : '';

        if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
          }
        }

        if (!inString) {
          if (char === '{' || char === '[') {
            formatted += char + '\n' + indentStr.repeat(depth + 1);
            depth++;
          } else if (char === '}' || char === ']') {
            depth = Math.max(0, depth - 1);
            formatted = formatted.trimEnd() + '\n' + indentStr.repeat(depth) + char;
          } else if (char === ',') {
            formatted += char + '\n' + indentStr.repeat(depth);
          } else if (char === ':') {
            formatted += char + ' ';
          } else if (char === ' ' || char === '\n' || char === '\t') {
            if (formatted[formatted.length - 1] !== ' ' && formatted[formatted.length - 1] !== '\n') {
              formatted += ' ';
            }
          } else {
            formatted += char;
          }
        } else {
          formatted += char;
        }
      }
      return formatted.trim();
    }

    if (lang === 'html' || lang === 'xml') {
      let depth = 0;
      let formatted = '';
      let inTag = false;
      let tag = '';

      for (let i = 0; i < result.length; i++) {
        const char = result[i];

        if (char === '<') {
          if (formatted.trim()) {
            formatted += '\n' + indentStr.repeat(depth);
          }
          inTag = true;
          tag = char;
        } else if (char === '>') {
          tag += char;
          formatted += tag;
          inTag = false;

          if (tag.includes('</')) {
            depth = Math.max(0, depth - 1);
          } else if (!tag.includes('/>') && !tag.match(/<(br|hr|img|input|meta|link)[\s>]/i)) {
            depth++;
          }
        } else if (inTag) {
          tag += char;
        } else if (char.trim()) {
          formatted += char;
        }
      }
      return formatted.trim();
    }

    return result;
  };

  const handleBeautify = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter code to beautify');
      return;
    }

    try {
      const formatted = beautifyCode(input, language, indentSize);
      setOutput(formatted);
    } catch (err) {
      setError('Failed to beautify code. Please check your input.');
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
      <Breadcrumbs items={[{ label: 'Developer Tools', href: '/tools/developer' }, { label: 'Code Beautifier' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Code Beautifier</h1>
        <p className="text-ink-muted max-w-2xl">
          Re-indent minified JavaScript, JSON, HTML, or XML. Pick a language and an indent width.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-3">
          <div className="flex items-center h-9">
            <label className="text-[13px] font-medium">Input Code</label>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste code"
            className="field h-80"
          />
        </div>

        {/* Output Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center h-9">
            <label className="text-[13px] font-medium">Output Code</label>
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

      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="panel p-4">
          <label className="flex items-center gap-2">
            <span className="text-[13px] font-medium">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="select"
            >
              <option value="javascript">JavaScript</option>
              <option value="json">JSON</option>
              <option value="html">HTML</option>
              <option value="xml">XML</option>
            </select>
          </label>
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
          onClick={handleBeautify}
          className="btn btn-primary"
        >
          Beautify
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
        <AdContainer slot="4444444444" format="horizontal" />
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-line">
        <div>
          <h3 className="text-[14px] font-medium mb-2">Multiple languages</h3>
          <p className="text-sm text-ink-muted">JavaScript, JSON, HTML, and XML</p>
        </div>
        <div>
          <h3 className="text-[14px] font-medium mb-2">Custom indentation</h3>
          <p className="text-sm text-ink-muted">2, 4, or 8 space indentation</p>
        </div>
      </div>
    </div>
  );
}
