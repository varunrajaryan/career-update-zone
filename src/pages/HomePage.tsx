import { useEffect } from 'react';
import { Seo } from '../components/Seo';
import { Link } from '../router';
import { BlogCard } from '../components/BlogCard';
import { Reveal } from '../components/Reveal';
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
  Clock,
  Mail,
  Video,
  Play,
  Users,
  Eye,
  GraduationCap,
  Newspaper,
  Lightbulb,
} from 'lucide-react';

type Stat = { label: string; value: string; icon: typeof Briefcase; tint: string };
type Section = { slug: string; title: string; subtitle: string; icon: typeof Briefcase };

export function HomePage() {
  const { posts, loading } = usePublishedPosts();
  const { data: yt, loading: ytLoading } = useYouTubeChannel();

  const jobs = posts.filter((p) => p.category === 'latest-jobs' || p.category === 'bihar-jobs').slice(0, 6);
  const results = posts.filter((p) => p.category === 'result').slice(0, 6);
  const admitCards = posts.filter((p) => p.category === 'admit-card').slice(0, 6);
  const news = posts.filter((p) => p.category === 'exam-preparation' || p.category === 'scholarships').slice(0, 6);
  const career = posts.filter((p) => p.category === 'career-tips' || p.category === 'syllabus').slice(0, 6);

  const stats: Stat[] = [
    { label: 'Latest Jobs', value: String(jobs.length || 0), icon: Briefcase, tint: 'from-blue-500 to-blue-600' },
    { label: 'Results', value: String(results.length || 0), icon: Trophy, tint: 'from-emerald-500 to-emerald-600' },
    { label: 'Admit Cards', value: String(admitCards.length || 0), icon: CreditCard, tint: 'from-amber-500 to-amber-600' },
    { label: 'Career Articles', value: String(posts.length || 0), icon: FileText, tint: 'from-rose-500 to-rose-600' },
  ];

  const sections: { slug: string; title: string; subtitle: string; icon: typeof Briefcase; items: typeof posts; viewAll: string }[] = [
    { slug: 'latest-jobs', title: 'Latest Jobs', subtitle: 'Fresh government job notifications', icon: Briefcase, items: jobs, viewAll: '/latest-jobs' },
    { slug: 'result', title: 'Latest Results', subtitle: 'Exam results and merit lists', icon: Trophy, items: results, viewAll: '/blog?category=result' },
    { slug: 'admit-card', title: 'Admit Cards', subtitle: 'Download hall tickets and call letters', icon: CreditCard, items: admitCards, viewAll: '/blog?category=admit-card' },
    { slug: 'news', title: 'Latest News', subtitle: 'Exam updates and announcements', icon: Newspaper, items: news, viewAll: '/blog' },
    { slug: 'career', title: 'Career Guidance', subtitle: 'Tips, syllabus & preparation strategy', icon: Lightbulb, items: career, viewAll: '/blog?category=career-tips' },
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

  return (
    <>
      <Seo canonical="/" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/5905702/pexels-photo-5905702.jpeg"
            alt="Government job exam preparation"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative container-content py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-200 backdrop-blur">
              <Bell className="h-3.5 w-3.5" aria-hidden="true" /> Sarkari Job Updates
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Latest Sarkari Jobs, Results, Admit Cards &amp; Career Updates
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-blue-100 md:text-lg">
              {channel.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/latest-jobs"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition hover:bg-blue-50 hover:shadow-xl"
              >
                <TrendingUp className="h-4 w-4" aria-hidden="true" /> Latest Jobs
              </Link>
              <Link
                to="/blog?category=result"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Trophy className="h-4 w-4" aria-hidden="true" /> Latest Results
              </Link>
            </div>
            {!ytLoading && yt && (
              <div className="mt-10 flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-300" aria-hidden="true" />
                  <div>
                    <p className="font-display text-2xl font-bold">{formatNumber(yt.subscriberCount)}</p>
                    <p className="text-xs text-blue-200">Subscribers</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-brand-300" aria-hidden="true" />
                  <div>
                    <p className="font-display text-2xl font-bold">{formatNumber(yt.viewCount)}</p>
                    <p className="text-xs text-blue-200">Total Views</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-brand-300" aria-hidden="true" />
                  <div>
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
      <section className="container-content -mt-8 relative z-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => {
            const SIcon = s.icon;
            return (
              <Reveal key={s.label} delay={i * 80}>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md md:p-5">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${s.tint} text-white`}>
                    <SIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-2xl font-bold text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="container-content py-14 md:py-16">
        <Reveal>
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">Browse by Category</h2>
            <p className="mt-1.5 text-sm text-slate-500">Find updates by topic</p>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 60}>
              <Link
                to={`/blog?category=${cat.slug}`}
                className="group flex h-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon name={cat.icon} className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-900 transition group-hover:text-brand-700">{cat.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">{cat.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Dynamic content sections */}
      {sections.map((sec) =>
        sec.items.length > 0 ? (
          <section
            key={sec.slug}
            className={sec.slug === 'admit-card' || sec.slug === 'career' ? 'bg-slate-50 py-14 md:py-16' : 'container-content py-14 md:py-16'}
          >
            <div className={sec.slug === 'admit-card' || sec.slug === 'career' ? 'container-content' : ''}>
              <Reveal>
                <div className="mb-8 flex items-end justify-between gap-4">
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
        <section className="bg-slate-50 py-14 md:py-16">
          <div className="container-content">
            <Reveal>
              <div className="mb-8 flex items-end justify-between gap-4">
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
                    className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
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
      <section className="container-content py-14 md:py-16">
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white md:p-12">
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
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-blue-50"
                >
                  <Video className="h-4 w-4" aria-hidden="true" /> Subscribe on YouTube
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
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
