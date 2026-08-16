import type { Metadata } from 'next';
import { getToolMetadata } from './toolsMetadata';
import { getTool, toolHref, categoryName } from './tools';
import { SITE_URL } from './site';
import { BRAND } from './brand';

/**
 * Metadata for a tool page, including the canonical URL.
 *
 * Canonicals matter here because every tool accepts an `?input=` parameter.
 * Without one, a shared prewired link reads to a crawler as a separate page
 * competing with the clean URL for the same terms.
 */
export function buildToolMetadata(id: string): Metadata {
  const meta = getToolMetadata(id);
  const tool = getTool(id);
  const path = tool ? toolHref(tool) : `/tools/${id}`;
  const url = `${SITE_URL}${path}`;

  const image = {
    url: `${SITE_URL}/og/${id}`,
    width: 1200,
    height: 630,
    alt: meta.title,
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: 'website',
      siteName: BRAND,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [image.url],
    },
  };
}

/**
 * Schema.org markup describing the tool as a free web application. This is
 * what lets a result show up as something richer than a plain blue link.
 */
/**
 * Breadcrumb trail for search results.
 *
 * Turns the blue URL line into Home › Developer › JSON Formatter, which
 * shows the visitor where the page sits before they click.
 */
export function BreadcrumbSchema({ id }: { id: string }) {
  const tool = getTool(id);
  if (!tool) return null;

  const trail = [
    { name: 'Home', item: SITE_URL },
    { name: categoryName(tool.category), item: `${SITE_URL}/tools/${tool.category}` },
    { name: tool.name, item: `${SITE_URL}${toolHref(tool)}` },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      item: step.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ToolSchema({ id }: { id: string }) {
  const meta = getToolMetadata(id);
  const tool = getTool(id);
  if (!tool) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: meta.title,
    description: meta.description,
    url: `${SITE_URL}${toolHref(tool)}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: BRAND,
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
