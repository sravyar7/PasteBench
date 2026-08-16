/**
 * An inline script that runs during HTML parsing, before first paint.
 *
 * React re-renders script tags during hydration, which both warns in
 * development and counts as a DOM mismatch. Emitting `text/javascript`
 * on the server and `text/plain` on the client means the browser runs it
 * exactly once — while parsing — and React's copy is inert. The type
 * differs between the two renders by design, so the mismatch is suppressed.
 *
 * Not a client component: it needs to render on both sides to work.
 */
export default function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
