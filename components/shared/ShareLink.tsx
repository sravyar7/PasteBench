'use client';

import { useState } from 'react';
import Icon from './Icon';

/**
 * Builds a link to this tool with the current input baked into the URL.
 *
 * The homepage promises that links carry your input, and every tool that
 * reads ?input= could already be linked to — but only by hand-writing the
 * query string, which nobody was going to do.
 *
 * Deliberately not offered on the JWT decoder, hash generator, or password
 * generator: a share link puts the input into browser history, chat logs,
 * and referrer headers, and those three routinely hold live credentials.
 */
export default function ShareLink({
  value,
  params,
  className = '',
}: {
  value: string;
  params?: Record<string, string>;
  className?: string;
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'long'>('idle');

  const build = () => {
    const url = new URL(window.location.href);
    url.search = '';
    if (value) url.searchParams.set('input', value);
    for (const [key, v] of Object.entries(params ?? {})) {
      if (v) url.searchParams.set(key, v);
    }
    return url.toString();
  };

  const copy = () => {
    const url = build();

    // Servers and proxies start truncating well before the spec runs out;
    // a silently clipped link is worse than being told it won't fit.
    if (url.length > 2000) {
      setState('long');
      setTimeout(() => setState('idle'), 3500);
      return;
    }

    navigator.clipboard.writeText(url);
    setState('copied');
    setTimeout(() => setState('idle'), 2000);
  };

  return (
    <button
      onClick={copy}
      disabled={!value.trim()}
      title="Copy a link that reopens this tool with the current input"
      className={`btn btn-secondary btn-sm ${className}`}
    >
      <Icon name="link" className="w-3.5 h-3.5" />
      {state === 'copied'
        ? 'Link copied'
        : state === 'long'
        ? 'Too long to link'
        : 'Share'}
    </button>
  );
}
