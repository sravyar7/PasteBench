'use client';

import { useEffect, useState } from 'react';
import Icon from './Icon';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    setReady(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="btn btn-ghost btn-sm w-8 px-0"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {/* Render nothing until mounted so the icon can't contradict the
          class the inline script already applied. */}
      {ready && <Icon name={dark ? 'sun' : 'moon'} className="w-4 h-4" />}
    </button>
  );
}
