import { Home, ArrowLeft, Compass, Youtube, FileQuestion } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Link } from '../router';
import { SearchBar } from '../components/SearchBar';
import { channel } from '../content/channel';
import { categories } from '../content/categories';
import { Icon } from '../components/Icon';

export function NotFoundPage() {
  const popularCats = categories.slice(0, 4);

  return (
    <>
      <Seo
        title="Page Not Found — Career Update Zone"
        description="The page you're looking for doesn't exist. Search for Sarkari job updates, articles, or browse our latest content."
        canonical="/404"
      />
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/5905702/pexels-photo-5905702.jpeg" alt="" loading="lazy" width={1920} height={1080} className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 to-ink-950" />
        </div>
        <div className="container-content relative py-24 text-center sm:py-32">
          <FileQuestion className="mx-auto h-16 w-16 text-brand-500" />
          <p className="mt-6 font-display text-7xl font-bold text-brand-500 sm:text-8xl">404</p>
          <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Page not found</h1>
          <p className="mx-auto mt-4 max-w-md text-ink-300">
            The page you're looking for doesn't exist or has been moved. Try searching or head back home.
          </p>

          <div className="mx-auto mt-8 max-w-md">
            <SearchBar autoFocus />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="btn-primary"><Home className="h-4 w-4" /> Back home</Link>
            <Link to="/blog" className="btn bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"><ArrowLeft className="h-4 w-4" /> Browse blog</Link>
            <a href={channel.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20">
              <Youtube className="h-4 w-4" /> YouTube channel
            </a>
          </div>
        </div>
      </section>

      <section className="container-content py-16">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-brand-600" />
          <h2 className="font-display text-2xl font-semibold text-ink-950">Popular topics</h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularCats.map((c) => (
            <Link key={c.slug} to={`/blog?category=${c.slug}`} className="group card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon name={c.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-display text-base font-semibold text-ink-950 group-hover:text-brand-700">{c.name}</h3>
              <p className="mt-1 text-sm text-ink-600 line-clamp-2">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
