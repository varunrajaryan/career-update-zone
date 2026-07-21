/*
# Create ai_settings table (single-row key/value store for AI Generator)

1. Purpose
   The AI Generator tab in the admin editor calls a Supabase Edge Function
   to generate an article from a source URL. The API key for the AI provider
   must NOT be hardcoded and must NOT live in the browser. Instead it is stored
   here so the edge function (running with the service role key) can read it at
   request time. A future Admin Settings page writes the key.

2. New Tables
   - `ai_settings`
     - `id` (int, primary key, fixed to 1) — singleton row
     - `ai_api_key` (text, nullable) — the provider API key (e.g. OpenAI/Google AI)
     - `ai_model` (text, not null, default 'gpt-4o-mini') — model identifier
     - `updated_at` (timestamptz, default now())

3. Seed
   - Inserts the singleton row with id = 1 and empty key.

4. Security (RLS)
   - RLS enabled on `ai_settings`.
   - SELECT/UPDATE restricted to the authenticated admin user only
     (auth.uid() = the admin's user id, matched by email via a subquery on
     auth.users). INSERT is blocked (row already seeded); DELETE is blocked.
   - The anon role has NO access — the key never leaks to the browser via
     this table. The edge function uses the service role key which bypasses RLS.
*/

CREATE TABLE IF NOT EXISTS ai_settings (
  id int PRIMARY KEY DEFAULT 1,
  ai_api_key text,
  ai_model text NOT NULL DEFAULT 'gpt-4o-mini',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_settings_singleton CHECK (id = 1)
);

INSERT INTO ai_settings (id, ai_api_key, ai_model)
VALUES (1, NULL, 'gpt-4o-mini')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;

-- Admin = the authenticated user whose email matches the configured admin email.
-- We match on auth.users.email so the check survives even if the admin row id changes.
DROP POLICY IF EXISTS "admin_select_ai_settings" ON ai_settings;
CREATE POLICY "admin_select_ai_settings"
ON ai_settings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'varunrajaryan@gmail.com'
  )
);

DROP POLICY IF EXISTS "admin_update_ai_settings" ON ai_settings;
CREATE POLICY "admin_update_ai_settings"
ON ai_settings FOR UPDATE
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
