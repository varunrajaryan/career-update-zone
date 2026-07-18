import { useMemo } from 'react';
import { Seo, SITE_URL, buildPersonSchema } from '../components/Seo';
import { YouTubeEmbed } from '../components/YouTubeEmbed';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FaqAccordion } from '../components/FaqAccordion';
import { TableOfContents } from '../components/TableOfContents';
import { PrevNextNav } from '../components/PrevNextNav';
import { RelatedPosts } from '../components/RelatedPosts';
import { usePublishedPost, usePublishedPosts } from '../lib/usePosts';
import { categories } from '../content/categories';
import { Icon } from '../components/Icon';
import { Link, useRouter } from '../router';
import { formatDate, extractHeadings, injectHeadingIds } from '../lib/editor-utils';
import { Clock, ArrowLeft, Share2, Video, Tag, Calendar, User, Edit3 } from 'lucide-react';

export function BlogPostPage({ slug }: { slug: string }) {
  const { post, loading, error } = usePublishedPost(slug);
  const { posts } = usePublishedPosts();
  const { navigate } = useRouter();

  const headings = useMemo(() => post ? extractHeadings(post.body) : [], [post]);
  const processedBody = useMemo(() => post ? injectHeadingIds(post.body) : '', [post]);

  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const related = posts.filter((p) => p.slug !== slug && p.category === post?.category).slice(0, 3);

  if (loading) return <div className="container-content py-32 text-center text-ink-500">Loading post…</div>;
  if (error) return <div className="container-content py-32 text-center text-error-600">Error: {error}</div>;
  if (!post) { navigate('/blog', { replace: true }); return null; }

  const cat = categories.find((c) => c.slug === post.category);
  const seoTitle = post.seo_title || post.title;
  const seoDesc = post.seo_description || post.excerpt;

  // Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: seoTitle,
    description: seoDesc,
    image: post.cover,
    datePublished: post.date,
    dateModified: post.last_updated || post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Career Update Zone', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    articleSection: cat?.name || 'Career',
    keywords: (post.tags || []).join(', '),
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  // FAQ schema
  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  // VideoObject schema
  const videoSchema = post.youtube_id ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: post.title,
    description: seoDesc,
    thumbnailUrl: `https://img.youtube.com/vi/${post.youtube_id}/maxresdefault.jpg`,
    uploadDate: post.date,
    embedUrl: `https://www.youtube.com/embed/${post.youtube_id}`,
    contentUrl: `https://www.youtube.com/watch?v=${post.youtube_id}`,
  } : null;

  const personSchema = buildPersonSchema(post.author);
  const pageSchema = [articleSchema, breadcrumbSchema, personSchema, ...(faqSchema ? [faqSchema] : []), ...(videoSchema ? [videoSchema] : [])];

  const prevMeta = prev ? { url: `/blog/${prev.slug}`, title: prev.title } : undefined;
  const nextMeta = next ? { url: `/blog/${next.slug}`, title: next.title } : undefined;

  return (
    <>
      <Seo title={seoTitle} description={seoDesc} canonical={`/blog/${post.slug}`} ogImage={post.cover} ogType="article" keywords={post.tags || []} prev={prevMeta} next={nextMeta} schema={pageSchema} />
      <article>
        <div className="border-b border-ink-100 bg-white">
          <div className="container-content py-6">
            <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: post.title }]} />
          </div>
        </div>
        <div className="container-content py-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              {cat && <Link to={`/blog?category=${cat.slug}`} className="chip bg-brand-50 text-brand-700 mb-4 w-fit"><Icon name={cat.icon} className="h-3.5 w-3.5" aria-hidden="true" /> {cat.name}</Link>}
              <h1 className="font-display text-3xl font-bold text-ink-950 md:text-4xl">{post.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-400">
                <span className="flex items-center gap-1.5"><User className="h-4 w-4" aria-hidden="true" /> {post.author}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" aria-hidden="true" /> {formatDate(post.date)}</span>
                {post.last_updated && post.last_updated !== post.date && <span className="flex items-center gap-1.5"><Edit3 className="h-4 w-4" aria-hidden="true" /> Updated {formatDate(post.last_updated)}</span>}
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden="true" /> {post.read_time} min read</span>
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl">
                <img src={post.cover} alt={post.title} width={1200} height={675} className="aspect-[16/9] w-full object-cover" />
              </div>
              <div className="prose-content mt-8" dangerouslySetInnerHTML={{ __html: processedBody }} />
              {post.youtube_id && (
                <div className="mt-8">
                  <h2 className="font-display text-xl font-bold text-ink-950 mb-3">Related Video</h2>
                  <YouTubeEmbed videoId={post.youtube_id} title={post.title} />
                </div>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {post.tags.map((t) => <span key={t} className="chip bg-ink-100 text-ink-600"><Tag className="h-3 w-3" aria-hidden="true" /> {t}</span>)}
                </div>
              )}
              {post.faqs && post.faqs.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-display text-2xl font-bold text-ink-950 mb-4">Frequently Asked Questions</h2>
                  <FaqAccordion faqs={post.faqs} />
                </div>
              )}
              <PrevNextNav prev={prev} next={next} />
              <RelatedPosts posts={related} />
            </div>
            <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <TableOfContents headings={headings} />
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-ink-950">Share this post</h3>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => { if (navigator.share) navigator.share({ title: post.title, url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }} className="btn-ghost flex-1 text-sm" aria-label="Share this post"><Share2 className="h-4 w-4" aria-hidden="true" /> Share</button>
                  {post.youtube_id && <a href={`https://www.youtube.com/watch?v=${post.youtube_id}`} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 text-sm"><Video className="h-4 w-4" aria-hidden="true" /> Watch</a>}
                </div>
              </div>
              <Link to="/blog" className="card flex items-center gap-3 p-5 transition hover:shadow-md"><ArrowLeft className="h-5 w-5 text-brand-600" aria-hidden="true" /><span className="text-sm font-medium text-ink-700">Back to Blog</span></Link>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
