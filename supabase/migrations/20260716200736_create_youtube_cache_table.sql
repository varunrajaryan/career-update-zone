CREATE TABLE IF NOT EXISTS youtube_cache (
  id text PRIMARY KEY DEFAULT 'latest',
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE youtube_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_youtube_cache" ON youtube_cache FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_youtube_cache" ON youtube_cache FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "update_youtube_cache" ON youtube_cache FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_youtube_cache" ON youtube_cache FOR DELETE
  TO anon, authenticated USING (true);
