import { Link } from '../router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PostRow } from '../lib/supabase';

export function PrevNextNav({ prev, next }: { prev: PostRow | null; next: PostRow | null }) {
  return (
    <nav aria-label="Post navigation" className="mt-10 grid gap-4 sm:grid-cols-2">
      {prev ? (
        <Link to={`/blog/${prev.slug}`} className="card group flex items-center gap-3 p-5 transition hover:shadow-md">
          <ChevronLeft className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
          <div>
            <p className="text-xs text-ink-400">Previous</p>
            <p className="font-medium text-ink-950 line-clamp-1 group-hover:text-brand-700 transition">{prev.title}</p>
          </div>
        </Link>
      ) : <div className="hidden sm:block" />}
      {next ? (
        <Link to={`/blog/${next.slug}`} className="card group flex items-center justify-end gap-3 p-5 text-right transition hover:shadow-md">
          <div>
            <p className="text-xs text-ink-400">Next</p>
            <p className="font-medium text-ink-950 line-clamp-1 group-hover:text-brand-700 transition">{next.title}</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
        </Link>
      ) : <div className="hidden sm:block" />}
    </nav>
  );
}
