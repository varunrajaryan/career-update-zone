import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BlogCard } from '../components/BlogCard';
import { usePublishedPosts } from '../lib/usePosts';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Link } from '../router';

export function LatestJobsPage() {
  const { posts, loading } = usePublishedPosts();
  const jobs = posts.filter((p) => p.category === 'latest-jobs' || p.category === 'admit-card' || p.category === 'result');
  return (
    <>
      <Seo title="Latest Jobs" description="Latest Sarkari job notifications, admit cards, and results." canonical="/latest-jobs" />
      <div className="border-b border-ink-100 bg-white">
        <div className="container-content py-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Latest Jobs' }]} />
          <h1 className="mt-3 font-display text-3xl font-bold text-ink-950">Latest Jobs</h1>
          <p className="mt-1 text-ink-500">Government job notifications, admit cards, and results</p>
        </div>
      </div>
      <div className="container-content py-12">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[...Array(6)].map((_, i) => <div key={i} className="card h-80 animate-pulse bg-ink-100" />)}</div>
        ) : jobs.length === 0 ? (
          <div className="py-16 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-ink-300" aria-hidden="true" />
            <p className="mt-4 text-ink-500">No job notifications posted yet.</p>
            <Link to="/blog" className="btn-primary mt-4">Browse all posts <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{jobs.map((p) => <BlogCard key={p.id} post={p} />)}</div>
        )}
      </div>
    </>
  );
}
