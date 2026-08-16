import { TOOLS, CATEGORIES, toolHref } from '@/lib/tools';
import { SITE_URL } from '@/lib/site';
import { BRAND } from '@/lib/brand';

/**
 * Homepage structured data.
 *
 * WebSite establishes the site identity Google uses for a sitelinks search
 * box, and the ItemList gives the crawler an explicit inventory rather than
 * leaving it to infer one from thirty anchor tags.
 */
export default function SiteSchema() {
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: BRAND,
      url: SITE_URL,
      description: `${TOOLS.length} formatters, encoders, and converters that run in your browser.`,
      inLanguage: 'en',
      publisher: { '@id': `${SITE_URL}/#org` },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org`,
      name: BRAND,
      url: SITE_URL,
    },
    {
      '@type': 'ItemList',
      name: 'Tools',
      numberOfItems: TOOLS.length,
      itemListElement: TOOLS.map((tool, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: tool.name,
        description: tool.description,
        url: `${SITE_URL}${toolHref(tool)}`,
      })),
    },
    ...CATEGORIES.map((category) => ({
      '@type': 'SiteNavigationElement',
      name: category.name,
      url: `${SITE_URL}/tools/${category.id}`,
    })),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
