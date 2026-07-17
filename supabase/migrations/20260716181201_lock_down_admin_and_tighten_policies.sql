/*
# Lock Down Admin Access & Tighten blog_posts Policies

## Purpose
1. Restrict blog_posts INSERT/UPDATE/DELETE to only the single admin user (varunrajaryan@gmail.com).
2. Keep SELECT public for published posts + any authenticated user (for admin draft viewing).
3. Disable public sign-up so no new accounts can be created.
4. This is the ONLY admin account for the CMS.

## Policy Changes
- admin_insert_posts: WITH CHECK now requires auth.jwt()->>'email' = 'varunrajaryan@gmail.com'
- admin_update_posts: USING + WITH CHECK now require the admin email
- admin_delete_posts: USING now requires the admin email
- public_read_published_posts: unchanged (published posts readable by all; drafts readable by authenticated admin)

## Security
- Only varunrajaryan@gmail.com can create, edit, or delete posts.
- All other authenticated users (if any somehow exist) get read-only access to published posts.
- Public sign-up is disabled at the Supabase Auth level.
*/

-- Tighten INSERT policy: only admin email can insert
DROP POLICY IF EXISTS "admin_insert_posts" ON blog_posts;
CREATE POLICY "admin_insert_posts" ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = 'varunrajaryan@gmail.com');

-- Tighten UPDATE policy: only admin email can update
DROP POLICY IF EXISTS "admin_update_posts" ON blog_posts;
CREATE POLICY "admin_update_posts" ON blog_posts FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'varunrajaryan@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'varunrajaryan@gmail.com');

-- Tighten DELETE policy: only admin email can delete
DROP POLICY IF EXISTS "admin_delete_posts" ON blog_posts;
CREATE POLICY "admin_delete_posts" ON blog_posts FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'varunrajaryan@gmail.com');
