import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/shared/Icon';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';
import { TOOLS, CATEGORIES, toolHref, type Category } from '@/lib/tools';
import { SITE_URL } from '@/lib/site';
import { BRAND } from '@/lib/brand';

// Copy per category. Written out rather than templated so each landing
// page says something specific enough to be worth indexing.
const COPY: Record<Category, { title: string; description: string; intro: string }> = {
  developer: {
    title: 'Developer Tools',
    description:
      'Formatters, encoders, and validators for JSON, XML, Base64, URLs, and regular expressions. Free, and they run in your browser.',
    intro:
      'The formatting and encoding jobs that interrupt real work: pretty-printing a payload, escaping a string, checking a pattern against sample text. Each one runs locally, so nothing you paste is transmitted.',
  },
  content: {
    title: 'Text Tools',
    description:
      'Count words, convert between casing styles, generate URL slugs, write Markdown, and compare passages for overlap.',
    intro:
      'Everything for working on copy before it ships: counting it, recasing it, turning a headline into a URL, and checking whether two drafts say the same thing.',
  },
  image: {
    title: 'Image Tools',
    description:
      'Generate and read QR codes, convert between HEX, RGB and HSL, build colour palettes, and compress images without uploading them.',
    intro:
      'Colour and image work that normally means opening a design app. The compressor and the QR reader both process files in the page itself — nothing is uploaded to a server.',
  },
  converter: {
    title: 'Converters and Generators',
    description:
      'Convert units, temperatures, and JSON to CSV. Generate secure passwords, random values, and UUIDs.',
    intro:
      'Turning one representation into another, plus the generators you reach for when seeding test data or setting up an account.',
  },
};

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const copy = COPY[category as Category];
  if (!copy) return {};

  const url = `${SITE_URL}/tools/${category}`;

  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url,
      type: 'website',
      siteName: BRAND,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const copy = COPY[category as Category];
  const meta = CATEGORIES.find((c) => c.id === category);

  // Tool pages live at /tools/<category>/<id>, so an unknown segment here
  // is a genuine 404 rather than a category with no tools.
  if (!copy || !meta) notFound();

  const tools = TOOLS.filter((t) => t.category === category);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: copy.title,
    description: copy.description,
    url: `${SITE_URL}/tools/${category}`,
    hasPart: tools.map((tool) => ({
      '@type': 'WebApplication',
      name: tool.name,
      description: tool.description,
      url: `${SITE_URL}${toolHref(tool)}`,
      applicationCategory: 'UtilitiesApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    })),
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Breadcrumbs items={[{ label: copy.title }]} />

      <div>
        <p className="eyebrow mb-4">
          {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
        </p>
        <h1 className="headline text-[2rem] mb-3">{copy.title}</h1>
        <p className="text-ink-muted max-w-2xl leading-relaxed">{copy.intro}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((tool) => (
          <Link key={tool.id} href={toolHref(tool)} className="tool-card group">
            <span className="text-ink-subtle group-hover:text-accent transition-colors">
              <Icon name={tool.id} className="w-[18px] h-[18px]" />
            </span>
            <h2 className="text-[15px] font-medium tracking-tight mt-1">
              {tool.name}
            </h2>
            <p className="text-[13px] text-ink-muted leading-relaxed">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>

      <AdContainer slot="0000000000" format="horizontal" />

      <div className="pt-8 hairline">
        <h2 className="eyebrow mb-5">Other categories</h2>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.filter((c) => c.id !== category).map((c) => (
            <Link
              key={c.id}
              href={`/tools/${c.id}`}
              className="btn btn-secondary btn-sm"
            >
              <Icon name={c.id} className="w-3.5 h-3.5" />
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
