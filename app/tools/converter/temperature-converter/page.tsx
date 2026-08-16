'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

type Scale = 'c' | 'f' | 'k';

const SCALES: { key: Scale; label: string; symbol: string }[] = [
  { key: 'c', label: 'Celsius', symbol: '°C' },
  { key: 'f', label: 'Fahrenheit', symbol: '°F' },
  { key: 'k', label: 'Kelvin', symbol: 'K' },
];

const toCelsius = (v: number, from: Scale) =>
  from === 'c' ? v : from === 'f' ? ((v - 32) * 5) / 9 : v - 273.15;

const fromCelsius = (c: number, to: Scale) =>
  to === 'c' ? c : to === 'f' ? (c * 9) / 5 + 32 : c + 273.15;

const round = (n: number) => parseFloat(n.toFixed(2)).toString();

export default function TemperatureConverter() {
  // One source of truth plus the field being edited, so every box stays
  // live without the three of them fighting each other.
  const [source, setSource] = useState<{ scale: Scale; raw: string }>({
    scale: 'c',
    raw: '20',
  });

  const parsed = parseFloat(source.raw);
  const valid = source.raw.trim() !== '' && !isNaN(parsed);
  const celsius = valid ? toCelsius(parsed, source.scale) : null;

  const valueFor = (scale: Scale) => {
    if (scale === source.scale) return source.raw;
    if (celsius === null) return '';
    return round(fromCelsius(celsius, scale));
  };

  // Below absolute zero nothing physical is being described.
  const belowAbsoluteZero = celsius !== null && celsius < -273.15;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Converter Tools', href: '/tools/converter' }, { label: 'Temperature Converter' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Temperature Converter</h1>
        <p className="text-ink-muted max-w-2xl">
          Celsius, Fahrenheit, and Kelvin, converted as you type. Edit any
          field and the other two follow.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SCALES.map((scale) => (
          <div key={scale.key} className="panel p-4 space-y-2">
            <label htmlFor={scale.key} className="eyebrow block">
              {scale.label}
            </label>
            <div className="flex items-baseline gap-1.5">
              <input
                id={scale.key}
                type="number"
                value={valueFor(scale.key)}
                onChange={(e) =>
                  setSource({ scale: scale.key, raw: e.target.value })
                }
                placeholder="—"
                className="w-full bg-transparent border-0 p-0 text-[1.75rem] font-medium tracking-tight tabular-nums focus:outline-none placeholder:text-ink-subtle"
              />
              <span className="text-ink-subtle text-[15px] shrink-0">
                {scale.symbol}
              </span>
            </div>
          </div>
        ))}
      </div>

      {belowAbsoluteZero && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          That is below absolute zero (−273.15 °C).
        </div>
      )}

      <div className="panel p-5">
        <h2 className="eyebrow mb-3">Reference</h2>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[12.5px]">
          {[
            ['Water freezes', '0 °C / 32 °F'],
            ['Room temperature', '20 °C / 68 °F'],
            ['Body temperature', '37 °C / 98.6 °F'],
            ['Water boils', '100 °C / 212 °F'],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-ink-subtle mb-1">{label}</dt>
              <dd className="text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <AdContainer slot="1818181821" format="horizontal" />
    </div>
  );
}
