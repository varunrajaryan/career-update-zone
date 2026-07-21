import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';

export type AiSettings = {
  hasApiKey: boolean;
  model: string;
};

export type AiSettingsRow = {
  id: number;
  ai_api_key: string | null;
  ai_model: string;
  updated_at: string;
};

export function useAiSettings() {
  const [settings, setSettings] = useState<AiSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('ai_settings')
      .select('id, ai_api_key, ai_model, updated_at')
      .eq('id', 1)
      .maybeSingle();
    if (error) {
      setError(error.message);
      setSettings(null);
    } else if (data) {
      const row = data as AiSettingsRow;
      setSettings({ hasApiKey: !!row.ai_api_key, model: row.ai_model });
    } else {
      setSettings({ hasApiKey: false, model: 'gpt-4o-mini' });
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { settings, loading, error, refresh };
}

export async function saveAiSettings(apiKey: string, model: string) {
  const { error } = await supabase
    .from('ai_settings')
    .update({ ai_api_key: apiKey || null, ai_model: model, updated_at: new Date().toISOString() })
    .eq('id', 1);
  if (error) throw new Error(error.message);
}
