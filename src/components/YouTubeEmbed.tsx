import { useState } from 'react';
import { Play } from 'lucide-react';

type YouTubeEmbedProps = {
  videoId: string;
  title?: string;
  className?: string;
};

export function YouTubeEmbed({ videoId, title = 'YouTube video player', className = '' }: YouTubeEmbedProps) {
  const [activated, setActivated] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (activated) {
    return (
      <div className={`relative aspect-video overflow-hidden rounded-2xl ${className}`}>
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      className={`group relative aspect-video w-full overflow-hidden rounded-2xl bg-ink-950 ${className}`}
      aria-label={`Play: ${title}`}
    >
      <img
        src={thumb}
        alt={title}
        loading="lazy"
        width={480}
        height={270}
        className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
      />
      <span className="absolute inset-0 grid place-items-center bg-ink-950/20 transition group-hover:bg-ink-950/10">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-red-600 text-white shadow-lg transition group-hover:scale-110">
          <Play className="h-7 w-7 translate-x-0.5 fill-current" />
        </span>
      </span>
    </button>
  );
}
