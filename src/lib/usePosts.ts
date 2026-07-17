import { useEffect, useState } from 'react';
import { supabase, type PostRow } from './supabase';

export function usePublishedPosts() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('status', 'published').order('date', { ascending: false }).then(({ data, error }) => {
      if (!error && data) setPosts(data as PostRow[]);
      setLoading(false);
    });
  }, []);
  return { posts, loading };
}

export function usePublishedPost(slug: string) {
  const [post, setPost] = useState<PostRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle().then(({ data, error }) => {
      if (error) setError(error.message);
      else if (!data) setError('Post not found');
      else setPost(data as PostRow);
      setLoading(false);
    });
  }, [slug]);
  return { post, loading, error };
}
