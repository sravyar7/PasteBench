'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

type Hsl = { h: number; s: number; l: number };

function hexToHsl(hex: string): Hsl {
  const v = hex.replace(/^#/, '');
  const r = parseInt(v.slice(0, 2), 16) / 255;
  const g = parseInt(v.slice(2, 4), 16) / 255;
  const b = parseInt(v.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return { h: 0, s: 0, l: l * 100 };

  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;

  return { h: (h * 60 + 360) % 360, s: s * 100, l: l * 100 };
}

function hslToHex({ h, s, l }: Hsl): string {
  const sn = s / 100, ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;

  const [r, g, b] =
    h < 60 ? [c, x, 0] :
    h < 120 ? [x, c, 0] :
    h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] :
    h < 300 ? [x, 0, c] : [c, 0, x];

  return (
    '#' +
    [r, g, b]
      .map((n) => Math.round((n + m) * 255).toString(16).padStart(2, '0'))
      .join('')
  );
}

const wrap = (h: number) => ((h % 360) + 360) % 360;
const clamp = (n: number) => Math.min(100, Math.max(0, n));

const SCHEMES = {
  analogous: {
    label: 'Analogous',
    note: 'Neighbouring hues — quiet, low contrast.',
    build: (b: Hsl) => [-40, -20, 0, 20, 40].map((d) => ({ ...b, h: wrap(b.h + d) })),
  },
  complementary: {
    label: 'Complementary',
    note: 'The opposite hue, for accents that need to fight.',
    build: (b: Hsl) => [
      { ...b, l: clamp(b.l + 18) },
      b,
      { ...b, l: clamp(b.l - 18) },
      { ...b, h: wrap(b.h + 180) },
      { ...b, h: wrap(b.h + 180), l: clamp(b.l - 18) },
    ],
  },
  triadic: {
    label: 'Triadic',
    note: 'Three hues evenly spaced around the wheel.',
    build: (b: Hsl) => [
      b,
      { ...b, h: wrap(b.h + 120) },
      { ...b, h: wrap(b.h + 240) },
      { ...b, h: wrap(b.h + 120), l: clamp(b.l + 15) },
      { ...b, h: wrap(b.h + 240), l: clamp(b.l + 15) },
    ],
  },
  shades: {
    label: 'Shades',
    note: 'One hue from light to dark — a UI ramp.',
    build: (b: Hsl) => [88, 70, 52, 34, 18].map((l) => ({ ...b, l })),
  },
} as const;

type SchemeKey = keyof typeof SCHEMES;

export default function ColorPalette() {
  const [base, setBase] = useState('#2563eb');
  const [scheme, setScheme] = useState<SchemeKey>('analogous');
  const [copied, setCopied] = useState('');

  const colors = SCHEMES[scheme].build(hexToHsl(base)).map(hslToHex);

  const copy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(''), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(colors.join('\n'));
    setCopied('all');
    setTimeout(() => setCopied(''), 1500);
  };

  const randomise = () => {
    const bytes = new Uint8Array(3);
    crypto.getRandomValues(bytes);
    setBase(
      '#' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    );
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Image Tools', href: '/tools/image' }, { label: 'Color Palette' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Color Palette Generator</h1>
        <p className="text-ink-muted max-w-2xl">
          Pick a base color and build a matching set, with hex codes ready to
          copy.
        </p>
      </div>

      <div className="panel p-5 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-3">
          <span className="text-[13px] font-medium">Base</span>
          <input
            type="color"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            className="w-12 h-9 rounded-lg border border-line bg-surface cursor-pointer"
          />
          <code className="font-mono text-[13px] uppercase">{base}</code>
        </label>

        <button onClick={randomise} className="btn btn-secondary btn-sm">
          Random
        </button>

        <button onClick={copyAll} className="btn btn-secondary btn-sm sm:ml-auto">
          {copied === 'all' ? 'Copied' : 'Copy all'}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(SCHEMES) as SchemeKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setScheme(key)}
            className={`h-8 px-3 rounded-lg text-[13px] font-medium transition-colors ${
              scheme === key
                ? 'bg-invert-bg text-invert-fg'
                : 'text-ink-muted hover:text-ink hover:bg-surface-muted'
            }`}
          >
            {SCHEMES[key].label}
          </button>
        ))}
      </div>

      <p className="text-[13px] text-ink-muted">{SCHEMES[scheme].note}</p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {colors.map((color, i) => (
          <button
            key={`${color}-${i}`}
            onClick={() => copy(color)}
            className="group text-left"
          >
            <div
              className="h-32 rounded-xl border border-line transition-transform group-hover:-translate-y-1"
              style={{ backgroundColor: color }}
            />
            <div className="mt-2 flex items-center justify-between gap-1">
              <code className="font-mono text-[12px] uppercase">{color}</code>
              <span className="font-mono text-[10px] text-ink-subtle">
                {copied === color ? 'copied' : 'copy'}
              </span>
            </div>
          </button>
        ))}
      </div>

      <AdContainer slot="1717171717" format="horizontal" />
    </div>
  );
}
