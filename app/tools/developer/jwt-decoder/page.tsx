'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

/** JWTs use base64url: '-' and '_' swapped in, padding stripped. */
function decodeSegment(segment: string): unknown {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  // atob yields Latin-1; this round-trip recovers UTF-8 claims intact.
  const text = decodeURIComponent(
    Array.from(binary, (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
  );
  return JSON.parse(text);
}

const TIME_CLAIMS: Record<string, string> = {
  exp: 'Expires',
  iat: 'Issued at',
  nbf: 'Not before',
  auth_time: 'Authenticated at',
};

export default function JwtDecoder() {
  const searchParams = useQueryParams();
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const input = searchParams.get('input');
    if (input) {
      try {
        setToken(decodeURIComponent(input));
      } catch {
        // Ignore malformed encoding
      }
    }
  }, [searchParams]);

  let header: unknown = null;
  let payload: unknown = null;
  let error = '';

  const trimmed = token.trim();
  if (trimmed) {
    const parts = trimmed.split('.');
    if (parts.length !== 3) {
      error = `A JWT has three dot-separated parts; this has ${parts.length}.`;
    } else {
      try {
        header = decodeSegment(parts[0]);
        payload = decodeSegment(parts[1]);
      } catch {
        error = 'Those segments are not valid base64url-encoded JSON.';
      }
    }
  }

  const claims = payload && typeof payload === 'object'
    ? (payload as Record<string, unknown>)
    : null;

  const expSeconds = typeof claims?.exp === 'number' ? claims.exp : null;
  const expired = expSeconds !== null && expSeconds * 1000 < Date.now();

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const Panel = ({ label, value }: { label: string; value: unknown }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center h-[30px]">
        <span className="text-[13px] font-medium">{label}</span>
        <button
          onClick={() => copy(label, JSON.stringify(value, null, 2))}
          className="btn btn-secondary btn-sm"
        >
          {copied === label ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="panel-sunken p-4 overflow-auto max-h-72">
        <pre className="font-mono text-[13px] leading-relaxed text-ink">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Developer Tools', href: '/tools/developer' }, { label: 'JWT Decoder' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">JWT Decoder</h1>
        <p className="text-ink-muted max-w-2xl">
          Read the header and claims out of a JSON Web Token. Decoding happens
          in this tab, so the token is never transmitted.
        </p>
      </div>

      <div className="space-y-3">
        <label htmlFor="jwt" className="text-[13px] font-medium block">
          Token
        </label>
        <textarea
          id="jwt"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="field h-32"
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          {error}
        </div>
      )}

      {header !== null && payload !== null && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Panel label="Header" value={header} />
            <Panel label="Payload" value={payload} />
          </div>

          {claims && (
            <div className="panel p-5">
              <h2 className="eyebrow mb-4">Timestamps</h2>
              {Object.keys(TIME_CLAIMS).some((k) => typeof claims[k] === 'number') ? (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(TIME_CLAIMS).map(([key, label]) =>
                    typeof claims[key] === 'number' ? (
                      <div key={key}>
                        <dt className="text-[12.5px] text-ink-subtle mb-1">
                          {label} <code className="font-mono">({key})</code>
                        </dt>
                        <dd className="font-mono text-[13px]">
                          {new Date((claims[key] as number) * 1000).toISOString()}
                        </dd>
                      </div>
                    ) : null
                  )}
                </dl>
              ) : (
                <p className="text-[13px] text-ink-muted">
                  This token carries no time claims.
                </p>
              )}

              {expSeconds !== null && (
                <p
                  className={`mt-4 pt-4 hairline text-[13px] ${
                    expired
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {expired
                    ? 'This token has expired.'
                    : 'This token has not expired yet.'}
                </p>
              )}
            </div>
          )}
        </>
      )}

      <div className="panel p-5">
        <h2 className="eyebrow mb-3">What this does not do</h2>
        <p className="text-[13px] text-ink-muted leading-relaxed">
          Decoding is not verification. A JWT’s payload is base64, not
          encryption — anyone holding the token can read it, and anyone can
          craft one with whatever claims they like. Only a signature check
          against your secret or public key tells you a token is genuine, and
          that has to happen on your server, never here.
        </p>
      </div>

      <AdContainer slot="1919191902" format="horizontal" />
    </div>
  );
}
