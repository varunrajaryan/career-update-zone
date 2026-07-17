
-- Restore the original trigger function (was neutralized for debugging)
CREATE OR REPLACE FUNCTION public.prevent_non_admin_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'auth'
AS $$
BEGIN
  IF NEW.email <> 'varunrajaryan@gmail.com' THEN
    RAISE EXCEPTION 'Public sign-up is disabled. Only the administrator account is allowed.'
      USING ERRCODE = '28000';
  END IF;
  RETURN NEW;
END;
$$;
