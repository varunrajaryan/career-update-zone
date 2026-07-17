import { useState } from 'react';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { channel } from '../content/channel';
import { Mail, Send, CheckCircle2, Video } from 'lucide-react';

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  }

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Career Update Zone',
    url: 'https://careerupdatezone.com/contact',
    mainEntity: {
      '@type': 'Organization',
      name: channel.name,
      email: channel.email,
      url: 'https://careerupdatezone.com',
    },
  };

  return (
    <>
      <Seo title="Contact" description={`Contact ${channel.name}`} canonical="/contact" schema={contactSchema} />
      <div className="border-b border-ink-100 bg-white">
        <div className="container-content py-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
          <h1 className="mt-3 font-display text-3xl font-bold text-ink-950">Contact Us</h1>
        </div>
      </div>
      <div className="container-content py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-950">Get in Touch</h2>
            <p className="mt-2 text-ink-500">Have a question or suggestion? We'd love to hear from you.</p>
            <div className="mt-6 space-y-4">
              <a href={`mailto:${channel.email}`} className="card flex items-center gap-4 p-5 transition hover:shadow-md">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><Mail className="h-5 w-5" aria-hidden="true" /></span>
                <div><p className="font-semibold text-ink-950">Email</p><p className="text-sm text-ink-500">{channel.email}</p></div>
              </a>
              <a href={channel.youtubeUrl} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-4 p-5 transition hover:shadow-md">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><Video className="h-5 w-5" aria-hidden="true" /></span>
                <div><p className="font-semibold text-ink-950">YouTube</p><p className="text-sm text-ink-500">{channel.socials.youtube.split('/').pop()}</p></div>
              </a>
            </div>
          </div>
          <div className="card p-6">
            {sent ? (
              <div className="flex flex-col items-center py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-success-600" aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg font-bold text-ink-950">Message Sent!</h3>
                <p className="mt-1 text-sm text-ink-500">We'll get back to you soon.</p>
                <button onClick={() => setSent(false)} className="btn-ghost mt-4 text-sm">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink-700">Name</span>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Your name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink-700">Email</span>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="your@email.com" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink-700">Message</span>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input" placeholder="Your message…" />
                </label>
                <button type="submit" className="btn-primary w-full"><Send className="h-4 w-4" aria-hidden="true" /> Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
