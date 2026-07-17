import { useEffect, useState } from 'react';
import { supabase, type ChannelStats } from './supabase';
export function useYouTubeChannel() {
  const [data, setData] = useState<ChannelStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    supabase.functions.invoke('youtube').then(({ data, error }) => {
      if (error) setError(error.message);
      else if (data) setData(data as ChannelStats);
      else setError('No data returned from YouTube service');
      setLoading(false);
    }).catch((err) => { setError(err.message || 'Failed to fetch YouTube data'); setLoading(false); });
  }, []);
  return { data, loading, error };
}
