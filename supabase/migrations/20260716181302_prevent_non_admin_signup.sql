/*
# Prevent New User Sign-ups (Server-Side Safety Net)

## Purpose
Since public sign-up cannot be disabled via SQL in this Supabase version,
this trigger blocks any new user creation except for the already-existing
admin account (varunrajaryan@gmail.com). Any attempt to sign up with a
different email will be rejected at the database level.

## How It Works
- A BEFORE INSERT trigger on auth.users checks the new user's email.
- If the email is not varunrajaryan@gmail.com, the trigger raises an exception,
  preventing the row from being inserted.
- The admin account already exists, so this trigger won't affect it.
*/

CREATE OR REPLACE FUNCTION public.prevent_non_admin_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth
AS $$
BEGIN
  IF NEW.email <> 'varunrajaryan@gmail.com' THEN
    RAISE EXCEPTION 'Public sign-up is disabled. Only the administrator account is allowed.'
      USING ERRCODE = '28000';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS block_non_admin_signup ON auth.users;
CREATE TRIGGER block_non_admin_signup
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_non_admin_signup();
