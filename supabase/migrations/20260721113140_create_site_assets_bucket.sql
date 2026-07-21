/*
# Create site-assets storage bucket + policies

1. Purpose
   A dedicated storage bucket for admin-uploaded brand assets: logo, favicon,
   Open Graph image, and Twitter card image used across the site.

2. New Bucket
   - `site-assets` (public read, authenticated admin write/update/delete)

3. Security
   - Public SELECT so the logo / OG / Twitter images load for all visitors.
   - INSERT/UPDATE/DELETE restricted to authenticated users (admin gate is
     enforced by the admin-only route guard in the frontend).
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_site_assets" ON storage.objects;
CREATE POLICY "public_read_site_assets" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "admin_upload_site_assets" ON storage.objects;
CREATE POLICY "admin_upload_site_assets" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "admin_update_site_assets" ON storage.objects;
CREATE POLICY "admin_update_site_assets" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets') WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "admin_delete_site_assets" ON storage.objects;
CREATE POLICY "admin_delete_site_assets" ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets');
