import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact',
  description: `How to report a bug, request a tool, or ask about ${BRAND}.`,
};

/**
 * Ways for people to reach you. Set either, or both.
 *
 * CONTACT_EMAIL is deliberately empty: putting a personal inbox on a public
 * page invites scrapers, so use a dedicated address or an alias. Until one
 * of these is set, the page explains that in visitor-facing terms rather
 * than showing a dead mailto.
 */
export const CONTACT_EMAIL = 'helponlinetools@gmail.com';
export const ISSUES_URL =
  'https://github.com/manojtippani-glitch/onlinetools/issues';

export default function Contact() {
  return (
    <>
      <h1 className="headline text-[2rem] mb-6">Contact</h1>

      <p className="lead">
        Bug reports and requests for new tools are both welcome. So is being
        told that a converter gave you the wrong answer — that is the most
        useful message we can get.
      </p>

      <h2>Getting in touch</h2>
      {CONTACT_EMAIL && (
        <p>
          Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. This
          is a small operation, so a reply may take a few days.
        </p>
      )}
      {/* Reads correctly with or without an email above it — "also" only
          makes sense once there is something for it to be additional to. */}
      {ISSUES_URL && (
        <p>
          {CONTACT_EMAIL
            ? 'Anything code-related can go straight to '
            : 'All of it goes to '}
          <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
            the issue tracker
          </a>
          {CONTACT_EMAIL
            ? ', which is usually the faster route.'
            : ', which needs a GitHub account but gets the fastest reply. An email address will be published here shortly for anyone who would rather not use one.'}
        </p>
      )}
      {!CONTACT_EMAIL && !ISSUES_URL && (
        <p>
          A public contact address is being set up and will appear here
          shortly. In the meantime, the notes below cover what is most useful
          to include when it is ready.
        </p>
      )}

      <h2>Reporting a wrong result</h2>
      <p>
        If a tool produced something incorrect, the fastest fix comes from
        including three things: which tool, exactly what you put in, and what
        you expected instead. Most tools carry your input in the URL, so
        copying the address bar usually captures the first two at once.
      </p>

      <h2>Suggesting a tool</h2>
      <p>
        The tools here exist because they are the ones people look up over and
        over. If something you reach for is missing, say what you use it for —
        that context decides whether it gets built and how.
      </p>

      <h2>Privacy questions</h2>
      <p>
        What is and is not collected is set out in the{' '}
        <Link href="/privacy">privacy policy</Link>. The short version is that
        the tools run in your browser and your input never reaches us.
      </p>
    </>
  );
}
