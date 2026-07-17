import { useEffect, useState } from 'react';
import { supabase, type PostRow } from '../lib/supabase';
import { categories } from '../content/categories';
import { SITE_URL } from '../components/Seo';

export function SitemapPage() {
  const [xml, setXml] = useState<string>('');

  useEffect(() => {
    (async () => {
      const staticUrls = [
        { loc: '/', priority: '1.0', changefreq: 'daily' },
        { loc: '/latest-jobs', priority: '0.9', changefreq: 'daily' },
        { loc: '/blog', priority: '0.9', changefreq: 'daily' },
        { loc: '/videos', priority: '0.8', changefreq: 'daily' },
        { loc: '/categories', priority: '0.7', changefreq: 'weekly' },
        { loc: '/about', priority: '0.5', changefreq: 'monthly' },
        { loc: '/contact', priority: '0.5', changefreq: 'monthly' },
        { loc: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
        { loc: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
        { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
      ];

      categories.forEach((cat) => {
        staticUrls.push({ loc: `/blog?category=${cat.slug}`, priority: '0.6', changefreq: 'weekly' });
      });

      const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug, date, last_updated, status')
        .eq('status', 'published')
        .order('date', { ascending: false });

      const postUrls = (posts || []).map((p: Partial<PostRow>) => ({
        loc: `/blog/${p.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: p.last_updated || p.date,
      }));

      const allUrls = [...staticUrls, ...postUrls];

      const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

      setXml(xmlContent);
    })();
  }, []);

  useEffect(() => {
    if (xml) {
      document.title = 'Sitemap';
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', 'XML Sitemap');
      document.documentElement.setAttribute('data-content-type', 'application/xml');
    }
  }, [xml]);

  if (!xml) return null;

  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace', padding: '1rem' }}>{xml}</pre>
  );
}
