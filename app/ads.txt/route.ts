/**
 * ads.txt — the file AdSense looks for to confirm you authorised Google to
 * sell inventory on this domain. Without it, some buyers treat the
 * inventory as unauthorised and bid lower or not at all.
 *
 * Generated from the publisher ID rather than committed, so there is no
 * second place to update it. Returns 404 until the ID is set, which is
 * correct: an ads.txt naming nobody is worse than none.
 *
 * f08c47fec0942fa0 is Google's certification authority ID, the same for
 * every publisher.
 */
export const dynamic = 'force-static';

export function GET() {
  const id = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!id || id === 'ca-pub-0000000000000000') {
    return new Response('Not found', { status: 404 });
  }

  // ads.txt wants the bare publisher number, not the ca-pub- prefix.
  const publisher = id.replace(/^ca-/, '');

  return new Response(
    `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`,
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
}
