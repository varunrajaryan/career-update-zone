import { useState } from 'react';
import { Link, useRouter } from '../router';
import { channel } from '../content/channel';
import { Video, Menu, X, CircleUser } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { route } = useRouter();
  const path = route.path.split('?')[0];

  const links = [
    { to: '/', label: 'Home' },
    { to: '/latest-jobs', label: 'Latest Jobs' },
    { to: '/blog', label: 'Blog' },
    { to: '/videos', label: 'Videos' },
    { to: '/categories', label: 'Categories' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur-xl">
      <nav className="container-content flex h-16 items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2" aria-label="Career Update Zone home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white"><Video className="h-5 w-5" aria-hidden="true" /></span>
          <span className="font-display text-lg font-bold text-ink-950">{channel.name}</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={`rounded-full px-4 py-2 text-sm font-medium transition ${path === l.to ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:text-ink-950 hover:bg-ink-50'}`}>{l.label}</Link>
          ))}
          <Link to="/admin" className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition hover:bg-ink-50 hover:text-ink-950" title="Admin" aria-label="Admin panel">
            <CircleUser className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-lg text-ink-700 md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-ink-100 bg-white md:hidden">
          <div className="container-content flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={`rounded-xl px-4 py-2.5 text-sm font-medium ${path === l.to ? 'bg-brand-50 text-brand-700' : 'text-ink-600'}`}>{l.label}</Link>
            ))}
            <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-600">
              <CircleUser className="h-5 w-5" aria-hidden="true" /> Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
