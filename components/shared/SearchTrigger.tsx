'use client';

import { useEffect, useState } from 'react';
import Icon from './Icon';

/**
 * Opens the palette by synthesising the shortcut it already listens for,
 * which keeps the open/close state in one place. Also the only way in on
 * touch devices, where there is no ⌘K.
 */
export default function SearchTrigger() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);

  const open = () =>
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true })
    );

  return (
    <button
      onClick={open}
      className="flex items-center gap-2 h-8 pl-2.5 pr-2 rounded-lg border border-line text-ink-subtle hover:text-ink hover:border-line-strong transition-colors"
      aria-label="Search tools"
    >
      <Icon name="search" className="w-3.5 h-3.5" />
      <span className="text-[13px] hidden sm:inline">Search</span>
      <kbd className="hidden sm:inline font-mono text-[10px] border border-line rounded px-1 py-0.5">
        {isMac ? '⌘' : 'Ctrl'}K
      </kbd>
    </button>
  );
}
