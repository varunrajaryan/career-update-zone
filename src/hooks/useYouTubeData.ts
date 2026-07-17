import { useEffect, useState } from 'react';

export type ChannelStats = {
  name: string;
  description: string;
  profilePicture: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  channelId: string;
};

export type VideoItem = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
};

type YouTubeData = {
  channel: ChannelStats;
  videos: VideoItem[];
};

type State =
  | { status: 'loading' }
  | { status: 'success'; data: YouTubeData }
  | { status: 'error'; message: string }
  | { status: 'idle' };

const CACHE_KEY = 'cuz-youtube-cache';
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

function readCache(): YouTubeData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; data: YouTubeData };
    if (Date.now() - parsed.ts > CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(data: YouTubeData) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // ignore quota errors
  }
}

export function useYouTubeData(handle = '@CareerUpdateZonee', max = 12) {
  const [state, setState] = useState<State>(() => {
    const cached = readCache();
    return cached ? { status: 'success', data: cached } : { status: 'loading' };
  });

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setState({ status: 'success', data: cached });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/youtube?handle=${encodeURIComponent(handle)}&max=${max}`;
    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };

    fetch(fnUrl, { headers })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Request failed (${res.status})`);
        }
        const data = (await res.json()) as YouTubeData;
        if (!data.channel || !data.videos) {
          throw new Error('Unexpected response shape from YouTube proxy.');
        }
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        writeCache(data);
        setState({ status: 'success', data });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ status: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
      });

    return () => {
      cancelled = true;
    };
  }, [handle, max]);

  return state;
}

/** Format a raw count like "1234567" into "1.2M" / "320K" etc. */
export function formatCount(value: string): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}
