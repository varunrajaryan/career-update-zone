import { Seo, SITE_URL } from '../components/Seo';
import { Link } from '../router';
import { channel } from '../content/channel';

export function PrivacyPolicyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${SITE_URL}/privacy-policy` },
    ],
  };

  return (
    <>
      <Seo
        title="Privacy Policy"
        description="Read the Privacy Policy of Career Update Zone — how we collect, use, and protect your information."
        canonical="/privacy-policy"
        schema={jsonLd}
      />
      <section className="border-b border-ink-100 bg-white">
        <div className="container-content py-14">
          <nav className="flex items-center gap-2 text-sm text-ink-500" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink-900">Home</Link>
            <span>/</span>
            <span className="text-ink-800">Privacy Policy</span>
          </nav>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">Privacy Policy</h1>
          <p className="mt-3 text-ink-600">Last updated: July 2026</p>
        </div>
      </section>

      <section className="container-content py-12">
        <article className="prose-content max-w-3xl">
          <p>
            At {channel.name}, accessible from {SITE_URL}, we are committed to protecting your privacy. This Privacy Policy
            explains what information we collect, how we use it, and the choices you have.
          </p>

          <h2>Information we collect</h2>
          <p>
            We do not directly collect personal information through this website. If you contact us via the contact form or
            email, we receive the name, email, and message you voluntarily provide. We use this information only to respond
            to your query and never share it with third parties.
          </p>

          <h2>Third-party links and embedded content</h2>
          <p>
            Our website contains links to official government portals and embeds YouTube videos. These third-party
            services may collect data according to their own privacy policies. We encourage you to read the privacy
            policies of YouTube and any official websites you visit through our links.
          </p>

          <h2>Cookies and analytics</h2>
          <p>
            We may use analytics tools to understand how visitors use our site. These tools may use cookies to collect
            anonymous usage data such as browser type, pages visited, and time spent. This data is aggregated and does
            not identify individual users.
          </p>

          <h2>Children\u2019s privacy</h2>
          <p>
            Our website is intended for students and job seekers of all ages. We do not knowingly collect personal
            information from children. If you believe a child has provided us personal information, please contact us and
            we will delete it.
          </p>

          <h2>Your consent</h2>
          <p>
            By using our website, you consent to this Privacy Policy. If you do not agree with any part of this policy,
            please discontinue use of the website.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated
            revision date.
          </p>

          <h2>Contact us</h2>
          <p>
            For any questions about this Privacy Policy, please reach out at <a href={`mailto:${channel.email}`}>{channel.email}</a>.
          </p>
        </article>
      </section>
    </>
  );
}
