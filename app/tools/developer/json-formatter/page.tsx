'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import ShareLink from '@/components/shared/ShareLink';

const getLineAndColumn = (input: string, position: number): { line: number; column: number } => {
  let line = 1;
  let column = 1;
  for (let i = 0; i < position && i < input.length; i++) {
    if (input[i] === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
};

const findErrorPosition = (input: string, message: string): number => {
  // Modern browsers: "Unexpected token ] in JSON at position 113"
  let match = message.match(/at position (\d+)/);
  if (match) return parseInt(match[1]);

  // Fallback: "Unexpected token ] in JSON at position 113"
  match = message.match(/position (\d+)/);
  if (match) return parseInt(match[1]);

  // Chrome/Firefox format: Extract the context from error message
  // Error shows: Unexpected token ']', ..."cript",\n  ]\n}"
  // Find the token in the error message and locate it in input
  const tokenMatch = message.match(/Unexpected token '(.?)'/);
  if (tokenMatch) {
    const token = tokenMatch[1];
    if (token === '') {
      // Handle empty token case (like for ] or })
      return findTokenInInput(input, message, ']') || findTokenInInput(input, message, '}') || -1;
    }
    return input.lastIndexOf(token);
  }

  return -1;
};

const findTokenInInput = (input: string, message: string, token: string): number => {
  // Extract the context after the token from the error message
  // and find the last occurrence of that context in the input
  const contextMatch = message.match(new RegExp('\\' + token + '.*?["}]'));
  if (contextMatch) {
    const context = contextMatch[0];
    // Find where this context appears in the input
    const pos = input.lastIndexOf(context[0]); // Find the token
    if (pos !== -1) {
      return pos;
    }
  }
  // Fallback: just find the last occurrence of the token before any closing bracket
  for (let i = input.length - 1; i >= 0; i--) {
    if (input[i] === token && (i === input.length - 1 || input[i + 1] === '\n' || input[i + 1] === ' ' || input[i + 1] === '\t')) {
      return i;
    }
  }
  return -1;
};

const getDetailedError = (err: Error, input: string): string => {
  const message = err.message;

  // Try to extract position from error message
  const position = findErrorPosition(input, message);
  const lineInfo = position !== -1 ? getLineAndColumn(input, position) : null;
  const lineNumber = lineInfo ? `Line ${lineInfo.line}, Column ${lineInfo.column}` : 'Line unknown';

  if (message.includes('Unexpected token') && message.includes(']')) {
    return `✗ Trailing comma error at ${lineNumber}: Remove the comma before ] or }. JSON doesn't allow trailing commas in arrays or objects.`;
  }

  if (message.includes('Unexpected token') && message.includes('}')) {
    return `✗ Trailing comma error at ${lineNumber}: Remove the comma before } in your object. JSON doesn't allow trailing commas.`;
  }

  if (message.includes('Unexpected token') && message.includes(':')) {
    return `✗ Missing value at ${lineNumber}: Check for a colon (:) without a value after it.`;
  }

  if (message.includes('Unexpected token') && (message.includes('"') || message.includes("'"))) {
    if (position !== -1) {
      const context = input.substring(Math.max(0, position - 20), position + 20);
      return `✗ Syntax error at ${lineNumber} near: "...${context}...". Check for missing quotes, commas, or brackets.`;
    }
    return `✗ Quote error at ${lineNumber}: Check for mismatched or unclosed quotes.`;
  }

  if (message.includes('Unexpected end')) {
    const lastLine = input.split('\n').length;
    return `✗ Incomplete JSON at line ${lastLine}: Your JSON is cut off. Check that all brackets [] and braces {} are properly closed.`;
  }

  if (message.includes('Unexpected token') && message.includes(',')) {
    return `✗ Unexpected comma at ${lineNumber}: Check for extra commas or commas in wrong positions.`;
  }

  return `✗ Invalid JSON at ${lineNumber}: ${message}`;
};

export default function JsonFormatter() {
  const searchParams = useQueryParams();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);
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

  const handleFormat = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter JSON to format');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
    } catch (err) {
      setError(getDetailedError(err as Error, input));
    }
  };

  const handleMinify = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter JSON to minify');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (err) {
      setError(getDetailedError(err as Error, input));
    }
  };

  const handleValidate = () => {
    setError('');

    if (!input.trim()) {
      setError('Please enter JSON to validate');
      return;
    }

    try {
      JSON.parse(input);
      setError('✓ Valid JSON');
      setOutput('');
    } catch (err) {
      setError(getDetailedError(err as Error, input));
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

  const sampleJSON = JSON.stringify({
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    skills: ['JavaScript', 'React', 'TypeScript']
  }, null, 2);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Developer Tools', href: '/tools/developer' }, { label: 'JSON Formatter' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">JSON Formatter</h1>
        <p className="text-ink-muted max-w-2xl">
          Paste JSON to re-indent it, minify it, or find the line and column where it breaks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center h-9">
            <label className="text-[13px] font-medium">Input JSON</label>
            <button
              onClick={() => setInput(sampleJSON)}
              className="btn btn-secondary btn-sm"
            >
              Load Sample
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON"
            className="field h-80"
          />
        </div>

        {/* Output Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center h-9">
            <label className="text-[13px] font-medium">Output JSON</label>
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
            <option value={1}>1 space (Tab)</option>
          </select>
        </label>
      </div>

      {/* Error/Status Message */}
      {error && (
        <div className={`p-4 rounded-lg ${error.startsWith('✓') ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleFormat}
          className="btn btn-primary"
        >
          Format
        </button>
        <button
          onClick={handleMinify}
          className="btn btn-secondary"
        >
          Minify
        </button>
        <button
          onClick={handleValidate}
          className="btn btn-secondary"
        >
          Validate
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
        <AdContainer slot="1111111111" format="horizontal" />
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-line">
        <div>
          <h3 className="text-[14px] font-medium mb-2">Format</h3>
          <p className="text-sm text-ink-muted">Pretty-print JSON with custom indentation</p>
        </div>
        <div>
          <h3 className="text-[14px] font-medium mb-2">Validate</h3>
          <p className="text-sm text-ink-muted">Check if your JSON is valid</p>
        </div>
        <div>
          <h3 className="text-[14px] font-medium mb-2">Minify</h3>
          <p className="text-sm text-ink-muted">Compress JSON to smallest size</p>
        </div>
      </div>
    </div>
  );
}
