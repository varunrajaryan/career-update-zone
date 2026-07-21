import { useEffect, useMemo, useState } from 'react';
import { Seo } from '../components/Seo';
import { Link, useRouter } from '../router';
import { BlogCard } from '../components/BlogCard';
import { Reveal } from '../components/Reveal';
import { CountUp } from '../components/CountUp';
import { usePublishedPosts } from '../lib/usePosts';
import { useYouTubeChannel } from '../lib/useYouTube';
import { channel } from '../content/channel';
import { categories } from '../content/categories';
import { Icon } from '../components/Icon';
import { formatNumber, timeAgo } from '../lib/editor-utils';
import {
  Briefcase,
  Trophy,
  CreditCard,
  FileText,
  TrendingUp,
  ArrowRight,
  Bell,
  Mail,
  Video,
  Play,
  Users,
  Eye,
  Newspaper,
  Lightbulb,
  Search,
  type LucideIcon,
} from 'lucide-react';

type Stat = { label: string; value: number; icon: LucideIcon; tint: string; iconBg: string };
type QuickCat = { slug: string; name: string; icon: string; tint: string; iconBg: string };

export function HomePage() {
  const { posts, loading } = usePublishedPosts();
  const { data: yt, loading: ytLoading } = useYouTubeChannel();
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');

  const jobs = useMemo(() => posts.filter((p) => p.category === 'latest-jobs' || p.category === 'bihar-jobs'), [posts]);
  const results = useMemo(() => posts.filter((p) => p.category === 'result'), [posts]);
  const admitCards = useMemo(() => posts.filter((p) => p.category === 'admit-card'), [posts]);
  const news = useMemo(() => posts.filter((p) => p.category === 'exam-preparation' || p.category === 'scholarships'), [posts]);
  const career = useMemo(() => posts.filter((p) => p.category === 'career-tips' || p.category === 'syllabus'), [posts]);

  const stats: Stat[] = [
    { label: 'Latest Jobs', value: jobs.length, icon: Briefcase, tint: 'from-blue-500 to-blue-600', iconBg: 'bg-blue-50 text-blue-600' },
    { label: 'Results', value: results.length, icon: Trophy, tint: 'from-emerald-500 to-emerald-600', iconBg: 'bg-emerald-50 text-emerald-600' },
    { label: 'Admit Cards', value: admitCards.length, icon: CreditCard, tint: 'from-amber-500 to-amber-600', iconBg: 'bg-amber-50 text-amber-600' },
    { label: 'Career Articles', value: posts.length, icon: FileText, tint: 'from-rose-500 to-rose-600', iconBg: 'bg-rose-50 text-rose-600' },
  ];

  const quickCats: QuickCat[] = [
    { slug: 'latest-jobs', name: 'Latest Jobs', icon: 'briefcase', tint: 'group-hover:bg-blue-500', iconBg: 'bg-blue-50 text-blue-600' },
    { slug: 'result', name: 'Results', icon: 'trophy', tint: 'group-hover:bg-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600' },
    { slug: 'admit-card', name: 'Admit Card', icon: 'card', tint: 'group-hover:bg-amber-500', iconBg: 'bg-amber-50 text-amber-600' },
    { slug: 'answer-key', name: 'Answer Key', icon: 'key', tint: 'group-hover:bg-purple-500', iconBg: 'bg-purple-50 text-purple-600' },
    { slug: 'syllabus', name: 'Syllabus', icon: 'book', tint: 'group-hover:bg-cyan-500', iconBg: 'bg-cyan-50 text-cyan-600' },
    { slug: 'scholarship', name: 'Scholarships', icon: 'award', tint: 'group-hover:bg-rose-500', iconBg: 'bg-rose-50 text-rose-600' },
  ];

  const sections = [
    { slug: 'latest-jobs', title: 'Latest Jobs', subtitle: 'Fresh government job notifications', icon: Briefcase, items: jobs.slice(0, 6), viewAll: '/latest-jobs' },
    { slug: 'result', title: 'Latest Results', subtitle: 'Exam results and merit lists', icon: Trophy, items: results.slice(0, 6), viewAll: '/blog?category=result' },
    { slug: 'admit-card', title: 'Admit Cards', subtitle: 'Download hall tickets and call letters', icon: CreditCard, items: admitCards.slice(0, 6), viewAll: '/blog?category=admit-card' },
    { slug: 'news', title: 'Latest News', subtitle: 'Exam updates and announcements', icon: Newspaper, items: news.slice(0, 6), viewAll: '/blog' },
    { slug: 'career', title: 'Career Guidance', subtitle: 'Tips, syllabus & preparation strategy', icon: Lightbulb, items: career.slice(0, 6), viewAll: '/blog?category=career-tips' },
  ];

  useEffect(() => {
    const id = 'preload-hero';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'preload';
      link.as = 'image';
      link.href = 'https://images.pexels.com/photos/5905702/pexels-photo-5905702.jpeg';
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
    }
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/blog?q=${encodeURIComponent(q)}` : '/blog');
  };

  return (
    <>
      <Seo canonical="/" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.pexels.com/photos/5905702/pexels-photo-5905702.jpeg"
            alt="Government job exam preparation"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-transparent to-slate-900/50" aria-hidden="true" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative container-content py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-200 backdrop-blur">
              <Bell className="h-3.5 w-3.5" aria-hidden="true" /> Sarkari Job Updates
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Latest Sarkari Jobs, Results, Admit Cards &amp; Career Updates
            </h1>
            <p className="mt-4 text-base leading-relaxed text-blue-100 md:text-lg">
              {channel.tagline}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/latest-jobs"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl hover:-translate-y-0.5"
              >
                <TrendingUp className="h-4 w-4" aria-hidden="true" /> Latest Jobs
              </Link>
              <Link
                to="/blog?category=result"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5"
              >
                <Trophy className="h-4 w-4" aria-hidden="true" /> Latest Results
              </Link>
            </div>

            {/* Hero search bar */}
            <form onSubmit={onSearchSubmit} className="mx-auto mt-8 max-w-2xl" role="search">
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Jobs, Results, Admit Cards..."
                  aria-label="Search Jobs, Results, Admit Cards"
                  className="w-full rounded-full border border-white/20 bg-white/95 py-3.5 pl-12 pr-28 text-sm text-slate-900 shadow-lg placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-400/30"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Search
                </button>
              </div>
            </form>

            {!ytLoading && yt && (
              <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-300" aria-hidden="true" />
                  <div className="text-left">
                    <p className="font-display text-2xl font-bold">{formatNumber(yt.subscriberCount)}</p>
                    <p className="text-xs text-blue-200">Subscribers</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-brand-300" aria-hidden="true" />
                  <div className="text-left">
                    <p className="font-display text-2xl font-bold">{formatNumber(yt.viewCount)}</p>
                    <p className="text-xs text-blue-200">Total Views</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-brand-300" aria-hidden="true" />
                  <div className="text-left">
                    <p className="font-display text-2xl font-bold">{formatNumber(yt.videoCount)}</p>
                    <p className="text-xs text-blue-200">Videos</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="container-content -mt-10 relative z-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => {
            const SIcon = s.icon;
            return (
              <Reveal key={s.label} delay={i * 80}>
                <div className="group flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-5">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${s.iconBg} transition-all duration-300 group-hover:scale-110`}>
                    <SIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-2xl font-bold text-slate-900">
                      <CountUp end={s.value} />
                    </p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Quick Access Categories */}
      <section className="container-content py-16 md:py-20">
        <Reveal>
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">Quick Access</h2>
            <p className="mt-1.5 text-sm text-slate-500">Jump straight to what you need</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {quickCats.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 60}>
              <Link
                to={`/blog?category=${cat.slug}`}
                className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <span className={`grid h-12 w-12 place-items-center rounded-xl ${cat.iconBg} transition-all duration-300 ${cat.tint} group-hover:text-white`}>
                  <Icon name={cat.icon} className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-display text-sm font-semibold text-slate-700 transition group-hover:text-slate-900">{cat.name}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Dynamic content sections */}
      {sections.map((sec, idx) =>
        sec.items.length > 0 ? (
          <section
            key={sec.slug}
            className={idx % 2 === 1 ? 'bg-slate-50 py-16 md:py-20' : 'py-16 md:py-20'}
          >
            <div className="container-content">
              <Reveal>
                <div className="mb-10 flex items-end justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                      <sec.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="font-display text-xl font-bold text-slate-900 md:text-2xl">{sec.title}</h2>
                      <p className="mt-0.5 text-sm text-slate-500">{sec.subtitle}</p>
                    </div>
                  </div>
                  <Link
                    to={sec.viewAll}
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 transition hover:gap-2"
                  >
                    View All <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sec.items.map((p, i) => (
                  <Reveal key={p.id} delay={i * 50}>
                    <BlogCard post={p} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null
      )}

      {/* Latest Videos */}
      {!ytLoading && yt && yt.videos && yt.videos.length > 0 && (
        <section className="bg-slate-50 py-16 md:py-20">
          <div className="container-content">
            <Reveal>
              <div className="mb-10 flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <Video className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-bold text-slate-900 md:text-2xl">Latest Videos</h2>
                    <p className="mt-0.5 text-sm text-slate-500">From our YouTube channel</p>
                  </div>
                </div>
                <a
                  href={channel.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 transition hover:gap-2"
                >
                  Visit Channel <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {yt.videos.slice(0, 4).map((v, i) => (
                <Reveal key={v.id} delay={i * 50}>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        loading="lazy"
                        width={320}
                        height={180}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 grid place-items-center bg-slate-900/30 opacity-0 transition group-hover:opacity-100">
                        <span className="grid h-12 w-12 place-items-center rounded-full bg-white/95 shadow-lg">
                          <Play className="h-5 w-5 translate-x-0.5 fill-brand-600 text-brand-600" aria-hidden="true" />
                        </span>
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-sm font-bold leading-snug text-slate-900 line-clamp-2 transition group-hover:text-brand-700">
                        {v.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-400">{timeAgo(v.publishedAt)}</p>
    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA banner */}
      <section className="container-content py-16 md:py-20">
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-xl md:p-12">
            <div className="grid items-center gap-6 md:grid-cols-2">
              <div>
                <h2 className="font-display text-2xl font-bold md:text-3xl">Never Miss an Update</h2>
                <p className="mt-2 text-sm leading-relaxed text-blue-100 md:text-base">
                  Subscribe to our YouTube channel and get the latest job notifications, exam results, and career guidance straight to your feed.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <a
                  href={channel.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <Video className="h-4 w-4" aria-hidden="true" /> Subscribe on YouTube
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" /> Contact Us
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
