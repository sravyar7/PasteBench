import type { MetadataRoute } from 'next';
import { TOOLS, CATEGORIES, toolHref } from '@/lib/tools';
import { SITE_URL } from '@/lib/site';
import { livePosts } from '@/lib/posts';

/**
 * lastModified is deliberately omitted.
 *
 * It was previously `new Date()` at build time, which told crawlers that
 * all 38 pages changed on every deploy — including deploys that only
 * touched one tool. A feed that cries wolf on every entry is worse than
 * one that stays quiet: Google discounts the field once it stops
 * correlating with real edits.
 *
 * Deriving it honestly needs per-page commit dates, and file mtimes don't
 * survive a CI checkout, so nothing is claimed until there's a real
 * source for it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...CATEGORIES.map((category) => ({
      url: `${SITE_URL}/tools/${category.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...TOOLS.map((tool) => ({
      url: `${SITE_URL}${toolHref(tool)}`,
      changeFrequency: 'monthly' as const,
      // Tool pages are the point of the site, so they outrank the
      // legal pages but sit just under the index.
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...livePosts().map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...['/privacy', '/terms', '/contact'].map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ];
}
