
-- Fix: Create the missing auth.identities record for the admin user.
-- GoTrue requires an identity row for password-based login.
-- Without it, login fails with "Database error querying schema".

INSERT INTO auth.identities (provider_id, user_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
SELECT
  u.email,
  u.id,
  'email',
  jsonb_build_object(
    'sub', u.id::text,
    'email', u.email,
    'email_verified', true
  ),
  now(),
  u.created_at,
  now()
FROM auth.users u
WHERE u.email = 'varunrajaryan@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM auth.identities i WHERE i.user_id = u.id
);
