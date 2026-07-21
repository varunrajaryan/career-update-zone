import { Link } from '../router';
import type { PostRow } from '../lib/supabase';
import { categories } from '../content/categories';
import { Icon } from './Icon';
import { formatDate } from '../lib/editor-utils';
import { Clock, ArrowRight } from 'lucide-react';

export function BlogCard({ post }: { post: PostRow }) {
  const cat = categories.find((c) => c.slug === post.category);
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/60"
      aria-label={post.title}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={post.cover}
          alt={post.title}
          loading="lazy"
          width={640}
          height={400}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {cat && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur">
            <Icon name={cat.icon} className="h-3 w-3" aria-hidden="true" />
            {cat.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-bold leading-snug text-slate-900 line-clamp-2 transition group-hover:text-brand-700">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-2">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-brand-700 transition group-hover:gap-2">
            Read More <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
