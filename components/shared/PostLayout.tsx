import Link from 'next/link';
import Breadcrumbs from './Breadcrumbs';
import Icon from './Icon';
import { getPost, formatDate } from '@/lib/posts';
import { getTool, toolHref } from '@/lib/tools';
import { SITE_URL } from '@/lib/site';
import { BRAND } from '@/lib/brand';

/**
 * Chrome around an article: breadcrumbs, byline, schema, and the tools the
 * piece refers to. Keeping it here means a post file is just its prose.
 */
export default function PostLayout({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const post = getPost(slug);
  if (!post) return null;

  const url = `${SITE_URL}/blog/${post.slug}`;
  const tools = post.tools.map(getTool).filter((t): t is NonNullable<typeof t> => !!t);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: BRAND, url: SITE_URL },
    publisher: { '@type': 'Organization', name: BRAND, url: SITE_URL },
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <article className="max-w-2xl mx-auto w-full px-5 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <Breadcrumbs items={[{ label: 'Articles', href: '/blog' }, { label: post.title }]} />

      <header className="mb-10">
        <h1 className="headline text-[2rem] sm:text-[2.5rem] mb-4">{post.title}</h1>
        <p className="text-ink-muted text-[16px] leading-relaxed mb-5">
          {post.description}
        </p>
        <div className="flex items-center gap-3 font-mono text-[11px] text-ink-subtle">
          <time dateTime={post.published}>{formatDate(post.published)}</time>
          <span>·</span>
          <span>{post.minutes} min read</span>
        </div>
      </header>

      <div className="post-prose">{children}</div>

      {tools.length > 0 && (
        <section className="mt-14 pt-10 hairline">
          <h2 className="eyebrow mb-5">Tools mentioned</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tools.map((tool) => (
              <Link key={tool.id} href={toolHref(tool)} className="tool-card group">
                <span className="text-ink-subtle group-hover:text-accent transition-colors">
                  <Icon name={tool.id} className="w-[18px] h-[18px]" />
                </span>
                <h3 className="text-[14px] font-medium tracking-tight mt-1">
                  {tool.name}
                </h3>
                <p className="text-[12.5px] text-ink-muted leading-relaxed">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 pt-8 hairline">
        <Link
          href="/blog"
          className="text-[13px] text-ink-muted hover:text-ink transition-colors"
        >
          ← All articles
        </Link>
      </div>
    </article>
  );
}
