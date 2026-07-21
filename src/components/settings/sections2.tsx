import { SectionCard, TextField, SecretField, TextAreaField, ToggleField, SelectField, ColorField } from './fields';
import type { SettingsSection } from '../../lib/useSiteSettings';

type Props = {
  data: SettingsSection;
  update: (patch: Partial<Record<string, unknown>>) => void;
};

const str = (d: SettingsSection, k: string) => (typeof d[k] === 'string' ? d[k] as string : '');
const num = (d: SettingsSection, k: string) => (typeof d[k] === 'number' ? d[k] as number : 0);
const bool = (d: SettingsSection, k: string) => d[k] === true;

// 6. Email (SMTP) ------------------------------------------------------------
export function EmailSection({ data, update }: Props) {
  return (
    <SectionCard title="Email (SMTP)" description="SMTP server settings for sending transactional email.">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="SMTP Host" id="email-host" value={str(data, 'host')} onChange={(v) => update({ host: v })} placeholder="smtp.gmail.com" />
        <TextField label="SMTP Port" id="email-port" type="number" value={String(data.port ?? 587)} onChange={(v) => update({ port: parseInt(v, 10) || 0 })} placeholder="587" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Username" id="email-user" value={str(data, 'username')} onChange={(v) => update({ username: v })} placeholder="you@example.com" />
        <SecretField label="Password" id="email-pass" value={str(data, 'password')} onChange={(v) => update({ password: v })} hasExisting={data.hasPassword === true} hint="App-specific password if using Gmail." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Sender Name" id="email-name" value={str(data, 'senderName')} onChange={(v) => update({ senderName: v })} placeholder="Career Update Zone" />
        <TextField label="Sender Email" id="email-from" type="email" value={str(data, 'senderEmail')} onChange={(v) => update({ senderEmail: v })} placeholder="noreply@example.com" />
      </div>
    </SectionCard>
  );
}

// 7. Social Links ------------------------------------------------------------
export function SocialSection({ data, update }: Props) {
  const fields: { key: string; label: string; placeholder: string }[] = [
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle' },
    { key: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/yourhandle' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
    { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/yourchannel' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourpage' },
    { key: 'whatsapp', label: 'WhatsApp Channel', placeholder: 'https://whatsapp.com/channel/yourchannel' },
  ];
  return (
    <SectionCard title="Social Links" description="Links shown in the footer and contact page.">
      {fields.map((f) => (
        <TextField key={f.key} label={f.label} id={`social-${f.key}`} value={str(data, f.key)} onChange={(v) => update({ [f.key]: v })} placeholder={f.placeholder} />
      ))}
    </SectionCard>
  );
}

// 8. Ads ---------------------------------------------------------------------
export function AdsSection({ data, update }: Props) {
  return (
    <SectionCard title="Ads" description="Google AdSense and custom ad code snippets.">
      <TextField label="Google AdSense Publisher ID" id="ads-pub" value={str(data, 'adsensePublisherId')} onChange={(v) => update({ adsensePublisherId: v })} placeholder="ca-pub-XXXXXXXXXXXXXXXX" />
      <TextAreaField label="Header Ad Code" id="ads-header" value={str(data, 'headerAd')} onChange={(v) => update({ headerAd: v })} rows={4} hint="Inserted in the <head>. Paste full script tags." />
      <TextAreaField label="Sidebar Ad Code" id="ads-sidebar" value={str(data, 'sidebarAd')} onChange={(v) => update({ sidebarAd: v })} rows={4} />
      <TextAreaField label="In-Article Ad Code" id="ads-article" value={str(data, 'inArticleAd')} onChange={(v) => update({ inArticleAd: v })} rows={4} hint="Inserted mid-way through article body." />
      <TextAreaField label="Footer Ad Code" id="ads-footer" value={str(data, 'footerAd')} onChange={(v) => update({ footerAd: v })} rows={4} />
    </SectionCard>
  );
}

// 9. Appearance --------------------------------------------------------------
export function AppearanceSection({ data, update }: Props) {
  return (
    <SectionCard title="Appearance" description="Theme colors and display mode.">
      <div className="grid grid-cols-3 gap-4">
        <ColorField label="Primary Color" id="app-primary" value={str(data, 'primaryColor')} onChange={(v) => update({ primaryColor: v })} />
        <ColorField label="Secondary Color" id="app-secondary" value={str(data, 'secondaryColor')} onChange={(v) => update({ secondaryColor: v })} />
        <ColorField label="Accent Color" id="app-accent" value={str(data, 'accentColor')} onChange={(v) => update({ accentColor: v })} />
      </div>
      <SelectField label="Light/Dark Mode" id="app-mode" value={str(data, 'mode') || 'light'} onChange={(v) => update({ mode: v })}
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'system', label: 'Follow system' },
        ]} />
    </SectionCard>
  );
}

// 10. Security ---------------------------------------------------------------
export function SecuritySection({ data, update }: Props) {
  return (
    <SectionCard title="Security" description="Site access control and settings management.">
      <ToggleField label="Maintenance Mode" checked={bool(data, 'maintenanceMode')} onChange={(v) => update({ maintenanceMode: v })} hint="Show a maintenance page to non-admin visitors." />
      <TextField label="Session Timeout (minutes)" id="sec-timeout" type="number" value={String(data.sessionTimeout ?? 60)} onChange={(v) => update({ sessionTimeout: parseInt(v, 10) || 0 })} placeholder="60" hint="Auto-logout after this many minutes of inactivity." />
      <p className="rounded-xl bg-ink-50 px-4 py-3 text-xs text-ink-500">
        Export and Import manage your entire settings backup across all sections. Use Export to download a JSON backup, Import to restore it, and Reset to clear this section back to defaults.
      </p>
    </SectionCard>
  );
}
