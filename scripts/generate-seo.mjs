/**
 * Generates sitemap.xml and rss.xml from Supabase blog_posts table.
 * Run before vite build: node scripts/generate-seo.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');

const SITE_URL = 'https://careerupdatezone.com';
const SITE_NAME = 'Career Update Zone';
const SITE_DESC = 'Latest Sarkari Job Notifications, Admit Cards, Results, Answer Keys, Scholarships, Government Schemes, and Exam Preparation Updates.';

// Fetch published posts from Supabase via REST API
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

let posts = [];
if (supabaseUrl && anonKey) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/blog_posts?select=slug,title,excerpt,date,last_updated&status=eq.published&order=date.desc`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });
    if (res.ok) {
      posts = await res.json();
      console.log(`Fetched ${posts.length} published posts from Supabase`);
    } else {
      console.log(`Supabase fetch failed (${res.status}), using static fallback`);
    }
  } catch (e) {
    console.log('Supabase fetch error, using static fallback:', e.message);
  }
}

// Fallback: parse static blog posts
if (posts.length === 0) {
  const src = readFileSync(join(root, 'src/content/blogPosts.ts'), 'utf-8');
  const re = /slug:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?excerpt:\s*'([^']+)'[\s\S]*?date:\s*'([^']+)'[\s\S]*?lastUpdated:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    posts.push({ slug: m[1], title: m[2], excerpt: m[3].replace(/\\'/g, "'"), date: m[4], last_updated: m[5] });
  }
  console.log(`Using ${posts.length} static posts for SEO`);
}

// Static pages
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/latest-jobs', priority: '0.9', changefreq: 'daily' },
  { path: '/blog', priority: '0.9', changefreq: 'daily' },
  { path: '/videos', priority: '0.8', changefreq: 'weekly' },
  { path: '/categories', priority: '0.7', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
];

const categorySlugs = [
  'latest-jobs', 'bihar-jobs', 'admit-card', 'results',
  'answer-key', 'syllabus', 'scholarships', 'government-schemes', 'exam-preparation',
];

// Generate sitemap.xml
const sitemapEntries = [
  ...staticPages.map((p) => `  <url><loc>${SITE_URL}${p.path}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`),
  ...posts.map((p) => `  <url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${p.last_updated}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`),
  ...categorySlugs.map((c) => `  <url><loc>${SITE_URL}/blog?category=${c}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>
`;

// Generate RSS feed
const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const rssItems = posts.map((p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid>${SITE_URL}/blog/${p.slug}</guid>
      <description>${escapeXml(p.excerpt)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`;

mkdirSync(dist, { recursive: true });
writeFileSync(join(root, 'public/sitemap.xml'), sitemap);
writeFileSync(join(root, 'public/rss.xml'), rss);
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
writeFileSync(join(dist, 'rss.xml'), rss);

console.log(`Generated sitemap.xml (${staticPages.length + posts.length + categorySlugs.length} URLs) and rss.xml (${posts.length} articles)`);
