import { Seo, SITE_URL } from '../components/Seo';
import { Link } from '../router';
import { channel } from '../content/channel';

export function DisclaimerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Disclaimer', item: `${SITE_URL}/disclaimer` },
    ],
  };

  return (
    <>
      <Seo
        title="Disclaimer"
        description="Read the Disclaimer of Career Update Zone — important information about the accuracy and use of our content."
        canonical="/disclaimer"
        schema={jsonLd}
      />
      <section className="border-b border-ink-100 bg-white">
        <div className="container-content py-14">
          <nav className="flex items-center gap-2 text-sm text-ink-500" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink-900">Home</Link>
            <span>/</span>
            <span className="text-ink-800">Disclaimer</span>
          </nav>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">Disclaimer</h1>
          <p className="mt-3 text-ink-600">Last updated: July 2026</p>
        </div>
      </section>

      <section className="container-content py-12">
        <article className="prose-content max-w-3xl">
          <p>
            The information provided by {channel.name} on {SITE_URL} and our YouTube channel is for general informational
            purposes only. All information is provided in good faith, however we make no representation or warranty of any
            kind regarding the accuracy, adequacy, validity, reliability, or completeness of any information on this site.
          </p>

          <h2>Official sources</h2>
          <p>
            We strive to share Sarkari job notifications, admit cards, results, answer keys, scholarships, and exam
            preparation updates based on official government notifications. However, information may change after
            publication. Always verify details from the official notification or the concerned department\u2019s website
            before applying or taking any action.
          </p>

          <h2>No legal or professional advice</h2>
          <p>
            The content on this website and our YouTube channel is not a substitute for professional advice. We do not
            guarantee any outcome from following our content. Any reliance you place on our information is strictly at your
            own risk.
          </p>

          <h2>External links</h2>
          <p>
            Our website and video descriptions contain links to external websites. We have no control over the nature,
            content, and availability of those sites. The inclusion of any links does not necessarily imply a
            recommendation or endorsement of the views expressed within them.
          </p>

          <h2>YouTube content</h2>
          <p>
            Embedded YouTube videos belong to their respective creators and are governed by YouTube\u2019s terms of
            service. We are not responsible for the content of third-party videos or comments.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            In no event will {channel.name} be liable for any loss or damage arising from the use of this website or our
            YouTube channel. We are an informational channel and do not charge any fee for job applications or
            recruitment.
          </p>

          <h2>Beware of fraud</h2>
          <p>
            We never ask for money for job applications, admit cards, or recruitment. If anyone contacts you claiming to
            represent {channel.name} and asks for payment, please report it immediately. Genuine Sarkari recruitment
            processes are conducted only through official government portals.
          </p>

          <h2>Contact us</h2>
          <p>
            For any questions about this Disclaimer, please reach out at <a href={`mailto:${channel.email}`}>{channel.email}</a>.
          </p>
        </article>
      </section>
    </>
  );
}
