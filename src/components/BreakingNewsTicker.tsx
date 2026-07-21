import { useEffect, useState } from 'react';
import { Link } from '../router';
import { Radio } from 'lucide-react';
import { usePublishedPosts } from '../lib/usePosts';
import type { PostRow } from '../lib/supabase';

export function BreakingNewsTicker() {
  const { posts, loading } = usePublishedPosts();
  const [items, setItems] = useState<PostRow[]>([]);

  useEffect(() => {
    if (!loading && posts.length > 0) setItems(posts.slice(0, 12));
  }, [posts, loading]);

  if (loading || items.length === 0) return null;
  const doubled = [...items, ...items];

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="container-content flex items-center gap-3 py-2">
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          <Radio className="h-3 w-3 animate-pulse" aria-hidden="true" />
          Breaking
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-cuz-marquee gap-8 whitespace-nowrap">
            {doubled.map((p, i) => (
              <Link
                key={`${p.id}-${i}`}
                to={`/blog/${p.slug}`}
                className="text-sm text-slate-600 transition hover:text-brand-700 hover:underline"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
