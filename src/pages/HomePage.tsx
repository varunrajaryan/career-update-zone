import { Seo } from '../components/Seo';
import { Link } from '../router';
import { BlogCard } from '../components/BlogCard';
import { usePublishedPosts } from '../lib/usePosts';
import { useYouTubeChannel } from '../lib/useYouTube';
import { channel } from '../content/channel';
import { categories } from '../content/categories';
import { Icon } from '../components/Icon';
import { formatNumber, timeAgo } from '../lib/editor-utils';
import { Video, TrendingUp, Users, Eye, ArrowRight, Bell, Clock, Mail } from 'lucide-react';

export function HomePage() {
  const { posts, loading } = usePublishedPosts();
  const { data: yt, loading: ytLoading } = useYouTubeChannel();
  const featured = posts[0];
  const recent = posts.slice(1, 7);

  return (
    <>
      <Seo canonical="/" />
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/5905702/pexels-photo-5905702.jpeg" alt="Government job exam preparation" width={1920} height={1080} className="h-full w-full object-cover opacity-20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-950/90 to-brand-900/40" />
        <div className="relative container-content py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="chip bg-white/10 text-brand-300 backdrop-blur"><Bell className="h-3.5 w-3.5" aria-hidden="true" /> Sarkari Job Updates</span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">Your Career, <span className="text-brand-400">Updated</span> Every Day</h1>
            <p className="mt-4 text-lg text-ink-300 leading-relaxed">{channel.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/latest-jobs" className="btn-primary"><TrendingUp className="h-4 w-4" aria-hidden="true" /> Latest Jobs</Link>
              <Link to="/blog" className="btn-ghost border-white/20 bg-white/5 text-white hover:bg-white/10">Read Blog <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
            {!ytLoading && yt && (
              <div className="mt-10 flex flex-wrap gap-6">
                <div className="flex items-center gap-2"><Users className="h-5 w-5 text-brand-400" aria-hidden="true" /><div><p className="text-2xl font-bold">{formatNumber(yt.subscriberCount)}</p><p className="text-xs text-ink-400">Subscribers</p></div></div>
                <div className="flex items-center gap-2"><Eye className="h-5 w-5 text-brand-400" aria-hidden="true" /><div><p className="text-2xl font-bold">{formatNumber(yt.viewCount)}</p><p className="text-xs text-ink-400">Total Views</p></div></div>
                <div className="flex items-center gap-2"><Video className="h-5 w-5 text-brand-400" aria-hidden="true" /><div><p className="text-2xl font-bold">{formatNumber(yt.videoCount)}</p><p className="text-xs text-ink-400">Videos</p></div></div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container-content py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink-950">Browse by Category</h2>
            <p className="mt-1 text-ink-500">Find updates by topic</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.slug} to={`/blog?category=${cat.slug}`} className="card group p-5 transition hover:shadow-md">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white"><Icon name={cat.icon} className="h-6 w-6" aria-hidden="true" /></span>
                <div>
                  <h3 className="font-display font-bold text-ink-950 group-hover:text-brand-700 transition">{cat.name}</h3>
                  <p className="mt-1 text-sm text-ink-500 line-clamp-2">{cat.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-content py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink-950">Latest Posts</h2>
            <p className="mt-1 text-ink-500">Fresh updates and notifications</p>
          </div>
          <Link to="/blog" className="btn-ghost text-sm">View all <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[...Array(6)].map((_, i) => <div key={i} className="card h-80 animate-pulse bg-ink-100" />)}</div>
        ) : posts.length === 0 ? (
          <p className="py-12 text-center text-ink-500">No posts published yet.</p>
        ) : (
          <>
            {featured && (
              <div className="mb-8">
                <Link to={`/blog/${featured.slug}`} className="card group block overflow-hidden transition hover:shadow-lg lg:flex">
                  <div className="aspect-[16/10] overflow-hidden bg-ink-100 lg:w-1/2">
                    <img src={featured.cover} alt={featured.title} width={800} height={500} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-center p-6 lg:w-1/2">
                    <span className="chip bg-brand-50 text-brand-700 mb-3 w-fit">Featured</span>
                    <h3 className="font-display text-2xl font-bold text-ink-950 group-hover:text-brand-700 transition">{featured.title}</h3>
                    <p className="mt-2 text-ink-500 line-clamp-3">{featured.excerpt}</p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-ink-400">
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden="true" /> {featured.read_time} min read</span>
                      <span>{featured.date}</span>
                    </div>
                  </div>
                </Link>
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{recent.map((p) => <BlogCard key={p.id} post={p} />)}</div>
          </>
        )}
      </section>

      {!ytLoading && yt && yt.videos && yt.videos.length > 0 && (
        <section className="bg-ink-50 py-16">
          <div className="container-content">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold text-ink-950">Latest Videos</h2>
                <p className="mt-1 text-ink-500">From our YouTube channel</p>
              </div>
              <a href={channel.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm"><Video className="h-4 w-4" aria-hidden="true" /> Visit Channel</a>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {yt.videos.slice(0, 4).map((v) => (
                <a key={v.id} href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="card group overflow-hidden transition hover:shadow-md">
                  <div className="relative aspect-video overflow-hidden bg-ink-100">
                    <img src={v.thumbnail} alt={v.title} loading="lazy" width={320} height={180} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 grid place-items-center bg-ink-950/30 opacity-0 transition group-hover:opacity-100">
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90"><Video className="h-6 w-6 text-brand-600" aria-hidden="true" /></span>
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-sm font-bold text-ink-950 line-clamp-2 group-hover:text-brand-700 transition">{v.title}</h3>
                    <p className="mt-1.5 text-xs text-ink-400">{timeAgo(v.publishedAt)}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-content py-16">
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 md:p-12 text-white">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold">Never Miss an Update</h2>
              <p className="mt-2 text-brand-100">Subscribe to our YouTube channel and get the latest job notifications, exam results, and career guidance straight to your feed.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <a href={channel.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"><Video className="h-4 w-4" aria-hidden="true" /> Subscribe on YouTube</a>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"><Mail className="h-4 w-4" aria-hidden="true" /> Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
