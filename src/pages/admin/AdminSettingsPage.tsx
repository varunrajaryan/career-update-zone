import { useEffect, useMemo, useState } from 'react';
import { Link, useRouter } from '../../router';
import { Seo } from '../../components/Seo';
import { useSiteSettings, type SectionName, type SiteSettings, type SettingsSection } from '../../lib/useSiteSettings';
import {
  ArrowLeft, Save, AlertCircle, CheckCircle2, RotateCcw, Download, Upload, Loader2,
  Globe, Search, BarChart3, Bot, Youtube, Mail, Share2, DollarSign, Palette, Shield,
} from 'lucide-react';
import {
  GeneralSection, SeoSection, AnalyticsSection, AiSection, YouTubeSection,
} from '../../components/settings/sections1';
import {
  EmailSection, SocialSection, AdsSection, AppearanceSection, SecuritySection,
} from '../../components/settings/sections2';

type SectionMeta = { id: SectionName; label: string; icon: typeof Globe };

const SECTIONS: SectionMeta[] = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'ai', label: 'AI Settings', icon: Bot },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'email', label: 'Email (SMTP)', icon: Mail },
  { id: 'social', label: 'Social Links', icon: Share2 },
  { id: 'ads', label: 'Ads', icon: DollarSign },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
];

export function AdminSettingsPage() {
  const { navigate } = useRouter();
  const { settings, loading, error: loadError, saveSections, exportSettings, importSettings, resetSections } = useSiteSettings();
  const [active, setActive] = useState<SectionName>('general');
  // Local draft per section — only the active section's data is editable.
  const [drafts, setDrafts] = useState<Partial<Record<SectionName, SettingsSection>>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [globalMsg, setGlobalMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync the active section's draft when server settings load / active changes.
  useEffect(() => {
    if (loading) return;
    setDrafts((prev) => ({
      ...prev,
      [active]: { ...(settings[active] || {}) },
    }));
  }, [loading, active, settings]);

  const activeDraft = drafts[active] || {};

  function update(patch: Partial<Record<string, unknown>>) {
    setDrafts((prev) => ({ ...prev, [active]: { ...(prev[active] || {}), ...patch } }));
  }

  // Detect unsaved changes on the active section.
  const isDirty = useMemo(() => {
    const a = drafts[active];
    const b = settings[active] || {};
    if (!a) return false;
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) return true;
    }
    return false;
  }, [drafts, active, settings]);

  async function handleSave() {
    setSaving(true); setSaveError(null); setSaved(false);
    try {
      await saveSections({ [active]: activeDraft });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError((err as Error).message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!confirm(`Reset the ${active} section to empty? This cannot be undone.`)) return;
    setResetting(true); setGlobalMsg(null);
    try {
      await resetSections([active]);
      setDrafts((prev) => ({ ...prev, [active]: {} }));
      setGlobalMsg({ type: 'success', text: `${active} section reset.` });
      setTimeout(() => setGlobalMsg(null), 3000);
    } catch (err) {
      setGlobalMsg({ type: 'error', text: (err as Error).message || 'Reset failed' });
    } finally {
      setResetting(false);
    }
  }

  async function handleExport() {
    setExporting(true); setGlobalMsg(null);
    try {
      const all = await exportSettings();
      const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `site-settings-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setGlobalMsg({ type: 'success', text: 'Settings exported.' });
      setTimeout(() => setGlobalMsg(null), 3000);
    } catch (err) {
      setGlobalMsg({ type: 'error', text: (err as Error).message || 'Export failed' });
    } finally {
      setExporting(false);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!confirm('Importing will REPLACE all settings across every section. Continue?')) {
      e.target.value = '';
      return;
    }
    setImporting(true); setGlobalMsg(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as SiteSettings;
      await importSettings(parsed);
      setDrafts({});
      setGlobalMsg({ type: 'success', text: 'Settings imported successfully.' });
      setTimeout(() => setGlobalMsg(null), 4000);
    } catch (err) {
      setGlobalMsg({ type: 'error', text: (err as Error).message || 'Import failed' });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  }

  const ActiveIcon = SECTIONS.find((s) => s.id === active)?.icon || Globe;

  return (
    <>
      <Seo title="Settings — Admin" description="Configure website settings" canonical="/admin/settings" noindex />
      <div className="border-b border-ink-100 bg-ink-950 text-white">
        <div className="container-content py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-white/20" aria-label="Back to dashboard"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></Link>
            <p className="font-display text-sm font-semibold">Settings</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} disabled={exporting} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:opacity-50">
              {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Download className="h-3.5 w-3.5" aria-hidden="true" />}
              <span className="hidden sm:inline">Export</span>
            </button>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:opacity-50">
              {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Upload className="h-3.5 w-3.5" aria-hidden="true" />}
              <span className="hidden sm:inline">Import</span>
              <input type="file" accept="application/json" onChange={handleImport} className="hidden" disabled={importing} />
            </label>
          </div>
        </div>
      </div>

      <div className="container-content py-8">
        {loading ? (
          <div className="grid place-items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-600" aria-hidden="true" /></div>
        ) : loadError ? (
          <div className="card max-w-md p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-error-600" aria-hidden="true" />
            <p className="mt-3 text-sm text-ink-600">{loadError}</p>
            <button onClick={() => navigate('/admin')} className="btn-ghost mt-4">Back to dashboard</button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-4 lg:self-start">
              <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-ink-100 bg-white p-2 lg:flex-col">
                {SECTIONS.map((s) => {
                  const Icon = s.icon;
                  const isActive = s.id === active;
                  return (
                    <button key={s.id} onClick={() => setActive(s.id)}
                      className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand-600 text-white shadow-sm' : 'text-ink-600 hover:bg-ink-50'}`}>
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="whitespace-nowrap">{s.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Content */}
            <div className="min-w-0">
              {globalMsg && (
                <div className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${globalMsg.type === 'success' ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'}`}>
                  {globalMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" /> : <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  {globalMsg.text}
                </div>
              )}

              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600"><ActiveIcon className="h-5 w-5" aria-hidden="true" /></span>
                  <h1 className="font-display text-lg font-bold text-ink-950">{SECTIONS.find((s) => s.id === active)?.label}</h1>
                  {isDirty && <span className="rounded-full bg-warning-50 px-2.5 py-0.5 text-xs font-medium text-warning-700">Unsaved</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleReset} disabled={resetting} className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50 disabled:opacity-50">
                    {resetting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <RotateCcw className="h-4 w-4" aria-hidden="true" />}
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                  <button onClick={handleSave} disabled={saving || !isDirty} className="btn-primary disabled:opacity-50">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>

              {saveError && <div className="mb-4 flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700"><AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />{saveError}</div>}
              {saved && <div className="mb-4 flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700"><CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />Section saved.</div>}

              {active === 'general' && <GeneralSection data={activeDraft} update={update} />}
              {active === 'seo' && <SeoSection data={activeDraft} update={update} />}
              {active === 'analytics' && <AnalyticsSection data={activeDraft} update={update} />}
              {active === 'ai' && <AiSection data={activeDraft} update={update} />}
              {active === 'youtube' && <YouTubeSection data={activeDraft} update={update} />}
              {active === 'email' && <EmailSection data={activeDraft} update={update} />}
              {active === 'social' && <SocialSection data={activeDraft} update={update} />}
              {active === 'ads' && <AdsSection data={activeDraft} update={update} />}
              {active === 'appearance' && <AppearanceSection data={activeDraft} update={update} />}
              {active === 'security' && <SecuritySection data={activeDraft} update={update} />}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
