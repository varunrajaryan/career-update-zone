-- Enable Supabase Realtime on blog_posts so the breaking news ticker
-- auto-updates when articles are published, updated, or removed.
ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts;
