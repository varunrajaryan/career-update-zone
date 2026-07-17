/*
# Storage policies for post-images bucket

## Purpose
Allow authenticated admins to upload featured images. Public can read images.
*/

-- Allow public to read images
DROP POLICY IF EXISTS "public_read_post_images" ON storage.objects;
CREATE POLICY "public_read_post_images" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'post-images');

-- Allow authenticated to upload images
DROP POLICY IF EXISTS "admin_upload_post_images" ON storage.objects;
CREATE POLICY "admin_upload_post_images" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'post-images');

-- Allow authenticated to update/delete images
DROP POLICY IF EXISTS "admin_update_post_images" ON storage.objects;
CREATE POLICY "admin_update_post_images" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'post-images') WITH CHECK (bucket_id = 'post-images');

DROP POLICY IF EXISTS "admin_delete_post_images" ON storage.objects;
CREATE POLICY "admin_delete_post_images" ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'post-images');
