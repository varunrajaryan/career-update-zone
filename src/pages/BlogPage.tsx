import { useState, useMemo } from 'react';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BlogCard } from '../components/BlogCard';
import { SearchBar } from '../components/SearchBar';
import { CategoryPills } from '../components/CategoryPills';
import { usePublishedPosts } from '../lib/usePosts';
import { useRouter } from '../router';
import { Search } from 'lucide-react';

export function BlogPage() {
  const { route } = useRouter();
  const { posts, loading } = usePublishedPosts();
  const [search, setSearch] = useState('');
  const params = new URLSearchParams(route.path.split('?')[1] || '');
  const activeCategory = params.get('category') || '';
  const urlQuery = params.get('q') || '';
  const effectiveSearch = search || urlQuery;

  const filtered = useMemo(() => posts.filter((p) => {
    const matchCat = !activeCategory || p.category === activeCategory;
    const matchSearch = !effectiveSearch || p.title.toLowerCase().includes(effectiveSearch.toLowerCase()) || p.excerpt.toLowerCase().includes(effectiveSearch.toLowerCase()) || p.tags?.some((t) => t.includes(effectiveSearch.toLowerCase()));
    return matchCat && matchSearch;
  }), [posts, activeCategory, effectiveSearch]);

  return (
    <>
      <Seo title="Blog" description="Latest articles and job notifications from Career Update Zone." canonical="/blog" />
      <div className="border-b border-ink-100 bg-white">
        <div className="container-content py-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog' }]} />
          <h1 className="mt-3 font-display text-3xl font-bold text-ink-950">Blog</h1>
          <p className="mt-1 text-ink-500">Articles, job notifications, and career updates</p>
        </div>
      </div>
      <div className="container-content py-12">
        <div className="mb-8 space-y-4">
          <SearchBar value={effectiveSearch} onChange={setSearch} />
          <CategoryPills active={activeCategory} />
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[...Array(6)].map((_, i) => <div key={i} className="card h-80 animate-pulse bg-ink-100" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Search className="mx-auto h-12 w-12 text-ink-300" aria-hidden="true" />
            <p className="mt-4 text-ink-500">No posts found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((p) => <BlogCard key={p.id} post={p} />)}</div>
        )}
      </div>
    </>
  );
}
