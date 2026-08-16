'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

// Every unit is expressed as a multiple of the category's base unit
// (metre, gram, litre), so conversion is one multiply and one divide.
const CATEGORIES = {
  length: {
    label: 'Length',
    units: {
      mm: { label: 'Millimetres', factor: 0.001 },
      cm: { label: 'Centimetres', factor: 0.01 },
      m: { label: 'Metres', factor: 1 },
      km: { label: 'Kilometres', factor: 1000 },
      in: { label: 'Inches', factor: 0.0254 },
      ft: { label: 'Feet', factor: 0.3048 },
      yd: { label: 'Yards', factor: 0.9144 },
      mi: { label: 'Miles', factor: 1609.344 },
    },
  },
  weight: {
    label: 'Weight',
    units: {
      mg: { label: 'Milligrams', factor: 0.001 },
      g: { label: 'Grams', factor: 1 },
      kg: { label: 'Kilograms', factor: 1000 },
      t: { label: 'Tonnes', factor: 1000000 },
      oz: { label: 'Ounces', factor: 28.349523125 },
      lb: { label: 'Pounds', factor: 453.59237 },
      st: { label: 'Stone', factor: 6350.29318 },
    },
  },
  volume: {
    label: 'Volume',
    units: {
      ml: { label: 'Millilitres', factor: 0.001 },
      l: { label: 'Litres', factor: 1 },
      m3: { label: 'Cubic metres', factor: 1000 },
      tsp: { label: 'Teaspoons (US)', factor: 0.00492892159 },
      tbsp: { label: 'Tablespoons (US)', factor: 0.0147867648 },
      cup: { label: 'Cups (US)', factor: 0.2365882365 },
      pt: { label: 'Pints (US)', factor: 0.473176473 },
      gal: { label: 'Gallons (US)', factor: 3.785411784 },
    },
  },
} as const;

type CategoryKey = keyof typeof CATEGORIES;

/** Trim float noise (1.0000000000000002) without clipping small values. */
function format(n: number): string {
  if (!isFinite(n)) return '';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e9 || abs < 1e-6) return n.toExponential(6);
  return parseFloat(n.toPrecision(12)).toString();
}

export default function UnitConverter() {
  const [category, setCategory] = useState<CategoryKey>('length');
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');

  const units = CATEGORIES[category].units as Record<
    string,
    { label: string; factor: number }
  >;

  const switchCategory = (next: CategoryKey) => {
    const keys = Object.keys(CATEGORIES[next].units);
    setCategory(next);
    setFrom(keys[0]);
    setTo(keys[1] ?? keys[0]);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const parsed = parseFloat(amount);
  const valid = amount.trim() !== '' && !isNaN(parsed);
  const result = valid
    ? format((parsed * units[from].factor) / units[to].factor)
    : '';

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Converter Tools', href: '/tools/converter' }, { label: 'Unit Converter' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Unit Converter</h1>
        <p className="text-ink-muted max-w-2xl">
          Length, weight, and volume across metric and imperial.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => (
          <button
            key={key}
            onClick={() => switchCategory(key)}
            className={`h-8 px-3 rounded-lg text-[13px] font-medium transition-colors ${
              category === key
                ? 'bg-invert-bg text-invert-fg'
                : 'text-ink-muted hover:text-ink hover:bg-surface-muted'
            }`}
          >
            {CATEGORIES[key].label}
          </button>
        ))}
      </div>

      <div className="panel p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-start">
          <div className="space-y-2">
            <label className="eyebrow block">From</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="field !py-2.5 !text-[15px] tabular-nums"
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="select w-full"
            >
              {Object.entries(units).map(([key, u]) => (
                <option key={key} value={key}>{u.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={swap}
            className="btn btn-secondary btn-sm sm:mt-7 justify-self-center"
          >
            Swap
          </button>

          <div className="space-y-2">
            <label className="eyebrow block">To</label>
            <output className="field !py-2.5 !text-[15px] tabular-nums block truncate bg-surface-sunken">
              {result || <span className="text-ink-subtle">—</span>}
            </output>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="select w-full"
            >
              {Object.entries(units).map(([key, u]) => (
                <option key={key} value={key}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {valid && (
          <p className="hairline pt-4 font-mono text-[12.5px] text-ink-muted">
            {format(parsed)} {units[from].label.toLowerCase()} = {result}{' '}
            {units[to].label.toLowerCase()}
          </p>
        )}
      </div>

      <AdContainer slot="1818181820" format="horizontal" />
    </div>
  );
}
