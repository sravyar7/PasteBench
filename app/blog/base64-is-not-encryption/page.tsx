import type { Metadata } from 'next';
import Link from 'next/link';
import PostLayout from '@/components/shared/PostLayout';
import { getPost, isLive } from '@/lib/posts';

const post = getPost('base64-is-not-encryption')!;

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
        Base64 turns readable text into something that looks scrambled, and
        that appearance does a lot of damage. It has no key, no secret, and no
        security property of any kind. Anyone who sees a Base64 string can read
        it in one step, and the fact that it looks encrypted is precisely why
        people keep misusing it.
      </p>

      <h2>What it actually does</h2>
      <p>
        Base64 solves a transport problem. Some channels — email headers, URLs,
        JSON string fields, XML attributes — only reliably carry printable
        ASCII. Raw binary sent through them gets mangled by anything that
        interprets a byte as a control character.
      </p>
      <p>
        So Base64 re-expresses arbitrary bytes using 64 safe characters: A–Z,
        a–z, 0–9, plus <code>+</code> and <code>/</code>. It reads three bytes
        (24 bits) at a time and emits four characters of six bits each.
      </p>

      <div className="keypoint">
        Three bytes in, four characters out. That is a 33 percent size
        increase, every time. Base64 makes data <em>bigger</em>, which is
        another reason it is not a compression or storage format.
      </div>

      <h2>The padding characters</h2>
      <p>
        When the input does not divide evenly into three-byte groups, the final
        group is padded and marked with one or two <code>=</code> characters:
      </p>
      <pre><code>{`"any"    → "YW55"       (3 bytes, no padding)
"any1"   → "YW55MQ=="   (4 bytes, two =)
"any12"  → "YW55MTI="   (5 bytes, one =)`}</code></pre>
      <p>
        Those equals signs are part of the format. Stripping them because they
        look untidy breaks strict decoders. If you have ever seen “invalid
        base64” on a string that looked fine, missing padding is a good first
        suspect.
      </p>

      <h2>Where the confusion causes real harm</h2>

      <h3>Storing credentials</h3>
      <p>
        HTTP Basic authentication sends <code>user:password</code> Base64
        encoded. This encodes nothing secret — it is one decode away from
        plaintext, which is why Basic auth is only acceptable over TLS. A
        config file with a Base64 password in it is a config file with a
        plaintext password in it.
      </p>

      <h3>“Obfuscating” data in a client</h3>
      <p>
        Base64 in a cookie, a URL parameter, or a hidden form field protects
        nothing. Anyone can decode and re-encode it, which means anyone can
        also <em>change</em> it. If your server trusts a Base64 value it
        received from a browser, it trusts a value the user controls entirely.
      </p>

      <h3>Confusing it with hashing</h3>
      <p>
        Base64 is reversible by design. A hash is not reversible at all — that
        is its entire purpose. If you need to verify something without storing
        the original, you need a hash, and for passwords specifically you need
        a deliberately slow one like bcrypt or Argon2. Our{' '}
        <Link href="/tools/developer/hash-generator">hash generator</Link>{' '}
        shows the difference plainly: the same input always produces the same
        digest, and no tool can turn that digest back.
      </p>

      <h2>What to use instead</h2>
      <ul>
        <li>
          <strong>Hiding data in transit:</strong> TLS. Not something you
          implement — something you turn on.
        </li>
        <li>
          <strong>Hiding data at rest:</strong> real encryption with a managed
          key, such as AES-GCM.
        </li>
        <li>
          <strong>Verifying something is unchanged:</strong> a hash, or an HMAC
          if an attacker could also change the hash.
        </li>
        <li>
          <strong>Getting binary through a text channel:</strong> Base64. This
          is the job it is good at.
        </li>
      </ul>

      <h2>The URL-safe variant</h2>
      <p>
        Standard Base64 uses <code>+</code> and <code>/</code>, both of which
        mean something else in a URL. The URL-safe variant swaps them for{' '}
        <code>-</code> and <code>_</code> and usually drops the padding. This
        is what JWTs use, which is why a token pasted into a standard decoder
        sometimes fails.
      </p>
      <p>
        If you want to see any of this directly, our{' '}
        <Link href="/tools/developer/base64-encoder">Base64 encoder</Link>{' '}
        round-trips text in both directions and handles the padding for you.
        Watch a password go in and come straight back out — it is the clearest
        possible demonstration that nothing was hidden.
      </p>
    </PostLayout>
  );
}
