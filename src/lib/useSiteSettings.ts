import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';

export type AiProvider = 'openai' | 'gemini' | 'claude' | 'openrouter';

export type SectionName =
  | 'general' | 'seo' | 'analytics' | 'ai' | 'youtube'
  | 'email' | 'social' | 'ads' | 'appearance' | 'security';

export type SettingsSection = Record<string, unknown>;

export type SiteSettings = {
  general: SettingsSection;
  seo: SettingsSection;
  analytics: SettingsSection;
  ai: SettingsSection;
  youtube: SettingsSection;
  email: SettingsSection;
  social: SettingsSection;
  ads: SettingsSection;
  appearance: SettingsSection;
  security: SettingsSection;
  updated_at?: string;
};

const EMPTY_SETTINGS: SiteSettings = {
  general: {}, seo: {}, analytics: {}, ai: {}, youtube: {},
  email: {}, social: {}, ads: {}, appearance: {}, security: {},
};

function edgeUrl(action?: string) {
  const base = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/site-settings`;
  return action ? `${base}?action=${action}` : base;
}

async function authHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(edgeUrl(), { headers: await authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to load settings (${res.status})`);
      setSettings({ ...EMPTY_SETTINGS, ...(data.settings as SiteSettings) });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Save one or more sections. Returns refreshed settings.
  const saveSections = useCallback(async (sections: Partial<Record<SectionName, SettingsSection>>): Promise<void> => {
    const res = await fetch(edgeUrl(), {
      method: 'PUT',
      headers: await authHeaders(),
      body: JSON.stringify({ sections }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || `Save failed (${res.status})`);
    if (data.settings) setSettings({ ...EMPTY_SETTINGS, ...(data.settings as SiteSettings) });
    else await refresh();
  }, [refresh]);

  // Export all settings (including raw secrets) for download.
  const exportSettings = useCallback(async (): Promise<SiteSettings> => {
    const res = await fetch(edgeUrl('export'), { headers: await authHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || `Export failed (${res.status})`);
    return data.settings as SiteSettings;
  }, []);

  // Import full settings backup, replacing all sections.
  const importSettings = useCallback(async (incoming: SiteSettings): Promise<void> => {
    const res = await fetch(edgeUrl('import'), {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ settings: incoming }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || `Import failed (${res.status})`);
    await refresh();
  }, [refresh]);

  // Reset one or more sections to empty.
  const resetSections = useCallback(async (sections: SectionName[]): Promise<void> => {
    const res = await fetch(edgeUrl('reset'), {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ sections }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || `Reset failed (${res.status})`);
    await refresh();
  }, [refresh]);

  return { settings, loading, error, refresh, saveSections, exportSettings, importSettings, resetSections };
}

// Backward-compatible AI settings hook — reads from site_settings.ai (masked).
export type AiSettings = {
  hasApiKey: boolean;
  model: string;
  provider: AiProvider;
};

export type AiSettingsRow = {
  id: number;
  ai_api_key: string | null;
  ai_model: string;
  ai_provider: AiProvider;
  updated_at: string;
};

export function useAiSettings() {
  const { settings, loading, error } = useSiteSettings();
  const aiSection = settings.ai;
  const aiSettings: AiSettings | null = loading ? null : {
    hasApiKey: aiSection.hasApiKey === true,
    model: (aiSection.model as string) || 'gpt-4o-mini',
    provider: (aiSection.provider as AiProvider) || 'openai',
  };
  return { settings: aiSettings, loading, error };
}

// Legacy direct-save helper kept for any older callers. Writes through the
// site_settings edge function so secrets are preserved correctly.
export async function saveAiSettings(
  apiKey: string,
  model: string,
  provider: AiProvider,
) {
  const res = await fetch(edgeUrl(), {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify({ sections: { ai: { apiKey: apiKey || '', model, provider } } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to save AI settings');
}
