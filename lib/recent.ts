'use client';

/**
 * Recently opened tools, kept in localStorage.
 *
 * Deliberately stores nothing but tool ids — no input, no timestamps
 * beyond ordering. The privacy policy says your input never leaves the
 * tab, and that has to stay true of what gets persisted too.
 */
const KEY = 'onlinetools:recent';
const LIMIT = 6;

export function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export function pushRecent(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const next = [id, ...getRecent().filter((v) => v !== id)].slice(0, LIMIT);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode and full quotas both throw; recents are optional.
  }
}

export function clearRecent(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Ignore
  }
}
