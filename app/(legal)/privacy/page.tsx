import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  alternates: { canonical: '/privacy' },
  title: 'Privacy Policy',
  description:
    `What ${BRAND} collects, what it does not, and which third parties are involved.`,
};

const UPDATED = 'February 2026';

export default function Privacy() {
  return (
    <>
      <p className="eyebrow mb-4">Last updated {UPDATED}</p>
      <h1 className="headline text-[2rem] mb-6">Privacy Policy</h1>

      <p className="lead">
        {BRAND} is built so that there is very little to collect. The tools
        themselves run entirely inside your browser, and this page explains
        exactly what that does and does not mean.
      </p>

      <h2>What the tools do with your input</h2>
      <p>
        Every tool on this site is JavaScript that runs on your own device.
        When you paste JSON into the formatter, drop an image into the
        compressor, or generate a password, that data is processed in the page
        and never transmitted to us. We do not operate a server that receives
        your input, so there is nothing for us to store, log, or read.
      </p>
      <p>
        Anything you type is discarded when you close or reload the tab. We do
        not save your work between visits.
      </p>

      <h2>What we do collect</h2>
      <p>
        We use Vercel Web Analytics to count page views and understand which
        tools people use. It records the page visited, the referring site, and
        coarse details such as country, browser, and device type. It does not
        use cookies and does not build a profile that identifies you
        individually.
      </p>
      <p>
        Our hosting provider, Vercel, also keeps standard server logs of
        requests to the site, which include IP addresses. These are retained by
        Vercel under their own policy and are used for security and
        reliability.
      </p>

      <h2>Advertising</h2>
      <p>
        This site is supported by advertising through Google AdSense. When ads
        are served, Google and its partners may set cookies or read existing
        ones in order to select and measure ads, including on the basis of your
        prior visits to this and other websites.
      </p>
      <p>
        You can opt out of personalised advertising in{' '}
        <a
          href="https://myadcenter.google.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Ad Settings
        </a>
        , or opt out of third-party vendor cookies at{' '}
        <a
          href="https://optout.aboutads.info/"
          target="_blank"
          rel="noopener noreferrer"
        >
          aboutads.info
        </a>
        . Advertising cookies are set by Google, not by us, and we do not have
        access to the data they collect.
      </p>

      <h2>What we never do</h2>
      <ul>
        <li>We do not sell or rent any information about you.</li>
        <li>We do not require an account, and we do not ask for your email.</li>
        <li>
          We do not upload, inspect, or retain the content you put into a tool.
        </li>
      </ul>

      <h2>Children</h2>
      <p>
        This site is not directed at children under 13, and we do not knowingly
        collect personal information from them.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have the right to request access
        to, correction of, or deletion of personal data held about you. Because
        we do not maintain user accounts or a database of visitors, in most
        cases we simply hold nothing to act on. If you believe otherwise, get
        in touch and we will look into it.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes in a way that affects what we collect, the date
        at the top of this page will change with it.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can go to the address on our{' '}
        <Link href="/contact">contact page</Link>.
      </p>
    </>
  );
}
