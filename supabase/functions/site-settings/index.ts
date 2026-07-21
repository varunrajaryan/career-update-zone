import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_EMAIL = "varunrajaryan@gmail.com";

type Section =
  | "general" | "seo" | "analytics" | "ai" | "youtube"
  | "email" | "social" | "ads" | "appearance" | "security";

const SECTIONS: Section[] = [
  "general", "seo", "analytics", "ai", "youtube",
  "email", "social", "ads", "appearance", "security",
];

// Secret fields per section — these are returned to the frontend as a boolean
// `has<Field>` flag and a masked placeholder, NEVER the raw value.
const SECRET_FIELDS: Record<string, string[]> = {
  ai: ["apiKey"],
  youtube: ["apiKey"],
  email: ["password"],
  analytics: [],
  ads: [],
};

// Mask a secret value for display: returns a fixed-length dot string.
function maskSecret(_value: string): string {
  return "••••••••••••";
}

// Replace secret values with a masked placeholder and add has<Field> booleans.
function maskSection(section: Section, data: Record<string, unknown>): Record<string, unknown> {
  const secrets = SECRET_FIELDS[section] || [];
  if (secrets.length === 0) return data;
  const out: Record<string, unknown> = { ...data };
  for (const field of secrets) {
    const raw = out[field];
    if (typeof raw === "string" && raw.length > 0) {
      out[`has${field.charAt(0).toUpperCase()}${field.slice(1)}`] = true;
      out[field] = maskSecret(raw);
    } else {
      out[`has${field.charAt(0).toUpperCase()}${field.slice(1)}`] = false;
      delete out[field];
    }
  }
  return out;
}

// Mask the entire row (all sections).
function maskRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const sec of SECTIONS) {
    const val = row[sec];
    out[sec] = maskSection(sec, (val && typeof val === "object" ? val : {}) as Record<string, unknown>);
  }
  out.updated_at = row.updated_at;
  return out;
}

// Merge incoming section data into stored data, preserving secrets when the
// client sends the masked placeholder (i.e. did not enter a new secret).
function mergeSection(
  section: Section,
  stored: Record<string, unknown>,
  incoming: Record<string, unknown>,
): Record<string, unknown> {
  const secrets = SECRET_FIELDS[section] || [];
  const merged: Record<string, unknown> = { ...stored, ...incoming };
  for (const field of secrets) {
    const newVal = merged[field];
    // If the client sent the masked placeholder (or empty), keep the existing secret.
    if (typeof newVal === "string" && (newVal.includes("••••") || newVal.trim() === "")) {
      if (typeof stored[field] === "string") merged[field] = stored[field];
      else delete merged[field];
    }
  }
  // Remove has<Field> booleans — those are display-only, never stored.
  for (const field of secrets) {
    const cap = field.charAt(0).toUpperCase() + field.slice(1);
    delete merged[`has${cap}`];
  }
  return merged;
}

function jsonResponse(status: number, data: object) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Authenticate every request.
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return jsonResponse(401, { error: "Missing auth token" });
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) return jsonResponse(401, { error: "Invalid or expired session" });
    if (userData.user.email !== ADMIN_EMAIL) return jsonResponse(403, { error: "Not authorized" });

    const url = new URL(req.url);
    const action = url.searchParams.get("action"); // "export" | "import" | "reset"

    // GET — return all settings (masked).
    if (req.method === "GET") {
      const { data, error } = await supabaseAdmin
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) return jsonResponse(500, { error: "Failed to load settings" });
      if (!data) return jsonResponse(404, { error: "Settings row not found" });

      // Export action: return raw secrets (admin-only) for backup/import.
      if (action === "export") {
        return jsonResponse(200, { settings: data });
      }
      return jsonResponse(200, { settings: maskRow(data as Record<string, unknown>) });
    }

    // POST — import full settings (replace all sections).
    if (req.method === "POST" && action === "import") {
      let body: { settings?: Record<string, unknown> };
      try { body = await req.json(); } catch { return jsonResponse(400, { error: "Invalid JSON body" }); }
      const incoming = body.settings;
      if (!incoming || typeof incoming !== "object") return jsonResponse(400, { error: "Missing settings object" });

      const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
      for (const sec of SECTIONS) {
        const val = incoming[sec];
        update[sec] = (val && typeof val === "object" ? val : {}) as Record<string, unknown>;
      }
      const { error } = await supabaseAdmin.from("site_settings").update(update).eq("id", 1);
      if (error) return jsonResponse(500, { error: "Import failed: " + error.message });
      return jsonResponse(200, { ok: true });
    }

    // POST with action=reset — reset one or more sections to empty objects.
    if (req.method === "POST" && action === "reset") {
      let body: { sections?: Section[] };
      try { body = await req.json(); } catch { return jsonResponse(400, { error: "Invalid JSON body" }); }
      const targets = (body.sections || []).filter((s) => SECTIONS.includes(s));
      if (targets.length === 0) return jsonResponse(400, { error: "No valid sections to reset" });
      const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
      for (const sec of targets) update[sec] = {};
      const { error } = await supabaseAdmin.from("site_settings").update(update).eq("id", 1);
      if (error) return jsonResponse(500, { error: "Reset failed: " + error.message });
      return jsonResponse(200, { ok: true });
    }

    // PUT — save one or more sections, preserving secrets the client didn't replace.
    if (req.method === "PUT") {
      let body: { sections?: Record<string, Record<string, unknown>> };
      try { body = await req.json(); } catch { return jsonResponse(400, { error: "Invalid JSON body" }); }
      const incoming = body.sections;
      if (!incoming || typeof incoming !== "object") return jsonResponse(400, { error: "Missing sections object" });

      // Load current row (service role bypasses RLS).
      const { data: current, error: loadErr } = await supabaseAdmin
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (loadErr || !current) return jsonResponse(500, { error: "Failed to load current settings" });

      const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
      for (const sec of SECTIONS) {
        if (!(sec in incoming)) continue;
        const storedSection = (current[sec] && typeof current[sec] === "object"
          ? current[sec] : {}) as Record<string, unknown>;
        update[sec] = mergeSection(sec, storedSection, incoming[sec]);
      }

      const { error: updateErr } = await supabaseAdmin.from("site_settings").update(update).eq("id", 1);
      if (updateErr) return jsonResponse(500, { error: "Save failed: " + updateErr.message });

      // Return the masked updated row so the frontend can refresh state.
      const { data: updated, error: refErr } = await supabaseAdmin
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (refErr || !updated) return jsonResponse(200, { ok: true });
      return jsonResponse(200, { settings: maskRow(updated as Record<string, unknown>) });
    }

    return jsonResponse(405, { error: "Method not allowed" });
  } catch (err) {
    return jsonResponse(500, { error: `Unexpected error: ${(err as Error).message || err}` });
  }
});
