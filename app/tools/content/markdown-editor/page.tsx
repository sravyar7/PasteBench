'use client';

import { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

const SAMPLE = `# Markdown Editor

Type on the left, see the result on the right.

## What renders

- Lists, **bold**, *italic*, and \`inline code\`
- [Links](https://example.com) and > blockquotes
- Tables and fenced code blocks

\`\`\`js
const greet = (name) => \`Hello, \${name}\`;
\`\`\`

| Syntax | Result |
| ------ | ------ |
| \`**x**\` | **x** |
| \`_x_\`  | _x_ |

> Everything is rendered in this tab.
`;

marked.setOptions({ gfm: true, breaks: true });

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [copied, setCopied] = useState('');
  const [mounted, setMounted] = useState(false);

  // DOMPurify needs a real DOM, so the first render stays empty.
  useEffect(() => setMounted(true), []);

  const html = useMemo(() => {
    if (!mounted) return '';
    const raw = marked.parse(markdown, { async: false }) as string;
    // Markdown permits raw HTML, so anything pasted here gets sanitised
    // before it reaches innerHTML.
    return DOMPurify.sanitize(raw);
  }, [markdown, mounted]);

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Content Tools', href: '/tools/content' }, { label: 'Markdown Editor' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Markdown Editor</h1>
        <p className="text-ink-muted max-w-2xl">
          Write Markdown on the left and watch the rendered HTML update beside
          it. Supports GitHub-flavoured tables, code fences, and task lists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center h-[30px]">
            <label className="text-[13px] font-medium">Markdown</label>
            <button
              onClick={() => setMarkdown('')}
              className="btn btn-ghost btn-sm"
            >
              Clear
            </button>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="# Start typing"
            className="field h-[30rem]"
            spellCheck={false}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center h-[30px]">
            <label className="text-[13px] font-medium">Preview</label>
            <button
              onClick={() => copy('html', html)}
              disabled={!html}
              className="btn btn-secondary btn-sm"
            >
              {copied === 'html' ? 'Copied' : 'Copy HTML'}
            </button>
          </div>
          <div
            className="panel-sunken h-[30rem] p-5 overflow-auto md-preview"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <AdContainer slot="1212121212" format="horizontal" />

      {/* Preview styles. Scoped here so the token palette drives them and
          the app doesn't need a typography plugin. */}
      <style jsx global>{`
        .md-preview {
          font-size: 14px;
          line-height: 1.7;
          color: var(--ink);
        }
        .md-preview > *:first-child { margin-top: 0; }
        .md-preview h1,
        .md-preview h2,
        .md-preview h3,
        .md-preview h4 {
          font-weight: 560;
          letter-spacing: -0.02em;
          line-height: 1.25;
          margin: 1.6em 0 0.6em;
        }
        .md-preview h1 { font-size: 1.6em; }
        .md-preview h2 { font-size: 1.3em; }
        .md-preview h3 { font-size: 1.1em; }
        .md-preview p { margin: 0.9em 0; }
        .md-preview a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .md-preview ul,
        .md-preview ol { margin: 0.9em 0; padding-left: 1.4em; }
        .md-preview ul { list-style: disc; }
        .md-preview ol { list-style: decimal; }
        .md-preview li { margin: 0.3em 0; }
        .md-preview code {
          font-family: var(--font-mono);
          font-size: 0.86em;
          background: var(--surface-muted);
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 0.12em 0.35em;
        }
        .md-preview pre {
          background: var(--surface-muted);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 1em;
          overflow-x: auto;
          margin: 1.1em 0;
        }
        .md-preview pre code {
          background: none;
          border: 0;
          padding: 0;
          font-size: 0.85em;
        }
        .md-preview blockquote {
          border-left: 2px solid var(--line-strong);
          padding-left: 1em;
          margin: 1.1em 0;
          color: var(--ink-muted);
        }
        .md-preview table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.1em 0;
          font-size: 0.93em;
        }
        .md-preview th,
        .md-preview td {
          border: 1px solid var(--line);
          padding: 0.5em 0.7em;
          text-align: left;
        }
        .md-preview th {
          background: var(--surface-muted);
          font-weight: 560;
        }
        .md-preview hr {
          border: 0;
          border-top: 1px solid var(--line);
          margin: 1.8em 0;
        }
        .md-preview img { max-width: 100%; border-radius: 8px; }
      `}</style>
    </div>
  );
}
