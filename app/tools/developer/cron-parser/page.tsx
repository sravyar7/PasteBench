'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import ShareLink from '@/components/shared/ShareLink';

const FIELDS = [
  { name: 'Minute', min: 0, max: 59 },
  { name: 'Hour', min: 0, max: 23 },
  { name: 'Day of month', min: 1, max: 31 },
  { name: 'Month', min: 1, max: 12 },
  { name: 'Day of week', min: 0, max: 6 },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const NAMED: Record<string, string> = {
  '@yearly': '0 0 1 1 *', '@annually': '0 0 1 1 *', '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0', '@daily': '0 0 * * *', '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

/** Expand one field into the set of values it matches. */
function expand(part: string, min: number, max: number): number[] | string {
  const out = new Set<number>();

  for (const chunk of part.split(',')) {
    const [range, stepRaw] = chunk.split('/');
    const step = stepRaw ? Number(stepRaw) : 1;
    if (stepRaw !== undefined && (!Number.isInteger(step) || step < 1)) {
      return `step must be a positive whole number, got "${stepRaw}"`;
    }

    let lo: number, hi: number;
    if (range === '*') {
      lo = min; hi = max;
    } else if (range.includes('-')) {
      const [a, b] = range.split('-').map(Number);
      if (!Number.isInteger(a) || !Number.isInteger(b)) return `bad range "${range}"`;
      lo = a; hi = b;
    } else {
      const n = Number(range);
      if (!Number.isInteger(n)) return `"${range}" is not a number`;
      lo = n; hi = stepRaw ? max : n;
    }

    if (lo < min || hi > max || lo > hi) {
      return `"${chunk}" is outside the allowed ${min}–${max}`;
    }
    for (let v = lo; v <= hi; v += step) out.add(v);
  }

  return [...out].sort((a, b) => a - b);
}

const list = (values: number[], label: (n: number) => string): string => {
  const names = values.map(label);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
};

/** Build an English sentence from the five expanded fields. */
function describe(sets: number[][], raw: string[]): string {
  const [minutes, hours, dom, months, dow] = sets;
  const every = (i: number) => raw[i] === '*';

  let time: string;
  if (every(0) && every(1)) time = 'Every minute';
  else if (every(0)) time = `Every minute during ${list(hours, (h) => `${String(h).padStart(2, '0')}:00`)}`;
  else if (every(1)) time = `At minute ${list(minutes, String)} of every hour`;
  else if (minutes.length === 1 && hours.length <= 4)
    time = `At ${list(hours, (h) => `${String(h).padStart(2, '0')}:${String(minutes[0]).padStart(2, '0')}`)}`;
  else time = `At minute ${list(minutes, String)} past hour ${list(hours, String)}`;

  const parts: string[] = [];
  if (!every(4)) parts.push(`on ${list(dow, (d) => DAYS[d % 7])}`);
  if (!every(2)) parts.push(`on day ${list(dom, String)} of the month`);
  if (!every(3)) parts.push(`in ${list(months, (m) => MONTHS[m - 1])}`);

  return parts.length ? `${time}, ${parts.join(', ')}.` : `${time}, every day.`;
}

const EXAMPLES = [
  { expr: '*/15 * * * *', note: 'Every quarter hour' },
  { expr: '0 9 * * 1-5', note: 'Weekday mornings' },
  { expr: '0 0 1 * *', note: 'Start of each month' },
  { expr: '30 3 * * 0', note: 'Sunday, early' },
];

export default function CronParser() {
  const searchParams = useQueryParams();
  const [input, setInput] = useState('*/15 * * * *');

  useEffect(() => {
    const param = searchParams.get('input');
    if (param) {
      try {
        setInput(decodeURIComponent(param));
      } catch {
        // Ignore malformed encoding
      }
    }
  }, [searchParams]);

  const normalised = NAMED[input.trim().toLowerCase()] ?? input.trim();
  const parts = normalised.split(/\s+/).filter(Boolean);

  let error = '';
  let sets: number[][] = [];

  if (normalised) {
    if (parts.length !== 5) {
      error =
        parts.length === 6
          ? 'Six fields means a seconds column, which standard cron does not have. Drop the first field.'
          : `A cron expression has five fields; this has ${parts.length}.`;
    } else {
      for (let i = 0; i < 5; i++) {
        const got = expand(parts[i], FIELDS[i].min, FIELDS[i].max);
        if (typeof got === 'string') {
          error = `${FIELDS[i].name}: ${got}`;
          break;
        }
        if (got.length === 0) {
          error = `${FIELDS[i].name} matches nothing.`;
          break;
        }
        sets.push(got);
      }
    }
  }

  const valid = !error && sets.length === 5;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Developer Tools', href: '/tools/developer' }, { label: 'Cron Parser' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Cron Expression Parser</h1>
        <p className="text-ink-muted max-w-2xl">
          Paste a cron schedule and read back what it actually does, in plain
          English, before you trust it to a server.
        </p>
      </div>

      <div className="space-y-3">
        <label htmlFor="cron" className="text-[13px] font-medium block">
          Expression
        </label>
        <input
          id="cron"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="*/15 * * * *"
          spellCheck={false}
          className="field !py-3 !text-[18px]"
        />
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.expr}
              onClick={() => setInput(ex.expr)}
              title={ex.note}
              className="btn btn-secondary btn-sm font-mono"
            >
              {ex.expr}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          {error}
        </div>
      )}

      {valid && (
        <>
          <div className="panel p-5">
            <p className="eyebrow mb-2.5">In words</p>
            <p className="text-[17px] leading-relaxed">{describe(sets, parts)}</p>
          </div>

          <div className="space-y-2">
            {FIELDS.map((field, i) => (
              <div key={field.name} className="panel p-4 flex items-baseline gap-4">
                <span className="eyebrow w-32 shrink-0">{field.name}</span>
                <code className="font-mono text-[14px] text-ink w-20 shrink-0">
                  {parts[i]}
                </code>
                <span className="text-[13px] text-ink-muted">
                  {parts[i] === '*'
                    ? 'every value'
                    : sets[i].length > 12
                    ? `${sets[i].length} values`
                    : sets[i].join(', ')}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex items-center gap-3 pt-2">
        <ShareLink value={input} />
        <span className="text-[12.5px] text-ink-muted">
          Copies a link that reopens this tool with your input.
        </span>
      </div>

      <div className="panel p-5">
        <h2 className="eyebrow mb-4">Field reference</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
          {[
            ['*', 'every value'],
            ['5', 'exactly 5'],
            ['1-5', 'the range 1 through 5'],
            ['*/15', 'every 15th value'],
            ['1,15,30', 'those values only'],
            ['@daily', 'shorthand for 0 0 * * *'],
          ].map(([sym, meaning]) => (
            <div key={sym} className="flex gap-3">
              <code className="font-mono text-ink w-20 shrink-0">{sym}</code>
              <span className="text-ink-muted">{meaning}</span>
            </div>
          ))}
        </dl>
        <p className="text-[12.5px] text-ink-muted mt-5 pt-4 hairline">
          Day of week runs 0–6 from Sunday. When both day-of-month and
          day-of-week are restricted, most cron implementations fire when{' '}
          <em>either</em> matches, not both — a common surprise.
        </p>
      </div>

      <AdContainer slot="2020202001" format="horizontal" />
    </div>
  );
}
