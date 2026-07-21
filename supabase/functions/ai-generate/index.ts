import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_EMAIL = "varunrajaryan@gmail.com";

type Provider = "openai" | "gemini";

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

interface AiSettingsRow {
  ai_api_key: string | null;
  ai_model: string;
  ai_provider: Provider;
}

async function loadAiSettings(supabaseAdmin: ReturnType<typeof createClient>): Promise<{ apiKey: string; model: string; provider: Provider }> {
  const { data, error } = await supabaseAdmin
    .from("ai_settings")
    .select("ai_api_key, ai_model, ai_provider")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error("Failed to read AI settings");
  const row = (data || {}) as AiSettingsRow | null;
  const apiKey = row?.ai_api_key || undefined;
  const provider: Provider = row?.ai_provider === "gemini" ? "gemini" : "openai";
  const model = row?.ai_model || (provider === "gemini" ? "gemini-1.5-flash" : "gpt-4o-mini");
  if (!apiKey) throw new Error("AI is not configured. Please add an API key in Admin Settings.");
  return { apiKey, model, provider };
}

// Call OpenAI Chat Completions and return the content string.
async function callOpenAi(apiKey: string, model: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AI provider error (${res.status}): ${errText.slice(0, 400)}`);
  }
  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI returned an empty response.");
  return content;
}

// Call Google Gemini generateContent and return the text content string.
async function callGemini(apiKey: string, model: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [
        { role: "user", parts: [{ text: userPrompt }] },
      ],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AI provider error (${res.status}): ${errText.slice(0, 400)}`);
  }
  const data = await res.json();
  const content: string | undefined = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).filter(Boolean).join("\n");
  if (!content) throw new Error("AI returned an empty response.");
  return content;
}

function parseArticle(content: string): ArticlePayload {
  let article: ArticlePayload;
  try {
    article = JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI did not return valid JSON.");
    article = JSON.parse(match[0]);
  }
  const required: (keyof ArticlePayload)[] = ["title", "slug", "excerpt", "body", "seoTitle", "seoDescription", "tags", "faqs"];
  for (const k of required) {
    if (article[k] === undefined || article[k] === null) {
      throw new Error(`AI response missing field: ${k}`);
    }
  }
  if (!Array.isArray(article.tags) || !Array.isArray(article.faqs)) {
    throw new Error("AI response has invalid tags or faqs.");
  }
  return article;
}

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

    let ai: { apiKey: string; model: string; provider: Provider };
    try {
      ai = await loadAiSettings(supabaseAdmin);
    } catch (err) {
      return jsonResponse(400, { error: (err as Error).message });
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

    let content: string;
    try {
      content = ai.provider === "gemini"
        ? await callGemini(ai.apiKey, ai.model, SYSTEM_PROMPT, userPrompt)
        : await callOpenAi(ai.apiKey, ai.model, SYSTEM_PROMPT, userPrompt);
    } catch (err) {
      return jsonResponse(502, { error: (err as Error).message });
    }

    let article: ArticlePayload;
    try {
      article = parseArticle(content);
    } catch (err) {
      return jsonResponse(502, { error: (err as Error).message });
    }

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
