import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Link } from '../router';
import { categories } from '../content/categories';
import { Icon } from '../components/Icon';
import { usePublishedPosts } from '../lib/usePosts';
import { ArrowRight } from 'lucide-react';

export function CategoriesPage() {
  const { posts } = usePublishedPosts();
  const counts = categories.map((cat) => ({ ...cat, count: posts.filter((p) => p.category === cat.slug).length }));
  return (
    <>
      <Seo title="Categories" description="Browse all job update categories." canonical="/categories" />
      <div className="border-b border-ink-100 bg-white">
        <div className="container-content py-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
          <h1 className="mt-3 font-display text-3xl font-bold text-ink-950">Categories</h1>
          <p className="mt-1 text-ink-500">Browse updates by category</p>
        </div>
      </div>
      <div className="container-content py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {counts.map((cat) => (
            <Link key={cat.slug} to={`/blog?category=${cat.slug}`} className="card group p-6 transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white"><Icon name={cat.icon} className="h-6 w-6" aria-hidden="true" /></span>
                <span className="chip bg-ink-100 text-ink-600">{cat.count} posts</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-950 group-hover:text-brand-700 transition">{cat.name}</h3>
              <p className="mt-1 text-sm text-ink-500 line-clamp-2">{cat.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 transition group-hover:opacity-100">Browse <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
