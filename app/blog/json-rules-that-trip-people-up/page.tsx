import type { Metadata } from 'next';
import Link from 'next/link';
import PostLayout from '@/components/shared/PostLayout';
import { getPost, isLive } from '@/lib/posts';

const post = getPost('json-rules-that-trip-people-up')!;

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
        JSON was carved out of JavaScript object syntax, and it kept the
        appearance while dropping most of the flexibility. That resemblance is
        the whole problem: code that looks obviously fine to anyone who writes
        JavaScript is rejected outright, and the parser error usually points at
        a character rather than explaining the rule.
      </p>

      <h2>Trailing commas</h2>
      <p>
        This is the most common failure by a wide margin.
      </p>
      <pre><code>{`{
  "name": "Ada",
  "role": "Engineer",     ← fine
}                          ← the comma above is not`}</code></pre>
      <p>
        JavaScript has allowed trailing commas for years, and most formatters
        add them deliberately because they keep diffs clean. JSON forbids them
        entirely, in both objects and arrays. Worse, the error is reported at
        the closing brace — one line <em>after</em> the actual mistake.
      </p>

      <div className="keypoint">
        If a parser complains about an unexpected <code>{'}'}</code> or{' '}
        <code>]</code>, look at the line above it. The problem is nearly always
        a comma with nothing following it.
      </div>

      <h2>Quotes</h2>
      <p>
        JSON requires double quotes, for both keys and string values. Single
        quotes are not an alternative, and unquoted keys are not permitted at
        all:
      </p>
      <pre><code>{`{ name: "Ada" }     ✗ key must be quoted
{ 'name': 'Ada' }   ✗ single quotes
{ "name": "Ada" }   ✓`}</code></pre>
      <p>
        This bites hardest when copying an object literal out of source code,
        where all three forms are perfectly legal JavaScript.
      </p>

      <h2>Comments</h2>
      <p>
        There are none. No <code>//</code>, no <code>/* */</code>. Douglas
        Crockford removed them on purpose, having seen people put parsing
        directives in comments.
      </p>
      <p>
        Config formats that appear to accept comments — <code>tsconfig.json</code>,
        VS Code settings — are using JSONC, a superset that specific tools
        understand. Send the same file to a strict parser and it fails. If you
        need a note inside real JSON, the usual workaround is a key nobody
        reads, like <code>"_comment"</code>.
      </p>

      <h2>Numbers</h2>
      <p>
        JSON numbers are decimal only. All of these are invalid:
      </p>
      <ul>
        <li><code>NaN</code> and <code>Infinity</code> — not values JSON has</li>
        <li><code>0x1F</code> — no hexadecimal</li>
        <li><code>.5</code> — needs a leading zero</li>
        <li><code>1.</code> — needs a digit after the point</li>
        <li><code>+5</code> — a leading plus is not allowed</li>
      </ul>
      <p>
        The subtler trap is precision. JSON does not specify a number size, but
        most parsers use a double, which stops being exact above 2<sup>53</sup>.
        A 64-bit database ID travelling as a JSON number can arrive quietly
        rounded. The standard fix is to send large IDs as strings.
      </p>

      <h2>Only these types exist</h2>
      <p>
        String, number, boolean, null, object, array. That is the complete
        list. No dates, no undefined, no functions, no comments.
      </p>
      <p>
        Dates get serialised as strings by convention — ISO 8601 like{' '}
        <code>2026-01-30T12:00:00Z</code>, or a Unix epoch if you prefer a
        number. Both are conventions your code has to agree on, not something
        JSON enforces. If you are staring at an epoch and want to know what
        moment it refers to, our{' '}
        <Link href="/tools/developer/timestamp-converter">timestamp converter</Link>{' '}
        will tell you.
      </p>
      <p>
        In JavaScript specifically, <code>JSON.stringify</code> silently drops
        object keys whose value is <code>undefined</code>. A field that
        vanished between sending and receiving was often never sent.
      </p>

      <h2>Duplicate keys</h2>
      <p>
        The specification does not forbid them, and it does not say what to do
        with them either. Most parsers keep the last one. Some keep the first.
        A few reject the document.
      </p>
      <pre><code>{`{ "id": 1, "id": 2 }   → usually { "id": 2 }, but do not rely on it`}</code></pre>
      <p>
        This is worth knowing because it has been used as an attack: two
        systems parsing the same payload and disagreeing about which value
        counts.
      </p>

      <h2>Reading the error</h2>
      <p>
        Parser messages name a position, not a cause. <em>Unexpected token</em>{' '}
        at some offset means the parser reached a character that cannot follow
        what came before — the real mistake is usually just before it.
      </p>
      <p>
        Our <Link href="/tools/developer/json-formatter">JSON formatter</Link>{' '}
        converts that offset into a line and column and names the likely cause,
        because “trailing comma at line 14” is a great deal more useful than
        “unexpected token at position 213”. It runs in your browser, so you can
        paste a production payload without it going anywhere.
      </p>
    </PostLayout>
  );
}
