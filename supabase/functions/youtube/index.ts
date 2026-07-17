import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CHANNEL_ID = "UCEgXAEeOq1ucTiQwtgrouSA";
const CACHE_TTL_MINUTES = 30;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  function jsonResponse(status: number, data: object) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": data instanceof Object && "cached" in data ? (data.cached ? "HIT" : "MISS") : "BYPASS" },
    });
  }

  try {
    const { data: cached } = await supabaseAdmin
      .from("youtube_cache")
      .select("data, created_at")
      .eq("id", "latest")
      .maybeSingle();

    if (cached) {
      const cacheAge = Date.now() - new Date(cached.created_at).getTime();
      const cacheAgeMinutes = cacheAge / 60000;
      if (cacheAgeMinutes < CACHE_TTL_MINUTES) {
        const cachedData = cached.data as object;
        return jsonResponse(200, { ...cachedData, cached: true, cachedAt: cached.created_at });
      }
    }

    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    if (!apiKey) return jsonResponse(500, { error: "YOUTUBE_API_KEY secret is not configured" });

    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet,contentDetails&id=${CHANNEL_ID}&key=${apiKey}`;
    const channelRes = await fetch(channelUrl);
    if (!channelRes.ok) {
      const errorText = await channelRes.text();
      return jsonResponse(channelRes.status, { error: `YouTube channels API error (${channelRes.status}): ${errorText.slice(0, 500)}` });
    }

    const channelData = await channelRes.json();
    if (!channelData.items || channelData.items.length === 0) {
      return jsonResponse(404, { error: `Channel not found for ID: ${CHANNEL_ID}` });
    }

    const channel = channelData.items[0];
    const stats = channel.statistics;
    const snippet = channel.snippet;
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

    const channelInfo = {
      channelId: CHANNEL_ID,
      title: snippet.title,
      description: snippet.description,
      thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || "",
      country: snippet.country || "IN",
      customUrl: snippet.customUrl || "@careerupdatezonee",
      subscriberCount: stats.subscriberCount || "0",
      viewCount: stats.viewCount || "0",
      videoCount: stats.videoCount || "0",
      hiddenSubscriberCount: stats.hiddenSubscriberCount || false,
    };

    const videos: Array<{ id: string; title: string; thumbnail: string; publishedAt: string; description: string }> = [];

    if (uploadsPlaylistId) {
      const videosUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=12&key=${apiKey}`;
      const videosRes = await fetch(videosUrl);
      if (videosRes.ok) {
        const videosData = await videosRes.json();
        if (videosData.items) {
          for (const item of videosData.items) {
            const videoId = item.snippet?.resourceId?.videoId;
            if (videoId) {
              videos.push({
                id: videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "",
                publishedAt: item.snippet.publishedAt,
                description: item.snippet.description || "",
              });
            }
          }
        }
      }
    }

    const result = { ...channelInfo, videos, fetchedAt: new Date().toISOString(), cached: false };

    await supabaseAdmin.from("youtube_cache").upsert({
      id: "latest",
      data: result,
      created_at: new Date().toISOString(),
    });

    return jsonResponse(200, result);
  } catch (err) {
    return jsonResponse(500, { error: `Unexpected error: ${err.message || err}` });
  }
});
