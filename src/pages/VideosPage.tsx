import { Seo, buildVideoObjectSchema } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useYouTubeChannel } from '../lib/useYouTube';
import { channel } from '../content/channel';
import { formatNumber, timeAgo } from '../lib/editor-utils';
import { Video } from 'lucide-react';

export function VideosPage() {
  const { data: yt, loading, error } = useYouTubeChannel();
  const videoSchemas = yt?.videos?.slice(0, 12).map((v) => buildVideoObjectSchema({
    id: v.id,
    title: v.title,
    description: v.description,
    uploadDate: v.publishedAt,
    thumbnail: v.thumbnail,
  })) || [];
  return (
    <>
      <Seo title="Videos" description="Watch the latest videos from Career Update Zone on YouTube." canonical="/videos" schema={videoSchemas} />
      <div className="border-b border-ink-100 bg-white">
        <div className="container-content py-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Videos' }]} />
          <h1 className="mt-3 font-display text-3xl font-bold text-ink-950">Videos</h1>
          <p className="mt-1 text-ink-500">Latest videos from our YouTube channel</p>
        </div>
      </div>
      <div className="container-content py-12">
        {loading && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[...Array(6)].map((_, i) => <div key={i} className="card h-64 animate-pulse bg-ink-100" />)}</div>}
        {error && <div className="rounded-xl bg-error-50 px-6 py-10 text-center text-error-600">Failed to load videos: {error}</div>}
        {!loading && !error && yt && (
          <>
            <div className="mb-8 flex flex-wrap items-center gap-6 rounded-2xl bg-ink-950 p-6 text-white">
              {yt.thumbnail && <img src={yt.thumbnail} alt={`${yt.title} channel logo`} width={80} height={80} className="h-20 w-20 rounded-full ring-2 ring-white/20" />}
              <div className="flex-1">
                <h2 className="font-display text-xl font-bold">{yt.title}</h2>
                <p className="mt-1 text-sm text-ink-400 line-clamp-1">{yt.description}</p>
              </div>
              <div className="flex gap-6">
                <div className="text-center"><p className="text-2xl font-bold">{formatNumber(yt.subscriberCount)}</p><p className="text-xs text-ink-400">Subscribers</p></div>
                <div className="text-center"><p className="text-2xl font-bold">{formatNumber(yt.viewCount)}</p><p className="text-xs text-ink-400">Views</p></div>
                <div className="text-center"><p className="text-2xl font-bold">{formatNumber(yt.videoCount)}</p><p className="text-xs text-ink-400">Videos</p></div>
              </div>
              <a href={channel.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary"><Video className="h-4 w-4" aria-hidden="true" /> Subscribe</a>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {yt.videos.map((v) => (
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
          </>
        )}
      </div>
    </>
  );
}
