import type { Metadata } from 'next';
import Link from 'next/link';
import { postsByDate, formatDate } from '@/lib/posts';
import { SITE_URL } from '@/lib/site';
import { BRAND_ARTICLES } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Short pieces on the things these tools deal with: image formats, encodings, JSON, tokens, and the mistakes that come with them.',
  alternates: {
    canonical: '/blog',
    types: { 'application/rss+xml': `${SITE_URL}/blog/rss.xml` },
  },
};

export default function Blog() {
  const posts = postsByDate();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: BRAND_ARTICLES,
    url: `${SITE_URL}/blog`,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.published,
      url: `${SITE_URL}/blog/${p.slug}`,
    })),
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-5 sm:px-6 py-14 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header className="mb-14">
        <p className="eyebrow mb-4">Articles</p>
        <h1 className="display text-[2.25rem] sm:text-[3rem] mb-5">
          Notes on the
          <br />
          awkward bits.
        </h1>
        <p className="text-ink-muted text-[16px] leading-relaxed">
          Short pieces on what these tools actually deal with — why a
          compressed image got bigger, what a token really contains, which
          JSON rules bite. Written when there is something worth saying.
        </p>
      </header>

      <div className="space-y-px bg-line border border-line rounded-xl overflow-hidden">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-canvas p-6 hover:bg-surface-muted transition-colors group"
          >
            <div className="flex items-center gap-3 font-mono text-[11px] text-ink-subtle mb-2.5">
              <time dateTime={post.published}>{formatDate(post.published)}</time>
              <span>·</span>
              <span>{post.minutes} min</span>
            </div>
            <h2 className="text-[17px] font-medium tracking-tight mb-2 group-hover:text-accent transition-colors">
              {post.title}
            </h2>
            <p className="text-[13.5px] text-ink-muted leading-relaxed">
              {post.description}
            </p>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-[13px] text-ink-subtle">
        <a
          href="/blog/rss.xml"
          className="hover:text-ink transition-colors underline decoration-line-strong underline-offset-4"
        >
          RSS feed
        </a>
      </p>
    </div>
  );
}
