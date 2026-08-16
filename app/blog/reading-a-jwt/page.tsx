import type { Metadata } from 'next';
import Link from 'next/link';
import PostLayout from '@/components/shared/PostLayout';
import { getPost, isLive } from '@/lib/posts';

const post = getPost('reading-a-jwt')!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  // Scheduled but not yet due: reachable by direct link, kept out
  // of the index until its date arrives.
  ...(isLive(post) ? {} : { robots: { index: false, follow: false } }),
  openGraph: {
    title: post.title,
    description: post.description,
    type: 'article',
    publishedTime: post.published,
    images: [{ url: `/og/post/${post.slug}`, width: 1200, height: 630, alt: post.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
    images: [`/og/post/${post.slug}`],
  },
};

export default function Page() {
  return (
    <PostLayout slug={post.slug}>
      <p>
        A JSON Web Token looks like an opaque blob of secure-seeming
        characters, and it is neither opaque nor, by itself, secure. It is
        three pieces of base64 joined by dots, two of which anyone can read.
        Understanding which part does what clears up most of the confusion
        around them.
      </p>

      <h2>Three segments</h2>
      <pre><code>{`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← header
.
eyJzdWIiOiIxMjMiLCJuYW1lIjoiQWRhIn0     ← payload
.
dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gF   ← signature`}</code></pre>
      <p>
        The first two are base64url-encoded JSON. Decode them and you get
        readable objects. The third is a cryptographic signature over the first
        two, and it is the only part that requires a key.
      </p>

      <h3>The header</h3>
      <p>
        Says how the token was signed. Almost always something like{' '}
        <code>{`{"alg":"HS256","typ":"JWT"}`}</code>. It is metadata for the
        verifier, not for you.
      </p>

      <h3>The payload</h3>
      <p>
        The claims — who the token is about, when it expires, what it permits.
        Some names are standardised:
      </p>
      <ul>
        <li><code>sub</code> — subject, usually a user id</li>
        <li><code>iss</code> — issuer, who minted it</li>
        <li><code>aud</code> — audience, who it is intended for</li>
        <li><code>exp</code> — expiry, as a Unix timestamp in seconds</li>
        <li><code>iat</code> — issued at</li>
        <li><code>nbf</code> — not valid before</li>
      </ul>
      <p>
        The time claims are seconds, not milliseconds — a frequent source of
        tokens that appear to expire in 1970 or in the year 56000. Our{' '}
        <Link href="/tools/developer/timestamp-converter">timestamp converter</Link>{' '}
        detects which unit you have pasted.
      </p>

      <div className="keypoint">
        The payload is <strong>encoded, not encrypted</strong>. Anyone holding
        the token can read every claim in it. Never put anything in a JWT that
        the bearer should not see.
      </div>

      <h2>What the signature actually proves</h2>
      <p>
        The signature is computed over the header and payload using a secret
        (for HMAC algorithms like HS256) or a private key (for RSA and ECDSA
        ones like RS256). Change a single character of the payload and the
        signature no longer matches.
      </p>
      <p>
        So the signature proves <em>integrity and origin</em>: this token was
        issued by someone holding the key, and has not been altered since. It
        proves nothing about confidentiality, because there is none.
      </p>

      <h2>Decoding is not verifying</h2>
      <p>
        This is the distinction that matters most, and the one most often
        collapsed.
      </p>
      <p>
        <strong>Decoding</strong> is base64 in reverse. It needs no key, works
        in any browser, and tells you what the token claims. Any decoder —
        including{' '}
        <Link href="/tools/developer/jwt-decoder">ours</Link> — does only this.
      </p>
      <p>
        <strong>Verifying</strong> recomputes the signature with your key and
        checks it matches, then checks the token has not expired and was
        intended for you. It requires the key, so it belongs on your server and
        nowhere else.
      </p>
      <p>
        A token whose claims look right may still be forged. Anyone can craft a
        JWT saying <code>{`{"role":"admin"}`}</code>; what they cannot do is
        sign it without your key. Trusting a decoded payload without verifying
        the signature is the classic JWT vulnerability.
      </p>

      <h2>The alg:none problem</h2>
      <p>
        Early JWT libraries honoured a header saying <code>{`"alg":"none"`}</code>,
        which declares the token unsigned — and dutifully accepted it. An
        attacker could take a valid token, rewrite the payload, set the
        algorithm to none, drop the signature, and be admitted.
      </p>
      <p>
        Modern libraries reject this, but the lesson generalises: never let the
        token tell you how to validate it. Decide server-side which algorithm
        you accept and refuse everything else.
      </p>

      <h2>Practical notes</h2>
      <ul>
        <li>
          <strong>Keep them short-lived.</strong> A JWT cannot be revoked
          without extra machinery, because verification is offline by design.
          Minutes to hours, not weeks.
        </li>
        <li>
          <strong>Mind the size.</strong> Every claim travels on every request.
          Tokens stuffed with permissions get expensive.
        </li>
        <li>
          <strong>Watch where you store them.</strong> In localStorage, any XSS
          can read the token. An httpOnly cookie is generally safer, with CSRF
          handled separately.
        </li>
        <li>
          <strong>Do not paste live tokens anywhere.</strong> Including into
          decoders. A JWT is a credential; treat a real one like a password.
        </li>
      </ul>

      <p>
        Our <Link href="/tools/developer/jwt-decoder">JWT decoder</Link> reads
        the header and claims in your browser, renders the time claims as real
        dates, and says clearly that it does not verify anything — because no
        page on the open web should be asking for your signing key.
      </p>
    </PostLayout>
  );
}
