import { useEffect, useState } from 'react';
import { Link, useRouter } from '../router';
import { channel } from '../content/channel';
import { Menu, X, CircleUser } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? 'border-slate-200 shadow-sm' : 'border-transparent'
      }`}
    >
      <nav className="container-content flex h-16 items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Career Update Zone home">
          <img
            src="/logo1 copy copy.png"
            alt="Career Update Zone"
            className="h-[42px] w-[42px] rounded-full object-cover ring-1 ring-slate-200 transition md:h-[52px] md:w-[52px]"
          />
          <span className="font-display text-base font-bold text-slate-900 md:text-lg">{channel.name}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                path === l.to
                  ? 'text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {l.label}
              <span
                className={`absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-600 transition-all duration-300 ${
                  path === l.to ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                }`}
              />
            </Link>
          ))}
          <Link
            to="/admin"
            className="ml-1.5 grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            title="Admin"
            aria-label="Admin panel"
          >
            <CircleUser className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-content flex flex-col gap-0.5 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  path === l.to ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <CircleUser className="h-5 w-5" aria-hidden="true" /> Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
