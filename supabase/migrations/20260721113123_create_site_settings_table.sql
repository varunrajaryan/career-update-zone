/*
# Create site_settings singleton table (Admin Settings)

1. Purpose
   Stores all configurable website settings for the Admin Settings page, split
   across 10 JSONB columns — one per section — so each section is independent
   and easy to query/update. A single singleton row (id = 1) holds every value.

2. New Table
   - `site_settings`
     - `id` int PRIMARY KEY DEFAULT 1, CHECK (id = 1) — singleton
     - `general`      jsonb NOT NULL DEFAULT '{}'::jsonb
     - `seo`          jsonb NOT NULL DEFAULT '{}'::jsonb
     - `analytics`    jsonb NOT NULL DEFAULT '{}'::jsonb
     - `ai`           jsonb NOT NULL DEFAULT '{}'::jsonb
     - `youtube`      jsonb NOT NULL DEFAULT '{}'::jsonb
     - `email`        jsonb NOT NULL DEFAULT '{}'::jsonb
     - `social`       jsonb NOT NULL DEFAULT '{}'::jsonb
     - `ads`          jsonb NOT NULL DEFAULT '{}'::jsonb
     - `appearance`   jsonb NOT NULL DEFAULT '{}'::jsonb
     - `security`     jsonb NOT NULL DEFAULT '{}'::jsonb
     - `updated_at`   timestamptz NOT NULL DEFAULT now()

3. Seed
   - Inserts the singleton row (id = 1). The `ai` column is seeded from the
     existing ai_settings row (key, model, provider) so current AI config is
     preserved. Other columns start empty and are populated by the admin UI.

4. Security (RLS)
   - RLS enabled on `site_settings`.
   - SELECT/UPDATE restricted to the authenticated admin user
     (auth.uid() matches the user whose email is the configured admin email).
   - INSERT and DELETE are blocked — the singleton row is pre-seeded and must
     never be removed or duplicated.
   - The anon role has NO access. Secrets (API keys, SMTP password) live in
     JSONB and are never exposed to the browser via this table directly; the
     frontend reads/writes through the `site-settings` edge function, which
     strips secrets before returning data to the client.
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  general jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  analytics jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai jsonb NOT NULL DEFAULT '{}'::jsonb,
  youtube jsonb NOT NULL DEFAULT '{}'::jsonb,
  email jsonb NOT NULL DEFAULT '{}'::jsonb,
  social jsonb NOT NULL DEFAULT '{}'::jsonb,
  ads jsonb NOT NULL DEFAULT '{}'::jsonb,
  appearance jsonb NOT NULL DEFAULT '{}'::jsonb,
  security jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);

-- Seed the singleton row. Migrate existing AI settings (key + model + provider)
-- from ai_settings into the `ai` JSONB column so the current AI Generator
-- config is preserved and the admin can manage it from the new Settings page.
INSERT INTO site_settings (id, ai)
VALUES (
  1,
  COALESCE(
    (SELECT jsonb_build_object(
      'provider', COALESCE(ai_settings.ai_provider, 'openai'),
      'model', ai_settings.ai_model,
      'apiKey', ai_settings.ai_api_key
    ) FROM ai_settings WHERE ai_settings.id = 1),
    '{"provider":"openai","model":"gpt-4o-mini"}'::jsonb
  )
)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Admin = authenticated user whose email matches the configured admin email.
DROP POLICY IF EXISTS "admin_select_site_settings" ON site_settings;
CREATE POLICY "admin_select_site_settings"
ON site_settings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'varunrajaryan@gmail.com'
  )
);

DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings"
ON site_settings FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'varunrajaryan@gmail.com'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'varunrajaryan@gmail.com'
  )
);
