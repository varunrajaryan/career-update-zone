import { useEffect, useState, useCallback } from 'react';
import { Link, useRouter } from '../../router';
import { supabase, type PostRow } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Seo } from '../../components/Seo';
import { RichTextEditor } from '../../components/RichTextEditor';
import { YouTubeEmbed } from '../../components/YouTubeEmbed';
import { categories } from '../../content/categories';
import { slugify, extractYouTubeId, estimateReadTime } from '../../lib/editor-utils';
import { ArrowLeft, Save, Eye, Trash2, Upload, Video, X, Plus, Search as SearchIcon, AlertCircle, CheckCircle2, Wand2, Link2, Loader2, FileText, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useAiSettings } from '../../lib/useSiteSettings';

type Props = { slug?: string };
type Faq = { q: string; a: string };

export function AdminEditorPage({ slug }: Props) {
  const { navigate } = useRouter();
  const isEdit = !!slug;
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [cover, setCover] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [category, setCategory] = useState(categories[0].slug);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [autoSlug, setAutoSlug] = useState(true);
  const [customSlug, setCustomSlug] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const finalSlug = autoSlug ? slugify(title) : slugify(customSlug);

  // AI Generator state
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const { settings: aiSettings, loading: aiSettingsLoading } = useAiSettings();
  const [aiSourceUrl, setAiSourceUrl] = useState('');
  const [aiCategory, setAiCategory] = useState(categories[0].slug);
  const [aiCover, setAiCover] = useState('');
  const [aiYoutubeUrl, setAiYoutubeUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const aiConfigured = !!aiSettings && aiSettings.hasApiKey;

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug!).maybeSingle();
      if (error || !data) { setError('Post not found'); setLoading(false); return; }
      const p = data as PostRow;
      setTitle(p.title); setExcerpt(p.excerpt); setBody(p.body); setCover(p.cover);
      setYoutubeId(p.youtube_id || ''); setYoutubeUrl(p.youtube_id ? `https://www.youtube.com/watch?v=${p.youtube_id}` : '');
      setCategory(p.category); setTags(p.tags || []); setStatus(p.status as 'draft' | 'published');
      setSeoTitle(p.seo_title ?? ''); setSeoDescription(p.seo_description ?? '');
      setFaqs(Array.isArray(p.faqs) ? p.faqs : []); setAutoSlug(false); setCustomSlug(p.slug);
      setLoading(false);
    })();
  }, [slug, isEdit]);

  useEffect(() => {
    if (youtubeUrl) setYoutubeId(extractYouTubeId(youtubeUrl));
    else setYoutubeId('');
  }, [youtubeUrl]);

  const handleYoutubePaste = useCallback((e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text');
    const id = extractYouTubeId(pasted);
    if (id) { e.preventDefault(); setYoutubeUrl(pasted); setYoutubeId(id); }
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from('post-images').upload(path, file, { cacheControl: '3600' });
    if (upErr) { setError('Upload failed: ' + upErr.message); setUploading(false); return; }
    const { data: pub } = supabase.storage.from('post-images').getPublicUrl(path);
    setCover(pub.publicUrl);
    setUploading(false);
  }

  function addTag() { const t = tagInput.trim().toLowerCase(); if (t && !tags.includes(t)) setTags([...tags, t]); setTagInput(''); }
  function removeTag(t: string) { setTags(tags.filter((x) => x !== t)); }
  function addFaq() { setFaqs([...faqs, { q: '', a: '' }]); }
  function updateFaq(i: number, field: 'q' | 'a', val: string) { setFaqs(faqs.map((f, idx) => (idx === i ? { ...f, [field]: val } : f))); }
  function removeFaq(i: number) { setFaqs(faqs.filter((_, idx) => idx !== i)); }

  async function handleGenerate() {
    setGenerateError(null);
    setGenerateSuccess(false);
    if (!aiSourceUrl.trim() || !/^https?:\/\//i.test(aiSourceUrl.trim())) {
      setGenerateError('Please enter a valid source URL.');
      return;
    }
    setGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-generate`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sourceUrl: aiSourceUrl.trim(),
          category: aiCategory,
          categoryName: categories.find((c) => c.slug === aiCategory)?.name || aiCategory,
          cover: aiCover.trim() || null,
          youtubeId: extractYouTubeId(aiYoutubeUrl) || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenerateError(data?.error || `Generation failed (HTTP ${res.status}).`);
        return;
      }
      const a = data?.article;
      if (!a || !a.title || !a.body) {
        setGenerateError('AI returned an incomplete article. Try again.');
        return;
      }
      // Populate the existing editor fields for review/edit.
      setTitle(a.title);
      setAutoSlug(false);
      setCustomSlug(a.slug || slugify(a.title));
      setExcerpt(a.excerpt || '');
      setBody(a.body);
      setSeoTitle(a.seoTitle || '');
      setSeoDescription(a.seoDescription || '');
      setTags(Array.isArray(a.tags) ? a.tags.slice(0, 10) : []);
      setFaqs(Array.isArray(a.faqs) ? a.faqs.filter((f: { q?: string; a?: string }) => f.q && f.a).slice(0, 6) : []);
      setCategory(aiCategory);
      if (aiCover.trim()) setCover(aiCover.trim());
      if (aiYoutubeUrl.trim()) {
        const yid = extractYouTubeId(aiYoutubeUrl);
        if (yid) { setYoutubeId(yid); setYoutubeUrl(aiYoutubeUrl.trim()); }
      }
      setGenerateSuccess(true);
      setActiveTab('manual');
    } catch (err) {
      setGenerateError((err as Error).message || 'Network error while generating.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave(newStatus?: 'draft' | 'published') {
    setError(null); setSuccess(false);
    if (!title.trim()) return setError('Title is required');
    if (!excerpt.trim()) return setError('Excerpt is required');
    if (!body.trim() || body === '<br>') return setError('Content is required');
    if (!cover.trim()) return setError('Featured image is required');
    if (youtubeUrl.trim() && !youtubeId) return setError('Please enter a valid YouTube URL or leave this field empty.');
    if (!finalSlug) return setError('Slug is required — enter a title first');
    setSaving(true);
    const payload = {
      slug: finalSlug, title: title.trim(), excerpt: excerpt.trim(), body, cover: cover.trim(),
      youtube_id: youtubeId, category, tags, status: newStatus ?? status,
      read_time: estimateReadTime(body), seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      faqs: faqs.filter((f) => f.q.trim() && f.a.trim()),
    };
    if (isEdit) {
      const { error } = await supabase.from('blog_posts').update({ ...payload, last_updated: new Date().toISOString().slice(0, 10) }).eq('slug', slug!);
      if (error) setError('Save failed: ' + error.message);
      else { setSuccess(true); setStatus(payload.status); if (slug !== finalSlug) navigate(`/admin/edit/${finalSlug}`); }
    } else {
      const { error } = await supabase.from('blog_posts').insert(payload);
      if (error) { if (error.code === '23505') setError('A post with this slug already exists. Change the title or slug.'); else setError('Save failed: ' + error.message); }
      else { setSuccess(true); setStatus(payload.status); navigate(`/admin/edit/${finalSlug}`); }
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!isEdit) return;
    if (!confirm('Delete this post permanently?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('slug', slug!);
    if (!error) navigate('/admin');
    else setError('Delete failed: ' + error.message);
  }

  if (loading) return <div className="container-content py-32 text-center text-ink-500">Loading post…</div>;

  return (
    <>
      <Seo title={isEdit ? 'Edit Post — Admin' : 'New Post — Admin'} description="Post editor" canonical="/admin" noindex />
      <div className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur-xl">
        <div className="container-content py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="grid h-9 w-9 place-items-center rounded-lg bg-ink-100 text-ink-700 transition hover:bg-ink-200" aria-label="Back to dashboard"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></Link>
            <p className="font-display text-sm font-semibold text-ink-950">{isEdit ? 'Edit post' : 'New post'}</p>
            {finalSlug && <span className="hidden text-xs text-ink-400 sm:inline">/{finalSlug}</span>}
          </div>
          <div className="flex items-center gap-2">
            {error && <span className="hidden items-center gap-1 text-xs text-error-600 sm:flex" role="alert"><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{error}</span>}
            {success && <span className="hidden items-center gap-1 text-xs text-success-600 sm:flex"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />Saved</span>}
            <button onClick={() => handleSave('draft')} disabled={saving} className="btn-ghost disabled:opacity-50"><Save className="h-4 w-4" aria-hidden="true" /> Save draft</button>
            <button onClick={() => handleSave('published')} disabled={saving} className="btn-primary disabled:opacity-50"><Eye className="h-4 w-4" aria-hidden="true" /> {status === 'published' ? 'Update & publish' : 'Publish'}</button>
          </div>
        </div>
      </div>
      <div className="container-content py-8">
        {/* Editor tabs */}
        <div role="tablist" aria-label="Editor mode" className="mb-6 flex gap-2 rounded-2xl border border-ink-200 bg-white p-1.5">
          <button role="tab" aria-selected={activeTab === 'manual'} onClick={() => setActiveTab('manual')} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === 'manual' ? 'bg-brand-600 text-white shadow-sm' : 'text-ink-600 hover:bg-ink-100'}`}><FileText className="h-4 w-4" aria-hidden="true" /> Manual Editor</button>
          <button role="tab" aria-selected={activeTab === 'ai'} onClick={() => setActiveTab('ai')} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === 'ai' ? 'bg-brand-600 text-white shadow-sm' : 'text-ink-600 hover:bg-ink-100'}`}><Wand2 className="h-4 w-4" aria-hidden="true" /> AI Generator</button>
        </div>

        {/* AI Generator panel */}
        {activeTab === 'ai' && (
          <div className="mb-8">
            {aiSettingsLoading ? (
              <div className="card flex items-center gap-3 p-6 text-sm text-ink-500"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Checking AI configuration…</div>
            ) : !aiConfigured ? (
              <div className="card border-warning-200 bg-warning-50/50 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning-600" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-warning-800">AI is not configured. Please add an API key in Admin Settings.</p>
                    <Link to="/admin/settings" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800"><Link2 className="h-4 w-4" aria-hidden="true" /> Open Admin Settings</Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  <h2 className="font-display text-lg font-bold text-ink-950">Generate an article from a source</h2>
                </div>
                <p className="mt-1.5 text-sm text-ink-500">Paste a source URL and pick a category. The AI rewrites the topic in the Career Update Zone style — original, SEO-friendly, never copied. Review and edit the result before publishing.</p>
                <div className="mt-5 grid gap-4">
                  <div>
                    <label htmlFor="ai-source-url" className="mb-1.5 block text-sm font-semibold text-ink-800">Source URL</label>
                    <input id="ai-source-url" type="url" value={aiSourceUrl} onChange={(e) => setAiSourceUrl(e.target.value)} placeholder="https://example.com/article-to-reference" className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 focus:outline-none" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ai-category" className="mb-1.5 block text-sm font-semibold text-ink-800">Category</label>
                      <select id="ai-category" value={aiCategory} onChange={(e) => setAiCategory(e.target.value)} className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none">
                        {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="ai-youtube" className="mb-1.5 block text-sm font-semibold text-ink-800">YouTube URL <span className="font-normal text-ink-400">(optional)</span></label>
                      <input id="ai-youtube" type="url" value={aiYoutubeUrl} onChange={(e) => setAiYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ai-cover" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-800"><ImageIcon className="h-4 w-4 text-brand-600" aria-hidden="true" /> Featured image <span className="font-normal text-ink-400">(optional)</span></label>
                    <input id="ai-cover" type="url" value={aiCover} onChange={(e) => setAiCover(e.target.value)} placeholder="Paste an image URL…" className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none" />
                    {aiCover && <img src={aiCover} alt="" className="mt-2 aspect-[16/10] w-full max-w-xs rounded-xl object-cover" />}
                  </div>
                </div>

                {generateError && <div className="mt-4 flex items-start gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><span>{generateError}</span></div>}
                {generateSuccess && <div className="mt-4 flex items-start gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><span>Article generated and loaded into the editor. Review and publish when ready.</span></div>}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={handleGenerate} disabled={generating} className="btn-primary disabled:opacity-50">
                    {generating ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Generating…</> : <><Wand2 className="h-4 w-4" aria-hidden="true" /> Generate Article</>}
                  </button>
                  <p className="text-xs text-ink-400">This calls the AI model via a secure edge function. Generation may take 10-30 seconds.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual editor (always rendered; hidden when AI tab is active) */}
        <div className={activeTab === 'ai' ? 'hidden' : ''}>
        {error && <div className="mb-6 flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700 sm:hidden" role="alert"><AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />{error}</div>}
        {success && <div className="mb-6 flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700 sm:hidden"><CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />Post saved successfully.</div>}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-800" htmlFor="post-title">Title</label>
              <input id="post-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter post title…" className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3.5 text-lg font-medium text-ink-950 placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 flex items-center justify-between text-sm font-semibold text-ink-800">URL slug
                <label className="flex items-center gap-1.5 text-xs font-normal text-ink-500"><input type="checkbox" checked={autoSlug} onChange={(e) => setAutoSlug(e.target.checked)} className="accent-brand-600" /> Auto-generate from title</label>
              </label>
              <div className="flex items-center rounded-2xl border border-ink-200 bg-white px-4">
                <span className="text-sm text-ink-400">/blog/</span>
                <input type="text" value={autoSlug ? finalSlug : customSlug} onChange={(e) => setCustomSlug(e.target.value)} disabled={autoSlug} readOnly={autoSlug} placeholder="auto-generated-slug" className="w-full bg-transparent px-1 py-3 text-sm text-ink-950 placeholder:text-ink-400 focus:outline-none disabled:cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-800" htmlFor="post-excerpt">Excerpt</label>
              <textarea id="post-excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary shown on blog cards and search results…" rows={3} className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-800">Content</label>
              <RichTextEditor value={body} onChange={setBody} />
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-semibold text-ink-800">FAQs (optional)</label>
                <button type="button" onClick={addFaq} className="btn-ghost text-sm"><Plus className="h-4 w-4" aria-hidden="true" /> Add FAQ</button>
              </div>
              {faqs.length === 0 ? (
                <p className="rounded-xl border border-dashed border-ink-200 px-4 py-6 text-center text-sm text-ink-400">No FAQs added. Click "Add FAQ" to create question-answer pairs for structured data.</p>
              ) : (
                <div className="space-y-3">
                  {faqs.map((f, i) => (
                    <div key={i} className="rounded-2xl border border-ink-100 bg-ink-50/50 p-4">
                      <div className="flex items-start gap-2">
                        <input type="text" value={f.q} onChange={(e) => updateFaq(i, 'q', e.target.value)} placeholder="Question" className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-950 focus:border-brand-400 focus:outline-none" />
                        <button type="button" onClick={() => removeFaq(i)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-500 transition hover:bg-error-50 hover:text-error-600" aria-label="Remove FAQ"><X className="h-4 w-4" aria-hidden="true" /></button>
                      </div>
                      <textarea value={f.a} onChange={(e) => updateFaq(i, 'a', e.target.value)} placeholder="Answer" rows={2} className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 focus:border-brand-400 focus:outline-none" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-ink-950">Featured image</h3>
              {cover ? (
                <div className="relative mt-3 overflow-hidden rounded-xl">
                  <img src={cover} alt="Cover preview" width={400} height={250} className="aspect-[16/10] w-full object-cover" />
                  <button type="button" onClick={() => setCover('')} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ink-950/80 text-white transition hover:bg-error-600" aria-label="Remove image"><X className="h-4 w-4" aria-hidden="true" /></button>
                </div>
              ) : (
                <div className="mt-3 rounded-xl border-2 border-dashed border-ink-200 px-4 py-8 text-center"><Upload className="mx-auto h-6 w-6 text-ink-400" aria-hidden="true" /><p className="mt-2 text-xs text-ink-500">Upload an image or paste a URL below</p></div>
              )}
              <label className="btn-ghost mt-3 w-full cursor-pointer text-sm"><Upload className="h-4 w-4" aria-hidden="true" /> {uploading ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
              <input type="url" value={cover.startsWith('http') ? cover : ''} onChange={(e) => setCover(e.target.value)} placeholder="…or paste image URL" className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" />
            </div>
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-950"><Video className="h-4 w-4 text-brand-600" aria-hidden="true" /> YouTube video</h3>
              <input type="url" value={youtubeUrl} onPaste={handleYoutubePaste} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="Paste YouTube URL…" className="mt-3 w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none" />
              {youtubeId && (
                <div className="mt-3 overflow-hidden rounded-xl">
                  <YouTubeEmbed videoId={youtubeId} title="Video preview" />
                  <p className="mt-1.5 text-xs text-success-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Video ID: {youtubeId}</p>
                </div>
              )}
              {!youtubeId && youtubeUrl && <p className="mt-2 text-xs text-error-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" aria-hidden="true" /> Could not extract a valid YouTube video ID.</p>}
            </div>
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-ink-950">Category</h3>
              <label htmlFor="post-category" className="sr-only">Category</label>
              <select id="post-category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-3 w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none">
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-ink-950">Tags</h3>
              <div className="mt-3 flex gap-2">
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} placeholder="Add a tag…" className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" />
                <button type="button" onClick={addTag} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-700 transition hover:bg-ink-200" aria-label="Add tag"><Plus className="h-4 w-4" aria-hidden="true" /></button>
              </div>
              {tags.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{tags.map((t) => <span key={t} className="chip bg-ink-100 text-ink-700">#{t}<button type="button" onClick={() => removeTag(t)} className="ml-1 text-ink-400 hover:text-error-600" aria-label={`Remove tag ${t}`}><X className="h-3 w-3" aria-hidden="true" /></button></span>)}</div>}
            </div>
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-950"><SearchIcon className="h-4 w-4 text-ink-500" aria-hidden="true" /> SEO settings</h3>
              <label className="mt-3 block"><span className="mb-1 block text-xs font-medium text-ink-600">SEO title (optional)</span><input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={title || 'Custom SEO title…'} maxLength={60} className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" /><span className="mt-1 block text-right text-xs text-ink-400">{seoTitle.length}/60</span></label>
              <label className="mt-2 block"><span className="mb-1 block text-xs font-medium text-ink-600">Meta description (optional)</span><textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder={excerpt || 'Custom meta description…'} rows={3} maxLength={160} className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" /><span className="mt-1 block text-right text-xs text-ink-400">{seoDescription.length}/160</span></label>
              <p className="mt-2 text-xs text-ink-400">If left blank, the post title and excerpt are used automatically.</p>
            </div>
            {isEdit && <div className="card border-error-200 p-5"><h3 className="text-sm font-semibold text-error-700">Danger zone</h3><button type="button" onClick={handleDelete} className="mt-3 w-full rounded-xl border border-error-200 bg-error-50 px-4 py-2.5 text-sm font-medium text-error-700 transition hover:bg-error-100"><Trash2 className="mr-1.5 inline h-4 w-4" aria-hidden="true" /> Delete post permanently</button></div>}
          </aside>
        </div>
        </div>
      </div>
    </>
  );
}
