import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_EMAIL = "varunrajaryan@gmail.com";

interface GenerateBody {
  sourceUrl: string;
  category: string;
  categoryName?: string;
  cover?: string | null;
  youtubeId?: string | null;
}

interface ArticlePayload {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  faqs: { q: string; a: string }[];
}

function jsonResponse(status: number, data: object) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Strip HTML to readable plain text, preserving sentence/paragraph structure.
function htmlToText(html: string): string {
  let s = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  s = s.replace(/<\/(p|div|section|article|h[1-6]|li|br|tr)>/gi, "\n");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<li[^>]*>/gi, "\n- ");
  s = s.replace(/<[^>]+>/g, " ");
  s = s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  s = s.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
  return s.replace(/\n +/g, "\n").trim();
}

function extractMainText(html: string): string {
  // Prefer <article> / <main> / [role="main"] if present, else whole body.
  const grab = (re: RegExp): string => {
    const m = html.match(re);
    return m ? m[1] : "";
  };
  const article =
    grab(/<article[\s\S]*?<\/article>/i) ||
    grab(/<main[\s\S]*?<\/main>/i) ||
    grab(/<div[^>]*role=["']main["'][\s\S]*?<\/div>/i) ||
    grab(/<body[\s\S]*?<\/body>/i) ||
    html;
  return htmlToText(article).slice(0, 8000);
}

const SYSTEM_PROMPT = `You are the content engine for Career Update Zone, an Indian career and jobs news site.
Your job: given the extracted text from a source webpage and a target category, write an ORIGINAL, SEO-friendly article in the Career Update Zone house style.

Rules:
- NEVER copy the source text. Rewrite everything in your own words. Paraphrase facts, do not reproduce sentences.
- Write in clear, professional Indian English. Informative and helpful, not promotional.
- Structure: a short intro, 3-5 H2 sections, a key takeaways or summary list, and a brief conclusion.
- Use clean HTML only: <h2>, <p>, <ul><li>...</li></ul>, <strong>, <em>. No h1, no inline styles, no scripts, no markdown.
- Keep it 500-900 words.
- Pick a slug that is lowercase, hyphenated, no stopwords, no dates.
- 5-8 lowercase tags relevant to the topic and the category.
- 2-4 FAQ pairs that a job seeker might actually ask, with concise answers.
- SEO title <= 60 chars, SEO description <= 160 chars, both original (not copied).

Return ONLY valid JSON with exactly these fields:
{
  "title": string,
  "slug": string,
  "excerpt": string,
  "body": string,            // HTML content
  "seoTitle": string,
  "seoDescription": string,
  "tags": string[],
  "faqs": [{ "q": string, "a": string }]
}`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Auth: require a valid user JWT, and require the admin email.
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return jsonResponse(401, { error: "Missing auth token" });
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return jsonResponse(401, { error: "Invalid or expired session" });
    }
    if (userData.user.email !== ADMIN_EMAIL) {
      return jsonResponse(403, { error: "Not authorized" });
    }

    // Load AI settings (service role bypasses RLS).
    const { data: settings, error: settingsErr } = await supabaseAdmin
      .from("ai_settings")
      .select("ai_api_key, ai_model")
      .eq("id", 1)
      .maybeSingle();
    if (settingsErr) {
      return jsonResponse(500, { error: "Failed to read AI settings" });
    }
    const apiKey = settings?.ai_api_key;
    const model = settings?.ai_model || "gpt-4o-mini";
    if (!apiKey) {
      return jsonResponse(400, {
        error: "AI is not configured. Please add an API key in Admin Settings.",
      });
    }

    let body: GenerateBody;
    try {
      body = await req.json();
    } catch {
      return jsonResponse(400, { error: "Invalid JSON body" });
    }
    const { sourceUrl, category, categoryName, cover, youtubeId } = body;
    if (!sourceUrl || !/^https?:\/\//i.test(sourceUrl)) {
      return jsonResponse(400, { error: "A valid source URL is required." });
    }

    // Fetch the source page.
    const fetchRes = await fetch(sourceUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CareerUpdateZoneBot/1.0; +https://careerupdatezone.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!fetchRes.ok) {
      return jsonResponse(502, {
        error: `Could not fetch source page (HTTP ${fetchRes.status}).`,
      });
    }
    const html = await fetchRes.text();
    const sourceText = extractMainText(html);
    if (sourceText.replace(/\s/g, "").length < 120) {
      return jsonResponse(422, {
        error: "Could not extract enough readable content from that URL.",
      });
    }

    const userPrompt = `Target category: ${categoryName || category}
Source text (extracted, may be noisy):
"""
${sourceText}
"""

Write a new original Career Update Zone article for the "${categoryName || category}" category based on the topic of the source. Return only the JSON object.`;

    const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!openAiRes.ok) {
      const errText = await openAiRes.text();
      return jsonResponse(502, {
        error: `AI provider error (${openAiRes.status}): ${errText.slice(0, 400)}`,
      });
    }

    const openAiData = await openAiRes.json();
    const content: string | undefined = openAiData?.choices?.[0]?.message?.content;
    if (!content) {
      return jsonResponse(502, { error: "AI returned an empty response." });
    }

    let article: ArticlePayload;
    try {
      article = JSON.parse(content);
    } catch {
      // Try to extract a JSON object from the text.
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) return jsonResponse(502, { error: "AI did not return valid JSON." });
      article = JSON.parse(match[0]);
    }

    // Basic shape validation.
    const required: (keyof ArticlePayload)[] = ["title", "slug", "excerpt", "body", "seoTitle", "seoDescription", "tags", "faqs"];
    for (const k of required) {
      if (article[k] === undefined || article[k] === null) {
        return jsonResponse(502, { error: `AI response missing field: ${k}` });
      }
    }
    if (!Array.isArray(article.tags) || !Array.isArray(article.faqs)) {
      return jsonResponse(502, { error: "AI response has invalid tags or faqs." });
    }

    // Pass through optional cover + youtube so the frontend can attach them.
    return jsonResponse(200, {
      article,
      cover: cover || null,
      youtubeId: youtubeId || null,
    });
  } catch (err) {
    return jsonResponse(500, {
      error: `Unexpected error: ${(err as Error).message || err}`,
    });
  }
});
