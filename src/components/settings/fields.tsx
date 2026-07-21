import { useState, type ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { Eye, EyeOff, Upload, Loader2, X } from 'lucide-react';

// --- Text field -----------------------------------------------------------
export function TextField({
  label, value, onChange, placeholder, hint, type = 'text', id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
  id?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 focus:outline-none" />
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

// --- Secret (masked) field ------------------------------------------------
export function SecretField({
  label, value, onChange, placeholder, hint, hasExisting, id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  hasExisting?: boolean;
  id?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</label>
      <div className="relative">
        <input id={id} type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={hasExisting ? '•••••••• (enter a new value to replace)' : placeholder}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 pr-11 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 focus:outline-none" autoComplete="off" />
        <button type="button" onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700"
          aria-label={show ? 'Hide' : 'Show'}>
          {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

// --- Textarea field -------------------------------------------------------
export function TextAreaField({
  label, value, onChange, placeholder, hint, rows = 3, id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
  id?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</label>
      <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 focus:outline-none" />
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

// --- Select field ---------------------------------------------------------
export function SelectField({
  label, value, onChange, options, hint, id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
  id?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 focus:outline-none">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

// --- Toggle field ---------------------------------------------------------
export function ToggleField({
  label, checked, onChange, hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-ink-800">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-ink-400">{hint}</p>}
      </div>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-brand-600' : 'bg-ink-200'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

// --- Color field ----------------------------------------------------------
export function ColorField({
  label, value, onChange, id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</label>
      <div className="flex items-center gap-3">
        <input id={id} type="color" value={value || '#1a73e8'} onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-lg border border-ink-200 bg-white p-1" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="#1a73e8"
          className="flex-1 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 focus:outline-none" />
      </div>
    </div>
  );
}

// --- File upload field ----------------------------------------------------
export function FileUploadField({
  label, value, onChange, accept = 'image/*', bucket = 'site-assets', hint, id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accept?: string;
  bucket?: string;
  hint?: string;
  id?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr(null);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const path = `settings/${id || label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(pub.publicUrl);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-ink-200 bg-ink-50">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => onChange('')}
              className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-error-600 text-white shadow" aria-label="Remove">
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        )}
        <label htmlFor={id}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
          {uploading ? 'Uploading…' : 'Upload'}
        </label>
        <input id={id} type="file" accept={accept} onChange={handleFile} className="hidden" />
      </div>
      {value && <p className="mt-1 truncate text-xs text-ink-400">{value}</p>}
      {err && <p className="mt-1 text-xs text-error-600">{err}</p>}
      {hint && !err && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

// --- Section wrapper ------------------------------------------------------
export function SectionCard({ title, description, children, actions }: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-ink-950">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}
