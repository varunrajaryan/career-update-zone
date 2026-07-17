import { useEffect, useState } from 'react';
import { Link, useRouter } from '../../router';
import { useAuth } from '../../lib/auth';
import { supabase, type PostRow } from '../../lib/supabase';
import { Seo } from '../../components/Seo';
import { categories } from '../../content/categories';
import { Icon } from '../../components/Icon';
import { formatDate } from '../../lib/editor-utils';
import { FileText, Plus, LogOut, Eye, Edit3, Trash2, Search, Clock, CheckCircle2, Home } from 'lucide-react';

export function AdminDashboardPage() {
  const { session, signOut } = useAuth();
  const user = session?.user;
  const { navigate } = useRouter();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });
    if (!error && data) setPosts(data as PostRow[]);
    setLoading(false);
  }

  async function handleDelete(slug: string) {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('slug', slug);
    if (!error) setPosts((p) => p.filter((x) => x.slug !== slug));
    else alert('Error deleting post: ' + error.message);
  }

  async function togglePublish(post: PostRow) {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase.from('blog_posts').update({ status: newStatus }).eq('slug', post.slug);
    if (!error) setPosts((p) => p.map((x) => x.slug === post.slug ? { ...x, status: newStatus } : x));
  }

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login', { replace: true });
  }

  const filtered = posts.filter((p) => {
    const matchQ = !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.slug.includes(q.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchQ && matchStatus;
  });
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  return (
    <>
      <Seo title="Dashboard — Admin" description="Admin dashboard" canonical="/admin" noindex />
      <div className="border-b border-ink-100 bg-ink-950 text-white">
        <div className="container-content py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10"><FileText className="h-5 w-5 text-brand-500" aria-hidden="true" /></span>
            <div><p className="font-display text-sm font-semibold">Admin Dashboard</p><p className="text-xs text-ink-400">{user?.email}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"><Home className="h-3.5 w-3.5" aria-hidden="true" /><span className="hidden sm:inline">View Website</span></Link>
            <button onClick={handleSignOut} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-error-600"><LogOut className="h-3.5 w-3.5" aria-hidden="true" /><span className="hidden sm:inline">Logout</span></button>
          </div>
        </div>
      </div>
      <div className="container-content py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card p-5"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-100 text-ink-700"><FileText className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-2xl font-bold text-ink-950">{posts.length}</p><p className="text-sm text-ink-500">Total posts</p></div></div></div>
          <div className="card p-5"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-success-50 text-success-600"><CheckCircle2 className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-2xl font-bold text-ink-950">{publishedCount}</p><p className="text-sm text-ink-500">Published</p></div></div></div>
          <div className="card p-5"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-warning-50 text-warning-600"><Clock className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-2xl font-bold text-ink-950">{draftCount}</p><p className="text-sm text-ink-500">Drafts</p></div></div></div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold text-ink-950">All posts</h1>
          <button onClick={() => navigate('/admin/new')} className="btn-primary"><Plus className="h-4 w-4" aria-hidden="true" /> New post</button>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
            <label htmlFor="admin-search" className="sr-only">Search posts</label>
            <input id="admin-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts…" className="input pl-10" />
          </div>
          <label htmlFor="status-filter" className="sr-only">Filter by status</label>
          <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-auto">
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white">
          {loading ? (
            <p className="px-6 py-16 text-center text-ink-500">Loading posts…</p>
          ) : filtered.length === 0 ? (
            <p className="px-6 py-16 text-center text-ink-500">No posts found. Create your first post.</p>
          ) : (
            <table className="w-full">
              <thead className="border-b border-ink-100 bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 hidden md:table-cell">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((p) => {
                  const cat = categories.find((c) => c.slug === p.category);
                  return (
                    <tr key={p.id} className="group transition hover:bg-ink-50/50">
                      <td className="px-6 py-4"><p className="font-medium text-ink-950 line-clamp-1">{p.title}</p><p className="text-xs text-ink-400">/{p.slug}</p></td>
                      <td className="px-4 py-4 hidden sm:table-cell">{cat && <span className="chip bg-ink-100 text-ink-700"><Icon name={cat.icon} className="h-3 w-3" aria-hidden="true" /> {cat.name}</span>}</td>
                      <td className="px-4 py-4"><button onClick={() => togglePublish(p)} className={`chip cursor-pointer transition ${p.status === 'published' ? 'bg-success-50 text-success-700 hover:bg-success-100' : 'bg-warning-50 text-warning-700 hover:bg-warning-100'}`}>{p.status === 'published' ? 'Published' : 'Draft'}</button></td>
                      <td className="px-4 py-4 hidden md:table-cell text-sm text-ink-500">{formatDate(p.date)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => navigate(`/admin/edit/${p.slug}`)} className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-950" title="Edit" aria-label={`Edit ${p.title}`}><Edit3 className="h-4 w-4" aria-hidden="true" /></button>
                          <Link to={`/blog/${p.slug}`} className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-950" title="View" aria-label={`View ${p.title}`}><Eye className="h-4 w-4" aria-hidden="true" /></Link>
                          <button onClick={() => handleDelete(p.slug)} className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 transition hover:bg-error-50 hover:text-error-600" title="Delete" aria-label={`Delete ${p.title}`}><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
