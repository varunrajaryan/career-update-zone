/*
# Add important_links JSONB column to blog_posts

## Purpose
Stores an optional, flexible array of "Important Links" (external URLs or uploaded files)
for each blog post — primarily for recruitment/job notifications but usable on any post.

## Backward compatibility
- This is an ADDITIVE migration only. No existing columns are modified, renamed, or dropped.
- The column is nullable with a default of NULL. All existing posts remain unchanged.
- No migration of old posts is required — posts without this column populated simply have NULL.
- The frontend treats NULL or an empty array as "no important links" and renders nothing.

## New columns
- `blog_posts.important_links` (jsonb, nullable, default NULL)
  Each element shape: { title: string, type: 'url'|'file', url: string, icon?: string }
  - title: display label (e.g. "Apply Online")
  - type: 'url' for external links, 'file' for uploaded documents/images
  - url: the external URL or the Supabase Storage public URL for uploaded files
  - icon: optional icon key for frontend rendering

## Security
- No RLS policy changes. The blog_posts table already has RLS enabled with
  admin-scoped write policies and public read for published posts.
- Uploaded files go into the existing 'post-images' storage bucket, which already has
  public-read and authenticated-upload policies.
*/
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS important_links jsonb DEFAULT NULL;
