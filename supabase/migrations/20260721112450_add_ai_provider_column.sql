/*
# Add provider column to ai_settings (Google Gemini support)

1. Purpose
   The AI Generator currently only supports OpenAI. This migration adds a
   `ai_provider` column so the admin can pick between "openai" and "gemini",
   and the ai-generate edge function can branch to the correct API.

2. Modified Tables
   - `ai_settings`
     - ADD COLUMN `ai_provider` text NOT NULL DEFAULT 'openai'
       (values: 'openai' | 'gemini')
     - Add CHECK constraint to restrict to known providers.

3. Data Migration
   - Existing singleton row (id = 1) keeps its key and model; provider defaults
     to 'openai' so nothing changes for current users.

4. Security
   - No RLS changes — existing admin-only SELECT/UPDATE policies already cover
     the new column automatically (column-level privileges are not in use).
*/

ALTER TABLE ai_settings
  ADD COLUMN IF NOT EXISTS ai_provider text NOT NULL DEFAULT 'openai';

ALTER TABLE ai_settings
  DROP CONSTRAINT IF EXISTS ai_settings_provider_check;

ALTER TABLE ai_settings
  ADD CONSTRAINT ai_settings_provider_check
  CHECK (ai_provider IN ('openai', 'gemini'));
