import { Link } from '../router';
import { channel } from '../content/channel';
import { categories } from '../content/categories';
import { Youtube, Mail, MapPin, FileText, Briefcase, Trophy, CreditCard, GraduationCap, ChevronRight } from 'lucide-react';

export function Footer() {
  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/latest-jobs', label: 'Latest Jobs' },
    { to: '/blog', label: 'Blog' },
    { to: '/videos', label: 'Videos' },
    { to: '/categories', label: 'Categories' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const catLinks = [
    { slug: 'latest-jobs', label: 'Latest Jobs', icon: Briefcase },
    { slug: 'result', label: 'Results', icon: Trophy },
    { slug: 'admit-card', label: 'Admit Cards', icon: CreditCard },
    { slug: 'admission', label: 'Admissions', icon: GraduationCap },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="container-content py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/logo1 copy copy.png" alt="Career Update Zone" className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-700" />
              <span className="font-display text-lg font-bold text-white">{channel.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">{channel.description}</p>
            <div className="mt-5 flex gap-3">
              <a
                href={channel.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-brand-600 hover:text-white"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${channel.email}`}
                className="grid h-10 w-10 place-items-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-brand-600 hover:text-white"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="flex items-center gap-1.5 text-slate-400 transition hover:text-white">
                    <ChevronRight className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Categories</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {catLinks.map((c) => {
                const Icon = c.icon;
                return (
                  <li key={c.slug}>
                    <Link to={`/blog?category=${c.slug}`} className="flex items-center gap-2 text-slate-400 transition hover:text-white">
                      <Icon className="h-4 w-4 text-slate-600" aria-hidden="true" />
                      {c.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                <a href={`mailto:${channel.email}`} className="text-slate-400 transition hover:text-white">{channel.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                <span className="text-slate-400">India</span>
              </li>
            </ul>
            <a
              href={channel.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              <Youtube className="h-4 w-4" aria-hidden="true" /> Subscribe on YouTube
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {channel.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy-policy" className="flex items-center gap-1 transition hover:text-white"><FileText className="h-3.5 w-3.5" aria-hidden="true" /> Privacy</Link>
            <Link to="/disclaimer" className="transition hover:text-white">Disclaimer</Link>
            <Link to="/terms" className="transition hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
