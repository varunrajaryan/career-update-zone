import { Link } from '../router';
import { BlogCard } from './BlogCard';
import type { PostRow } from '../lib/supabase';

export function RelatedPosts({ posts }: { posts: PostRow[] }) {
  if (posts.length === 0) return null;
  return (
    <section aria-label="Related posts" className="mt-12">
      <h2 className="font-display text-2xl font-bold text-ink-950 mb-4">Related Posts</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <BlogCard key={p.id} post={p} />)}
      </div>
      <div className="mt-6 text-center">
        <Link to="/blog" className="btn-ghost text-sm">View all posts</Link>
      </div>
    </section>
  );
}
