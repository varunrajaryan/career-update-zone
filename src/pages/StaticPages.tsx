import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { channel } from '../content/channel';
import { Link } from '../router';

export function PrivacyPolicyPage() {
  return (
    <>
      <Seo title="Privacy Policy" description="Privacy Policy for Career Update Zone" canonical="/privacy-policy" />
      <div className="border-b border-ink-100 bg-white">
        <div className="container-content py-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Privacy Policy' }]} />
          <h1 className="mt-3 font-display text-3xl font-bold text-ink-950">Privacy Policy</h1>
        </div>
      </div>
      <div className="container-content py-12 max-w-3xl">
        <div className="prose-content">
          <p>Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h2>Information We Collect</h2>
          <p>{channel.name} ("we", "us", "our") collects minimal personal information when you contact us via email or our contact form. We do not require registration to browse our content.</p>
          <h2>How We Use Your Information</h2>
          <p>We use the information you provide solely to respond to your inquiries and improve our services. We do not sell or share your data with third parties.</p>
          <h2>Cookies</h2>
          <p>Our website may use cookies to enhance your browsing experience. You can disable cookies in your browser settings.</p>
          <h2>Third-Party Links</h2>
          <p>Our website contains links to external sites like YouTube. We are not responsible for the privacy practices of these third-party websites.</p>
          <h2>Contact</h2>
          <p>For privacy-related questions, email us at <a href={`mailto:${channel.email}`}>{channel.email}</a>.</p>
        </div>
        <Link to="/" className="btn-ghost mt-8">Back to Home</Link>
      </div>
    </>
  );
}

export function DisclaimerPage() {
  return (
    <>
      <Seo title="Disclaimer" description="Disclaimer for Career Update Zone" canonical="/disclaimer" />
      <div className="border-b border-ink-100 bg-white">
        <div className="container-content py-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Disclaimer' }]} />
          <h1 className="mt-3 font-display text-3xl font-bold text-ink-950">Disclaimer</h1>
        </div>
      </div>
      <div className="container-content py-12 max-w-3xl">
        <div className="prose-content">
          <p>The information provided by {channel.name} is for general informational purposes only. While we strive to keep information accurate and up-to-date, we make no representations or warranties of any kind about the completeness, accuracy, or reliability of the information.</p>
          <h2>Not Official</h2>
          <p>{channel.name} is an independent platform and is not affiliated with any government body. Always verify information from official sources before applying.</p>
          <h2>External Links</h2>
          <p>Links to external websites are provided for convenience. We do not endorse and are not responsible for the content of external sites.</p>
          <h2>Contact</h2>
          <p>For questions, email <a href={`mailto:${channel.email}`}>{channel.email}</a>.</p>
        </div>
        <Link to="/" className="btn-ghost mt-8">Back to Home</Link>
      </div>
    </>
  );
}

export function TermsPage() {
  return (
    <>
      <Seo title="Terms of Use" description="Terms of Use for Career Update Zone" canonical="/terms" />
      <div className="border-b border-ink-100 bg-white">
        <div className="container-content py-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Terms of Use' }]} />
          <h1 className="mt-3 font-display text-3xl font-bold text-ink-950">Terms of Use</h1>
        </div>
      </div>
      <div className="container-content py-12 max-w-3xl">
        <div className="prose-content">
          <p>By accessing {channel.name}, you agree to these terms. Use this website at your own discretion.</p>
          <h2>Content Usage</h2>
          <p>All content on this site is for informational purposes. You may not reproduce or distribute our content without permission.</p>
          <h2>Limitation of Liability</h2>
          <p>{channel.name} is not liable for any losses or damages arising from the use of information provided on this site.</p>
          <h2>Changes</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance of the updated terms.</p>
          <h2>Contact</h2>
          <p>For questions about these terms, email <a href={`mailto:${channel.email}`}>{channel.email}</a>.</p>
        </div>
        <Link to="/" className="btn-ghost mt-8">Back to Home</Link>
      </div>
    </>
  );
}

export function NotFoundPage() {
  return (
    <>
      <Seo title="404 — Page Not Found" description="The page you are looking for does not exist." noindex />
      <div className="container-content py-32 text-center">
        <p className="font-display text-8xl font-bold text-brand-200">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink-950">Page Not Found</h1>
        <p className="mt-2 text-ink-500">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary mt-6">Back to Home</Link>
      </div>
    </>
  );
}
