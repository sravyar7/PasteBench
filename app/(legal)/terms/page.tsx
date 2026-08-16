import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  alternates: { canonical: '/terms' },
  title: 'Terms of Use',
  description: `The terms that apply when you use the tools on ${BRAND}.`,
};

const UPDATED = 'February 2026';

export default function Terms() {
  return (
    <>
      <p className="eyebrow mb-4">Last updated {UPDATED}</p>
      <h1 className="headline text-[2rem] mb-6">Terms of Use</h1>

      <p className="lead">
        These terms cover your use of {BRAND}. They are short because the
        site is simple: there is no account, no payment, and nothing to cancel.
      </p>

      <h2>Using the site</h2>
      <p>
        The tools are free to use, for personal or commercial work, with no
        attribution required. You do not need permission to use output produced
        by a tool here.
      </p>
      <p>
        You agree not to use the site to break the law, and not to attempt to
        disrupt it for other people — for instance by automating abusive
        request volumes against the host.
      </p>

      <h2>No warranty</h2>
      <p>
        The tools are provided as they are, without warranty of any kind. We
        make an effort to be correct, and known limitations are noted on the
        tools they apply to, but we cannot promise that every result is
        accurate or fit for a particular purpose.
      </p>
      <p>
        Check the output before you rely on it, particularly for anything
        involving money, safety, security, or legal obligations. A converter
        can be wrong; a formatter can mangle an edge case.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent the law allows, we are not liable for any loss or damage
        arising from your use of this site, including loss of data or profit.
        Since the tools run in your browser and we never receive your input, we
        also cannot recover work you lose by closing the tab.
      </p>

      <h2>Advertising and third parties</h2>
      <p>
        This site carries advertising, and pages may link to sites we do not
        control. We are not responsible for the content, products, or privacy
        practices of those third parties. What advertising means for your data
        is covered in the <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>Availability</h2>
      <p>
        We may add, change, or remove tools at any time, and the site may be
        unavailable during maintenance or for reasons outside our control. No
        uptime is guaranteed.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        If these terms change, the date at the top of this page will change
        with them. Continuing to use the site after that means you accept the
        revised terms.
      </p>

      <h2>Contact</h2>
      <p>
        Anything unclear here can go to the address on our{' '}
        <Link href="/contact">contact page</Link>.
      </p>
    </>
  );
}
