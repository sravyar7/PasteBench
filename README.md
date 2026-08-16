# PasteBench

Thirty-three formatters, encoders, converters and generators that run in the
browser. No account, no upload, no server-side processing — every tool is
client-side JavaScript, which is why the site also works offline once it has
been visited.

Built with Next.js 16, React 19 and Tailwind CSS v4.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build
npx next start -p 3100
npm run smoke        # checks every route against the running build
```

## The smoke test

`npm run smoke` walks all 58 routes and asserts each one returns 200 with an
`<h1>`, a `<title>`, and a canonical URL, and that every generated image
actually renders as an image of plausible size.

It exists because two real failures got past a passing build: seventeen pages
that shipped an empty shell to crawlers while looking fine in a browser, and a
share card that returned a dropped socket instead of a PNG. Both were invisible
until something fetched the raw response.

Run it against a deployment too:

```bash
BASE=https://your-domain npm run smoke
```

## Layout

```
app/
  tools/<category>/<tool>/   one folder per tool: page.tsx + layout.tsx
  blog/<slug>/               one folder per article
  og/                        generated share images
  (legal)/                   privacy, terms, contact
lib/
  tools.ts                   the tool registry — single source of truth
  toolsMetadata.ts           per-tool SEO copy
  toolFaqs.ts                per-tool questions and answers
  posts.ts                   the article registry
components/shared/           header, footer, palette, cross-links
scripts/smoke.mjs            route checks
```

`lib/tools.ts` drives the homepage grid, the footer, the command palette, the
sitemap and the related-tool links. Adding a tool means one entry there, one
page, one layout, and an icon in `components/shared/Icon.tsx`.

## Renaming the site

`lib/brand.ts` holds the name. Change `BRAND` and everything follows: the
header, the footer, the page titles, the manifest, the RSS channel, every
generated share card, the schema publisher, and the prose in the privacy
policy and terms. The square logo mark is derived from the capitals in the
name, so `PasteBench` gives `PB` and `OnlineTools` would give `OT` with no second
edit.

## Configuration

Everything works with no environment variables set.

| Variable | Effect if set |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Overrides the canonical origin. Needed only once a custom domain is live — otherwise Vercel's `VERCEL_PROJECT_PRODUCTION_URL` is used automatically. |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Loads AdSense, renders the ad slots, and serves `/ads.txt`. Without it the ad containers render nothing and `/ads.txt` returns 404. |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Adds the `google-site-verification` meta tag for Search Console. |

Two constants in `app/(legal)/contact/page.tsx` — `CONTACT_EMAIL` and
`ISSUES_URL` — are deliberately blank. Setting either turns the contact page
into a real route rather than a placeholder.

## Conventions worth knowing

- **Query params** are read with `lib/useQueryParams`, not
  `next/navigation`'s `useSearchParams`. The latter opts a route out of static
  rendering, or worse, emits an empty Suspense fallback into the prerendered
  HTML.
- **Tool chrome lives in `layout.tsx`.** Schema, FAQs and cross-links are
  server-rendered there so they reach crawlers regardless of JavaScript; the
  page itself is the interactive client component.
- **Nothing user-entered is persisted.** `localStorage` holds recently opened
  tool ids and a theme preference. The service worker caches the app's own
  assets and no input.
- **Share links are withheld** from the JWT decoder, hash generator, password
  generator and QR generator. A share link puts its input into browser history
  and chat logs, and those four routinely hold credentials.

## Licence

No licence is set, so the default applies: all rights reserved.
