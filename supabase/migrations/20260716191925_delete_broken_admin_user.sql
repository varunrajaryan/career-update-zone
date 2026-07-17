
-- Fix: The admin user was created via direct INSERT, not through GoTrue's API.
-- This resulted in:
--   1. instance_id = 00000000-0000-0000-0000-000000000000 (doesn't match any real instance)
--   2. No entry in auth.identities (fixed earlier, but the root cause remains)
--   3. auth.instances table is empty
--
-- GoTrue queries auth.instances during login and fails with "Database error querying schema"
-- when the user's instance_id doesn't match any instance row.
--
-- Fix: Delete the manually-created user and all related records.
-- The user will be recreated via GoTrue's admin API (service role) which will
-- set the correct instance_id and create the identity record automatically.

-- First, delete the manually-inserted identity record
DELETE FROM auth.identities WHERE user_id = '37653a6e-1442-4329-851c-62242a453f40';

-- Delete the user (cascade will handle related records)
DELETE FROM auth.users WHERE id = '37653a6e-1442-4329-851c-62242a453f40';
