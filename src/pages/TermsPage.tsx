import { Seo, SITE } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { channel } from '../content/channel';

export function TermsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Terms & Conditions', item: `${SITE.url}/terms` },
    ],
  };

  return (
    <>
      <Seo
        title="Terms & Conditions"
        description="Read the Terms & Conditions of Career Update Zone — the rules and terms for using our website and services."
        canonical="/terms"
        jsonLd={jsonLd}
      />
      <section className="border-b border-ink-100 bg-white">
        <div className="container-content py-14">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Terms & Conditions' }]} />
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">Terms &amp; Conditions</h1>
          <p className="mt-3 text-ink-600">Last updated: July 2026</p>
        </div>
      </section>

      <section className="container-content py-12">
        <article className="prose-content max-w-3xl">
          <p>
            Welcome to {channel.name}. By accessing or using this website you agree to be bound by these Terms and
            Conditions. If you do not agree with any part of these terms, please discontinue use of the website.
          </p>

          <h2>Use of content</h2>
          <p>
            All content published on {channel.name} — including articles, videos, images, and graphics — is provided for
            educational and informational purposes only. You may read, share, and reference our content for personal,
            non-commercial use. You may not republish, redistribute, or reproduce our content without prior written
            permission.
          </p>

          <h2>Accuracy of information</h2>
          <p>
            We strive to provide accurate and up-to-date information about job notifications, admit cards, results,
            scholarships, and government schemes. However, {channel.name} is an independent educational platform and
            is not affiliated with any government department, commission, university, or recruitment agency. Users
            should always verify information through official notifications and official websites before applying.
          </p>

          <h2>External links</h2>
          <p>
            Our website contains links to third-party websites, including official government portals and YouTube. We
            are not responsible for the content, accuracy, or practices of any third-party websites. Accessing
            third-party links is at your own risk.
          </p>

          <h2>No liability</h2>
          <p>
            {channel.name} shall not be liable for any loss or damage arising from the use of this website or reliance
            on any information provided. All information is provided "as is" without warranties of any kind.
          </p>

          <h2>User conduct</h2>
          <p>
            You agree not to misuse the website, including but not limited to attempting to disrupt its operation,
            submitting false information through the contact form, or using the website for any unlawful purpose.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may update these Terms and Conditions from time to time. Any changes will be posted on this page with an
            updated revision date. Continued use of the website after changes constitutes acceptance of the new terms.
          </p>

          <h2>Contact us</h2>
          <p>
            For any questions about these Terms and Conditions, please reach out at <a href={`mailto:${channel.email}`}>{channel.email}</a>.
          </p>
        </article>
      </section>
    </>
  );
}
