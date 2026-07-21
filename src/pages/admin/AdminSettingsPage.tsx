import { useState } from 'react';
import { Link, useRouter } from '../../router';
import { useAuth } from '../../lib/auth';
import { Seo } from '../../components/Seo';
import { useAiSettings, saveAiSettings } from '../../lib/useAiSettings';
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Key, Cpu, Eye, EyeOff } from 'lucide-react';

export function AdminSettingsPage() {
  const { navigate } = useRouter();
  const { settings, loading, error: loadError, refresh } = useAiSettings();
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Sync form when settings load.
  if (settings && model === 'gpt-4o-mini' && settings.model && model !== settings.model) {
    setModel(settings.model);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setSaveError(null); setSaved(false);
    try {
      await saveAiSettings(apiKey.trim(), model.trim() || 'gpt-4o-mini');
      setApiKey('');
      setSaved(true);
      setShowKey(false);
      await refresh();
    } catch (err) {
      setSaveError((err as Error).message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Seo title="Admin Settings — Career Update Zone" description="Configure AI Generator settings" canonical="/admin/settings" noindex />
      <div className="border-b border-ink-100 bg-ink-950 text-white">
        <div className="container-content py-4 flex items-center gap-3">
          <Link to="/admin" className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-white/20" aria-label="Back to dashboard"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></Link>
          <p className="font-display text-sm font-semibold">Admin Settings</p>
        </div>
      </div>
      <div className="container-content py-10 max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-ink-950">AI Generator Settings</h1>
        <p className="mt-2 text-sm text-ink-500">Configure the AI provider used by the AI Generator tab in the post editor. The key is stored securely and only read server-side by the edge function.</p>

        {loading && <p className="mt-6 text-sm text-ink-500">Loading settings…</p>}
        {loadError && <div className="mt-6 flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700"><AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />Could not load settings: {loadError}</div>}

        {settings && (
          <div className="mt-6 card p-5">
            <div className="flex items-center gap-3">
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${settings.hasApiKey ? 'bg-success-50 text-success-600' : 'bg-warning-50 text-warning-600'}`}>
                {settings.hasApiKey ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : <AlertCircle className="h-5 w-5" aria-hidden="true" />}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-950">{settings.hasApiKey ? 'AI is configured' : 'AI is not configured'}</p>
                <p className="text-xs text-ink-500">Model: {settings.model}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <div>
            <label htmlFor="ai-model" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-800"><Cpu className="h-4 w-4 text-brand-600" aria-hidden="true" /> Model</label>
            <input id="ai-model" type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="gpt-4o-mini" className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 focus:outline-none" />
            <p className="mt-1 text-xs text-ink-400">OpenAI-compatible model id, e.g. gpt-4o-mini, gpt-4o, gpt-3.5-turbo.</p>
          </div>
          <div>
            <label htmlFor="ai-key" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-800"><Key className="h-4 w-4 text-brand-600" aria-hidden="true" /> API key</label>
            <div className="relative">
              <input id="ai-key" type={showKey ? 'text' : 'password'} value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={settings?.hasApiKey ? '•••••••• (enter a new key to replace)' : 'Paste your API key'} className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 pr-11 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 focus:outline-none" autoComplete="off" />
              <button type="button" onClick={() => setShowKey((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label={showKey ? 'Hide key' : 'Show key'}>
                {showKey ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-ink-400">Leave blank to keep the existing key. Stored in Supabase, read only by the edge function.</p>
          </div>

          {saveError && <div className="flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700"><AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />{saveError}</div>}
          {saved && <div className="flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700"><CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />Settings saved.</div>}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50"><Save className="h-4 w-4" aria-hidden="true" /> {saving ? 'Saving…' : 'Save settings'}</button>
            <button type="button" onClick={() => navigate('/admin/new')} className="btn-ghost">Go to AI Generator</button>
          </div>
        </form>
      </div>
    </>
  );
}
