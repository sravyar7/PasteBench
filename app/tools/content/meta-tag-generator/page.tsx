'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

/** Without this, a title containing a quote closes the attribute early
 *  and produces markup that silently breaks the page it's pasted into. */
const escapeAttr = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Google truncates around these widths. Not hard limits, but the point
// at which the tail stops being shown.
const LIMITS = { title: 60, description: 155 };

export default function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [copied, setCopied] = useState(false);

  // Built section by section so a blank field drops its tag without
  // leaving a stray blank line in the output.
  const keep = (lines: (string | null)[]) => lines.filter((l): l is string => !!l);

  const standard = keep([
    title && `<title>${escapeAttr(title)}</title>`,
    description && `<meta name="description" content="${escapeAttr(description)}">`,
    url && `<link rel="canonical" href="${escapeAttr(url)}">`,
  ]);

  const openGraph = keep([
    '<meta property="og:type" content="website">',
    title && `<meta property="og:title" content="${escapeAttr(title)}">`,
    description && `<meta property="og:description" content="${escapeAttr(description)}">`,
    url && `<meta property="og:url" content="${escapeAttr(url)}">`,
    image && `<meta property="og:image" content="${escapeAttr(image)}">`,
  ]);

  const twitter = keep([
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`,
    title && `<meta name="twitter:title" content="${escapeAttr(title)}">`,
    description && `<meta name="twitter:description" content="${escapeAttr(description)}">`,
    image && `<meta name="twitter:image" content="${escapeAttr(image)}">`,
  ]);

  const tags = !title && !description && !url && !image
    ? ''
    : [
        standard.join('\n'),
        ['<!-- Open Graph -->', ...openGraph].join('\n'),
        ['<!-- Twitter -->', ...twitter].join('\n'),
      ]
        .filter(Boolean)
        .join('\n\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(tags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Counter = ({ value, limit }: { value: string; limit: number }) => {
    const over = value.length > limit;
    return (
      <span
        className={`font-mono text-[11px] tabular-nums ${
          over ? 'text-red-600 dark:text-red-400' : 'text-ink-subtle'
        }`}
      >
        {value.length}/{limit}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Content Tools', href: '/tools/content' }, { label: 'Meta Tag Generator' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Meta Tag Generator</h1>
        <p className="text-ink-muted max-w-2xl">
          Fill in a title and description, then copy the tags into your page
          head. Includes Open Graph and Twitter cards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="t" className="text-[13px] font-medium">Title</label>
              <Counter value={title} limit={LIMITS.title} />
            </div>
            <input
              id="t"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What the page is about"
              className="field !py-2.5 !font-sans !text-[14px]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="d" className="text-[13px] font-medium">Description</label>
              <Counter value={description} limit={LIMITS.description} />
            </div>
            <textarea
              id="d"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="One or two sentences a searcher would click"
              className="field h-24 !font-sans !text-[14px]"
            />
          </div>

          <div>
            <label htmlFor="u" className="text-[13px] font-medium mb-2 block">
              Canonical URL
            </label>
            <input
              id="u"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page"
              className="field !py-2.5 !text-[13px]"
            />
          </div>

          <div>
            <label htmlFor="i" className="text-[13px] font-medium mb-2 block">
              Share image URL
            </label>
            <input
              id="i"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/cover.png"
              className="field !py-2.5 !text-[13px]"
            />
            <p className="text-[12.5px] text-ink-muted mt-2">
              1200 × 630 is the size most platforms crop to.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center h-[30px]">
            <label className="text-[13px] font-medium">Output</label>
            <button
              onClick={handleCopy}
              disabled={!tags.trim()}
              className="btn btn-secondary btn-sm"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="panel-sunken h-[26rem] p-4 overflow-auto">
            {tags.trim() ? (
              <pre className="font-mono text-[12.5px] leading-relaxed text-ink whitespace-pre-wrap">
                {tags}
              </pre>
            ) : (
              <p className="text-ink-subtle text-[13px]">
                Tags appear here as you fill the fields
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Result preview — the thing people are actually optimising for. */}
      {(title || description) && (
        <div className="panel p-5">
          <h2 className="eyebrow mb-4">Roughly how a result looks</h2>
          <div className="max-w-xl">
            <p className="text-[12px] text-ink-muted truncate">
              {url || 'example.com'}
            </p>
            <p className="text-[18px] text-[#1a0dab] dark:text-[#8ab4f8] truncate mt-0.5">
              {title.slice(0, LIMITS.title) || 'Page title'}
              {title.length > LIMITS.title && '…'}
            </p>
            <p className="text-[13px] text-ink-muted leading-snug mt-1">
              {description.slice(0, LIMITS.description) ||
                'The description shows up here, under the title.'}
              {description.length > LIMITS.description && '…'}
            </p>
          </div>
        </div>
      )}

      <AdContainer slot="1313131313" format="horizontal" />
    </div>
  );
}
