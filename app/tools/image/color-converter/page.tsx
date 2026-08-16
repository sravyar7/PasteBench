'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

type Rgb = { r: number; g: number; b: number };
type Hsl = { h: number; s: number; l: number };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function hexToRgb(hex: string): Rgb | null {
  let value = hex.trim().replace(/^#/, '');
  // Expand the three-digit shorthand: #abc -> #aabbcc
  if (/^[\da-f]{3}$/i.test(value)) {
    value = value.split('').map((c) => c + c).join('');
  }
  if (!/^[\da-f]{6}$/i.test(value)) return null;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

const rgbToHex = ({ r, g, b }: Rgb) =>
  '#' + [r, g, b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return { h: 0, s: 0, l: l * 100 };

  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;

  return { h: (h * 60 + 360) % 360, s: s * 100, l: l * 100 };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
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

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

const round = (n: number) => Math.round(n);

export default function ColorConverter() {
  // RGB is the pivot; every field reads from it and writes back into it.
  const [rgb, setRgb] = useState<Rgb>({ r: 37, g: 99, b: 235 });
  const [hexDraft, setHexDraft] = useState('#2563eb');
  const [copied, setCopied] = useState('');

  const hsl = rgbToHsl(rgb);
  const hex = rgbToHex(rgb);
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${round(hsl.h)}, ${round(hsl.s)}%, ${round(hsl.l)}%)`;

  const applyHex = (value: string) => {
    setHexDraft(value);
    const parsed = hexToRgb(value);
    if (parsed) setRgb(parsed);
  };

  const setChannel = (key: keyof Rgb, value: number) => {
    const next = { ...rgb, [key]: clamp(value, 0, 255) };
    setRgb(next);
    setHexDraft(rgbToHex(next));
  };

  const setHslPart = (key: keyof Hsl, value: number) => {
    const bounds: Record<keyof Hsl, number> = { h: 360, s: 100, l: 100 };
    const next = { ...hsl, [key]: clamp(value, 0, bounds[key]) };
    const asRgb = hslToRgb(next);
    setRgb(asRgb);
    setHexDraft(rgbToHex(asRgb));
  };

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const hexValid = hexToRgb(hexDraft) !== null;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Image Tools', href: '/tools/image' }, { label: 'Color Converter' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Color Converter</h1>
        <p className="text-ink-muted max-w-2xl">
          Enter a color as HEX, RGB, or HSL and watch the other two update.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-3">
          <div
            className="rounded-xl border border-line h-44"
            style={{ backgroundColor: hex }}
          />
          <input
            type="color"
            value={hex}
            onChange={(e) => applyHex(e.target.value)}
            className="w-full h-10 rounded-lg border border-line bg-surface cursor-pointer"
            aria-label="Pick a color"
          />
        </div>

        <div className="space-y-3">
          {[
            { label: 'HEX', value: hex },
            { label: 'RGB', value: rgbString },
            { label: 'HSL', value: hslString },
          ].map(({ label, value }) => (
            <div key={label} className="panel p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="eyebrow mb-1">{label}</p>
                <code className="font-mono text-[14px] text-ink">{value}</code>
              </div>
              <button
                onClick={() => copy(label, value)}
                className="btn btn-secondary btn-sm shrink-0"
              >
                {copied === label ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="panel p-5 space-y-4">
          <h2 className="eyebrow">Hex</h2>
          <input
            value={hexDraft}
            onChange={(e) => applyHex(e.target.value)}
            spellCheck={false}
            className={`field !py-2.5 !text-[15px] ${
              hexValid ? '' : 'border-red-400 dark:border-red-800'
            }`}
          />
          {!hexValid && (
            <p className="text-[12.5px] text-red-700 dark:text-red-400">
              Needs three or six hex digits, like #2563eb.
            </p>
          )}
        </div>

        <div className="panel p-5 space-y-4">
          <h2 className="eyebrow">Channels</h2>
          {(['r', 'g', 'b'] as (keyof Rgb)[]).map((key) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium uppercase">{key}</label>
                <span className="font-mono text-[12.5px] tabular-nums">{rgb[key]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={255}
                value={rgb[key]}
                onChange={(e) => setChannel(key, Number(e.target.value))}
                className="w-full accent-[var(--ink)]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-5 space-y-4">
        <h2 className="eyebrow">Hue, saturation, lightness</h2>
        {([
          ['h', 'Hue', 360, '°'],
          ['s', 'Saturation', 100, '%'],
          ['l', 'Lightness', 100, '%'],
        ] as [keyof Hsl, string, number, string][]).map(([key, label, max, unit]) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[13px] font-medium">{label}</label>
              <span className="font-mono text-[12.5px] tabular-nums">
                {round(hsl[key])}{unit}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={max}
              value={round(hsl[key])}
              onChange={(e) => setHslPart(key, Number(e.target.value))}
              className="w-full accent-[var(--ink)]"
            />
          </div>
        ))}
      </div>

      <AdContainer slot="1616161616" format="horizontal" />
    </div>
  );
}
