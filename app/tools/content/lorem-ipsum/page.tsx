'use client';

import { useState, useCallback, useEffect } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

const WORDS = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis
nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis
aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur
excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt
mollit anim id est laborum perspiciatis unde omnis iste natus error voluptatem
accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo
inventore veritatis quasi architecto beatae vitae dicta explicabo nemo ipsam
voluptas aspernatur aut odit fugit sequi nesciunt neque porro quisquam`
  .split(/\s+/)
  .filter(Boolean);

const OPENING = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

const pick = () => WORDS[Math.floor(Math.random() * WORDS.length)];

function sentence(): string {
  // 6–16 words reads like prose; anything tighter looks like a word list.
  const length = 6 + Math.floor(Math.random() * 11);
  const words = Array.from({ length }, pick);

  // A comma about half the time, never at either end.
  if (length > 8 && Math.random() > 0.5) {
    const at = 3 + Math.floor(Math.random() * (length - 5));
    words[at] += ',';
  }

  const text = words.join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1) + '.';
}

function paragraph(): string {
  const count = 3 + Math.floor(Math.random() * 4);
  return Array.from({ length: count }, sentence).join(' ');
}

type Mode = 'paragraphs' | 'sentences' | 'words';

export default function LoremIpsum() {
  const [mode, setMode] = useState<Mode>('paragraphs');
  const [count, setCount] = useState(3);
  const [classicOpening, setClassicOpening] = useState(true);
  const [output, setOutput] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let blocks: string[];

    if (mode === 'paragraphs') {
      blocks = Array.from({ length: count }, paragraph);
    } else if (mode === 'sentences') {
      blocks = [Array.from({ length: count }, sentence).join(' ')];
    } else {
      blocks = [Array.from({ length: count }, pick).join(' ')];
    }

    if (classicOpening && blocks.length) {
      if (mode === 'words') {
        const words = blocks[0].split(' ');
        blocks[0] = [...OPENING.replace(/[.,]/g, '').split(' '), ...words]
          .slice(0, count)
          .join(' ');
      } else {
        blocks[0] = `${OPENING} ${blocks[0]}`;
      }
    }

    setOutput(blocks);
  }, [mode, count, classicOpening]);

  useEffect(() => {
    generate();
  }, [generate]);

  const text = output.join('\n\n');

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Content Tools', href: '/tools/content' }, { label: 'Lorem Ipsum' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Lorem Ipsum Generator</h1>
        <p className="text-ink-muted max-w-2xl">
          Placeholder copy for mockups, in whatever quantity the layout needs.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(['paragraphs', 'sentences', 'words'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`h-8 px-3 rounded-lg text-[13px] font-medium capitalize transition-colors ${
              mode === m
                ? 'bg-invert-bg text-invert-fg'
                : 'text-ink-muted hover:text-ink hover:bg-surface-muted'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="panel p-5 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="count" className="text-[13px] font-medium capitalize">
              {mode}
            </label>
            <span className="font-mono text-[13px] tabular-nums">{count}</span>
          </div>
          <input
            id="count"
            type="range"
            min={1}
            max={mode === 'words' ? 200 : mode === 'sentences' ? 30 : 12}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-[var(--ink)]"
          />
        </div>

        <label className="hairline pt-5 flex items-center gap-2.5 text-[13px] cursor-pointer">
          <input
            type="checkbox"
            checked={classicOpening}
            onChange={(e) => setClassicOpening(e.target.checked)}
            className="w-4 h-4 rounded accent-[var(--ink)]"
          />
          <span>Start with “Lorem ipsum dolor sit amet”</span>
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center h-[30px]">
          <span className="text-[13px] font-medium">Output</span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-ink-subtle tabular-nums">
              {wordCount} words
            </span>
            <button onClick={handleCopy} className="btn btn-secondary btn-sm">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="panel-sunken p-5 max-h-[26rem] overflow-auto space-y-4">
          {output.map((block, i) => (
            <p key={i} className="text-[14px] leading-relaxed text-ink">
              {block}
            </p>
          ))}
        </div>
      </div>

      <button onClick={generate} className="btn btn-primary">
        Generate again
      </button>

      <AdContainer slot="1919191905" format="horizontal" />
    </div>
  );
}
