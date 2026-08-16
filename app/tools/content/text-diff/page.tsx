'use client';

import { useState, useMemo } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

type Row = { kind: 'same' | 'add' | 'remove'; text: string; a?: number; b?: number };

/**
 * Longest common subsequence over lines, walked back into a diff.
 *
 * The naive "compare line N to line N" approach reports every line after an
 * insertion as changed, which is useless on the case people actually have:
 * one line added near the top.
 */
function diffLines(left: string[], right: string[]): Row[] {
  const n = left.length;
  const m = right.length;

  // Guard against the O(n*m) table on very large inputs.
  const table: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0)
  );

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i][j] =
        left[i] === right[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }

  const rows: Row[] = [];
  let i = 0;
  let j = 0;

  while (i < n && j < m) {
    if (left[i] === right[j]) {
      rows.push({ kind: 'same', text: left[i], a: i + 1, b: j + 1 });
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      rows.push({ kind: 'remove', text: left[i], a: i + 1 });
      i++;
    } else {
      rows.push({ kind: 'add', text: right[j], b: j + 1 });
      j++;
    }
  }
  while (i < n) rows.push({ kind: 'remove', text: left[i], a: ++i });
  while (j < m) rows.push({ kind: 'add', text: right[j], b: ++j });

  return rows;
}

const MAX_LINES = 2000;

export default function TextDiff() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [onlyChanges, setOnlyChanges] = useState(false);

  const { rows, tooBig } = useMemo(() => {
    const prep = (s: string) =>
      s.split('\n').map((line) => {
        let out = line;
        if (ignoreWhitespace) out = out.trim().replace(/\s+/g, ' ');
        if (ignoreCase) out = out.toLowerCase();
        return out;
      });

    const a = left.split('\n');
    const b = right.split('\n');
    if (a.length > MAX_LINES || b.length > MAX_LINES) {
      return { rows: [] as Row[], tooBig: true };
    }

    // Compare normalised lines but display the originals.
    const na = prep(left);
    const nb = prep(right);
    const diffed = diffLines(na, nb);

    return {
      rows: diffed.map((row) => ({
        ...row,
        text:
          row.kind === 'add'
            ? b[(row.b ?? 1) - 1]
            : a[(row.a ?? 1) - 1],
      })),
      tooBig: false,
    };
  }, [left, right, ignoreWhitespace, ignoreCase]);

  const added = rows.filter((r) => r.kind === 'add').length;
  const removed = rows.filter((r) => r.kind === 'remove').length;
  const ready = left.trim() !== '' || right.trim() !== '';
  const visible = onlyChanges ? rows.filter((r) => r.kind !== 'same') : rows;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Content Tools', href: '/tools/content' }, { label: 'Text Diff' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Text Diff Checker</h1>
        <p className="text-ink-muted max-w-2xl">
          Compare two versions line by line and see exactly what changed.
          Matching lines stay aligned even when one side gains or loses lines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { label: 'Original', value: left, set: setLeft },
          { label: 'Changed', value: right, set: setRight },
        ].map((pane) => (
          <div key={pane.label} className="space-y-3">
            <div className="flex justify-between items-center h-[30px]">
              <label className="text-[13px] font-medium">{pane.label}</label>
              <span className="font-mono text-[11px] text-ink-subtle tabular-nums">
                {pane.value ? pane.value.split('\n').length : 0} lines
              </span>
            </div>
            <textarea
              value={pane.value}
              onChange={(e) => pane.set(e.target.value)}
              placeholder="Paste text"
              className="field h-56"
              spellCheck={false}
            />
          </div>
        ))}
      </div>

      <div className="panel p-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        {[
          { label: 'Ignore whitespace', on: ignoreWhitespace, set: setIgnoreWhitespace },
          { label: 'Ignore case', on: ignoreCase, set: setIgnoreCase },
          { label: 'Only changes', on: onlyChanges, set: setOnlyChanges },
        ].map((opt) => (
          <label
            key={opt.label}
            className="flex items-center gap-2.5 text-[13px] cursor-pointer"
          >
            <input
              type="checkbox"
              checked={opt.on}
              onChange={(e) => opt.set(e.target.checked)}
              className="w-4 h-4 rounded accent-[var(--ink)]"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>

      {tooBig ? (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          That is more than {MAX_LINES} lines a side. The comparison would lock
          up the page, so it has been skipped.
        </div>
      ) : (
        ready && (
          <>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[12.5px] text-emerald-700 dark:text-emerald-400 tabular-nums">
                +{added}
              </span>
              <span className="font-mono text-[12.5px] text-red-700 dark:text-red-400 tabular-nums">
                −{removed}
              </span>
              {added === 0 && removed === 0 && (
                <span className="text-[13px] text-ink-muted">
                  The two sides are identical.
                </span>
              )}
            </div>

            <div className="panel-sunken overflow-auto max-h-[32rem]">
              <table className="w-full font-mono text-[12.5px] leading-relaxed">
                <tbody>
                  {visible.map((row, i) => (
                    <tr
                      key={i}
                      className={
                        row.kind === 'add'
                          ? 'bg-emerald-500/10'
                          : row.kind === 'remove'
                          ? 'bg-red-500/10'
                          : ''
                      }
                    >
                      <td className="w-10 text-right pr-2 py-0.5 text-ink-subtle select-none tabular-nums">
                        {row.a ?? ''}
                      </td>
                      <td className="w-10 text-right pr-2 py-0.5 text-ink-subtle select-none tabular-nums">
                        {row.b ?? ''}
                      </td>
                      <td className="w-5 py-0.5 text-center select-none text-ink-subtle">
                        {row.kind === 'add' ? '+' : row.kind === 'remove' ? '−' : ''}
                      </td>
                      <td className="py-0.5 pr-4 whitespace-pre-wrap break-all text-ink">
                        {row.text || ' '}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}

      <AdContainer slot="1919191904" format="horizontal" />
    </div>
  );
}
