/*
# Create blog_posts table for CMS

## Purpose
Enables an admin dashboard where the site owner can create, edit, delete, and publish/unpublish blog posts.
Only authenticated admins can write. Public visitors can read only published posts.

## New Tables
- `blog_posts`
  - `id` (uuid, primary key)
  - `slug` (text, unique, not null) — URL-friendly identifier
  - `title` (text, not null)
  - `excerpt` (text, not null) — short summary for cards and meta description
  - `body` (text, not null) — HTML content of the article
  - `cover` (text, not null) — featured image URL
  - `youtube_id` (text, not null) — YouTube video ID for embedded video
  - `category` (text, not null) — category slug
  - `tags` (text[], default '{}') — array of tag strings
  - `author` (text, not null, default 'Career Update Zone')
  - `status` (text, not null, default 'draft') — 'draft' or 'published'
  - `read_time` (integer, default 5) — estimated reading time in minutes
  - `date` (date, not null, default current_date) — publish date
  - `last_updated` (date, not null, default current_date) — last modification date
  - `seo_title` (text) — optional custom SEO title
  - `seo_description` (text) — optional custom meta description
  - `faqs` (jsonb, default '[]') — array of {q, a} FAQ pairs
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

## Indexes
- `idx_blog_posts_slug` on `slug` — fast lookups by slug
- `idx_blog_posts_status` on `status` — filter published vs draft
- `idx_blog_posts_category` on `category` — filter by category
- `idx_blog_posts_date` on `date DESC` — latest-first ordering

## Security (RLS)
- Enable RLS on `blog_posts`.
- SELECT: `TO anon, authenticated` — anyone can read published posts; authenticated admins can read all.
- INSERT/UPDATE/DELETE: `TO authenticated` — only logged-in admins can modify posts.

## Trigger
- `update_blog_posts_updated_at` — auto-updates `updated_at` on row update.
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  body text NOT NULL,
  cover text NOT NULL,
  youtube_id text NOT NULL,
  category text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  author text NOT NULL DEFAULT 'Career Update Zone',
  status text NOT NULL DEFAULT 'draft',
  read_time integer NOT NULL DEFAULT 5,
  date date NOT NULL DEFAULT CURRENT_DATE,
  last_updated date NOT NULL DEFAULT CURRENT_DATE,
  seo_title text,
  seo_description text,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts (status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts (category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts (date DESC);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- SELECT: public can read published, authenticated can read everything
DROP POLICY IF EXISTS "public_read_published_posts" ON blog_posts;
CREATE POLICY "public_read_published_posts" ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR auth.uid() IS NOT NULL);

-- INSERT: only authenticated admins
DROP POLICY IF EXISTS "admin_insert_posts" ON blog_posts;
CREATE POLICY "admin_insert_posts" ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- UPDATE: only authenticated admins
DROP POLICY IF EXISTS "admin_update_posts" ON blog_posts;
CREATE POLICY "admin_update_posts" ON blog_posts FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- DELETE: only authenticated admins
DROP POLICY IF EXISTS "admin_delete_posts" ON blog_posts;
CREATE POLICY "admin_delete_posts" ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_updated = CURRENT_DATE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
