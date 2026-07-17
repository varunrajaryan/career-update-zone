import { Clock, Play } from 'lucide-react';
import { Link } from '../router';
import type { Video } from '../content/videos';
import { getCategory } from '../content/categories';

export function VideoCard({ video }: { video: Video }) {
  const cat = getCategory(video.category);
  return (
    <article className="group card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link to="/videos" className="block">
        <div className="relative aspect-video overflow-hidden bg-ink-900">
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            width={320}
            height={180}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
          <span className="absolute right-3 top-3 rounded-md bg-ink-950/80 px-1.5 py-0.5 text-xs font-medium text-white backdrop-blur">
            {video.duration}
          </span>
          <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brand-600 opacity-0 shadow-lift transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
            <Play className="h-6 w-6 translate-x-0.5 fill-current" />
          </span>
        </div>
        <div className="p-4">
          {cat && (
            <span className="chip bg-brand-50 text-brand-700">{cat.name}</span>
          )}
          <h3 className="mt-3 font-display text-base font-semibold leading-snug text-ink-950 line-clamp-2 group-hover:text-brand-700">
            {video.title}
          </h3>
          <p className="mt-2 text-sm text-ink-600 line-clamp-2">{video.description}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-ink-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span>·</span>
            <span>{video.views} views</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
