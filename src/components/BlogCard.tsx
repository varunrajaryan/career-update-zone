import { Link } from '../router';
import type { PostRow } from '../lib/supabase';
import { categories } from '../content/categories';
import { Icon } from './Icon';
import { formatDate } from '../lib/editor-utils';
import { Clock } from 'lucide-react';

export function BlogCard({ post }: { post: PostRow }) {
  const cat = categories.find((c) => c.slug === post.category);
  return (
    <Link to={`/blog/${post.slug}`} className="card group block overflow-hidden transition hover:shadow-md" aria-label={post.title}>
      <div className="aspect-[16/10] overflow-hidden bg-ink-100">
        <img src={post.cover} alt={post.title} loading="lazy" width={640} height={400} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        {cat && <span className="chip bg-brand-50 text-brand-700 mb-2"><Icon name={cat.icon} className="h-3 w-3" aria-hidden="true" /> {cat.name}</span>}
        <h3 className="font-display text-base font-bold text-ink-950 line-clamp-2 group-hover:text-brand-700 transition">{post.title}</h3>
        <p className="mt-1.5 text-sm text-ink-500 line-clamp-2">{post.excerpt}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-ink-400">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden="true" /> {post.read_time} min</span>
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </Link>
  );
}
