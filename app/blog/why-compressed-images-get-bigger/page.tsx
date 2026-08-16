import type { Metadata } from 'next';
import Link from 'next/link';
import PostLayout from '@/components/shared/PostLayout';
import { getPost, isLive } from '@/lib/posts';

const post = getPost('why-compressed-images-get-bigger')!;

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
        You drag a 400 KB screenshot into a compressor, set the quality to 80
        percent, and get back a file of 950 KB. Nothing is broken. The tool did
        exactly what you asked, and the answer is that “compression” is not one
        thing — it is several different bets about what your picture looks
        like, and a screenshot loses most of them.
      </p>

      <h2>Two families of compression</h2>
      <p>
        Image formats split into two camps. <strong>Lossless</strong> formats
        like PNG reconstruct the original pixel for pixel. They win by finding
        repetition: a run of four hundred identical grey pixels is stored once
        with a count, not four hundred times.
      </p>
      <p>
        <strong>Lossy</strong> formats like JPEG throw information away.
        JPEG chops the image into 8×8 blocks, converts each to frequencies, and
        discards the high-frequency detail your eye is least likely to miss.
        For a photograph, where every pixel already differs slightly from its
        neighbour, this is enormously effective.
      </p>

      <div className="keypoint">
        The mismatch is this: PNG is betting your image has large flat regions.
        JPEG is betting it does not. Feed either one the wrong picture and it
        loses that bet expensively.
      </div>

      <h2>Why a screenshot becomes larger as JPEG</h2>
      <p>
        A screenshot is mostly flat colour with hard edges — a solid toolbar, a
        white panel, crisp black text. PNG stores that in almost nothing,
        because runs of identical pixels compress beautifully.
      </p>
      <p>
        JPEG sees the same image as a nightmare. A hard black-on-white edge is,
        in frequency terms, an enormous spike across the whole spectrum. To
        represent it, JPEG has to keep coefficients it would normally discard.
        You get two bad outcomes at once: the file grows, <em>and</em> the text
        develops the grey smearing around letters known as ringing.
      </p>
      <p>
        So a 400 KB PNG screenshot re-encoded as JPEG can genuinely land at
        900 KB and look worse. The compressor did not malfunction. It applied a
        photographic algorithm to something that is not a photograph.
      </p>

      <h2>What to use instead</h2>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Best format</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Photograph</td>
            <td>JPEG or WebP</td>
            <td>Continuous tone, no hard edges to preserve</td>
          </tr>
          <tr>
            <td>Screenshot, UI, diagram</td>
            <td>WebP or PNG</td>
            <td>Flat colour and sharp edges survive intact</td>
          </tr>
          <tr>
            <td>Logo or icon</td>
            <td>SVG if you have it</td>
            <td>Vectors scale without any pixels at all</td>
          </tr>
          <tr>
            <td>Needs transparency</td>
            <td>WebP or PNG</td>
            <td>JPEG has no alpha channel</td>
          </tr>
        </tbody>
      </table>

      <p>
        WebP is the useful middle. It has both a lossy and a lossless mode, and
        its lossless mode beats PNG on most UI imagery while its lossy mode is
        competitive with JPEG on photographs. Every current browser supports
        it. If you only remember one rule: <strong>WebP unless you have a
        specific reason not to.</strong>
      </p>

      <h2>The transparency trap</h2>
      <p>
        JPEG has no alpha channel. Convert a PNG with a transparent background
        to JPEG and something must fill that space. Naive converters fill it
        with black, which is why logos sometimes arrive with an ugly dark box
        around them.
      </p>
      <p>
        Filling with white instead is usually right, but it is still a
        decision being made on your behalf. If transparency matters, the format
        has to support it — there is no quality setting that recovers it.
      </p>

      <h2>Picking a quality number</h2>
      <p>
        For lossy formats, quality is a dial between size and artefacts, and it
        is not linear. Dropping from 100 to 85 usually removes half the bytes
        and is invisible. Dropping from 85 to 70 removes much less and starts
        to show. Below about 50, blocking around edges becomes obvious.
      </p>
      <p>
        Around <strong>75 to 80</strong> is the usual sweet spot for
        photographs. For anything with text in it, do not use a lossy format at
        all — no quality setting makes JPEG good at letterforms.
      </p>

      <h2>Check, do not assume</h2>
      <p>
        The one habit worth building is comparing the output size to the input
        before you ship. A compressor that cannot get a file smaller should
        tell you so rather than quietly hand back something worse.
      </p>
      <p>
        Our{' '}
        <Link href="/tools/image/image-compressor">image compressor</Link>{' '}
        shows both sizes side by side and picks a sensible starting format from
        what you dropped in — WebP for PNG input, JPEG for photographs. It runs
        in your browser, so nothing is uploaded to find out.
      </p>
    </PostLayout>
  );
}
