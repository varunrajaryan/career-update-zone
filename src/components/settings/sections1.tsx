import { SectionCard, TextField, FileUploadField, TextAreaField, SelectField, ToggleField, SecretField, ColorField } from './fields';
import type { SettingsSection } from '../../lib/useSiteSettings';

type Props = {
  data: SettingsSection;
  update: (patch: Partial<Record<string, unknown>>) => void;
};

const str = (d: SettingsSection, k: string) => (typeof d[k] === 'string' ? d[k] as string : '');
const num = (d: SettingsSection, k: string) => (typeof d[k] === 'number' ? d[k] as number : 0);
const bool = (d: SettingsSection, k: string) => d[k] === true;

// 1. General ----------------------------------------------------------------
export function GeneralSection({ data, update }: Props) {
  return (
    <SectionCard title="General" description="Core website identity and contact information.">
      <TextField label="Website Name" id="general-name" value={str(data, 'name')} onChange={(v) => update({ name: v })} placeholder="Career Update Zone" />
      <TextField label="Tagline" id="general-tagline" value={str(data, 'tagline')} onChange={(v) => update({ tagline: v })} placeholder="Your career, one update away." />
      <FileUploadField label="Logo" id="general-logo" value={str(data, 'logo')} onChange={(v) => update({ logo: v })} hint="PNG or SVG. Shown in the navbar and footer." />
      <FileUploadField label="Favicon" id="general-favicon" value={str(data, 'favicon')} onChange={(v) => update({ favicon: v })} accept="image/png,image/svg+xml,image/x-icon" hint="Shown in the browser tab." />
      <TextField label="Contact Email" id="general-email" type="email" value={str(data, 'contactEmail')} onChange={(v) => update({ contactEmail: v })} placeholder="hello@example.com" />
      <TextField label="Contact Phone" id="general-phone" value={str(data, 'contactPhone')} onChange={(v) => update({ contactPhone: v })} placeholder="+91 90000 00000" />
      <TextField label="Address" id="general-address" value={str(data, 'address')} onChange={(v) => update({ address: v })} placeholder="City, State, India" />
      <TextField label="Copyright Text" id="general-copyright" value={str(data, 'copyright')} onChange={(v) => update({ copyright: v })} placeholder="© 2026 Career Update Zone. All rights reserved." />
    </SectionCard>
  );
}

// 2. SEO --------------------------------------------------------------------
export function SeoSection({ data, update }: Props) {
  return (
    <SectionCard title="SEO" description="Default search-engine and social-share metadata.">
      <TextField label="Default SEO Title" id="seo-title" value={str(data, 'defaultTitle')} onChange={(v) => update({ defaultTitle: v })} placeholder="Career Update Zone — Latest Jobs & Career News" hint="Used when a page has no custom SEO title." />
      <TextAreaField label="Default Meta Description" id="seo-desc" value={str(data, 'defaultDescription')} onChange={(v) => update({ defaultDescription: v })} placeholder="Stay ahead with the latest government job updates, exam results, and career news." hint="Keep under 160 characters." />
      <TextField label="Default Keywords" id="seo-keywords" value={str(data, 'defaultKeywords')} onChange={(v) => update({ defaultKeywords: v })} placeholder="jobs, career, exams, results" hint="Comma-separated." />
      <FileUploadField label="Open Graph Image" id="seo-og" value={str(data, 'ogImage')} onChange={(v) => update({ ogImage: v })} hint="1200×630 px. Used for social link previews." />
      <FileUploadField label="Twitter Image" id="seo-twitter" value={str(data, 'twitterImage')} onChange={(v) => update({ twitterImage: v })} hint="1200×600 px. Used for Twitter card previews." />
      <TextField label="Canonical Website URL" id="seo-canonical" value={str(data, 'canonicalUrl')} onChange={(v) => update({ canonicalUrl: v })} placeholder="https://careerupdatezone.com" />
      <SelectField label="robots.txt" id="seo-robots" value={str(data, 'robots') || 'index,follow'} onChange={(v) => update({ robots: v })}
        options={[
          { value: 'index,follow', label: 'Allow indexing (index, follow)' },
          { value: 'noindex,follow', label: 'Block indexing (noindex, follow)' },
          { value: 'noindex,nofollow', label: 'Block all (noindex, nofollow)' },
        ]} />
    </SectionCard>
  );
}

// 3. Analytics ---------------------------------------------------------------
export function AnalyticsSection({ data, update }: Props) {
  return (
    <SectionCard title="Analytics" description="Tracking and verification IDs for search engines and analytics.">
      <TextField label="Google Analytics Measurement ID" id="analytics-ga" value={str(data, 'gaMeasurementId')} onChange={(v) => update({ gaMeasurementId: v })} placeholder="G-XXXXXXXXXX" />
      <TextField label="Google Search Console Verification" id="analytics-gsc" value={str(data, 'gscVerification')} onChange={(v) => update({ gscVerification: v })} placeholder="google-site-verification code" />
      <TextField label="Bing Webmaster Verification" id="analytics-bing" value={str(data, 'bingVerification')} onChange={(v) => update({ bingVerification: v })} placeholder="msvalidate.01 code" />
      <TextField label="Microsoft Clarity ID (optional)" id="analytics-clarity" value={str(data, 'clarityId')} onChange={(v) => update({ clarityId: v })} placeholder="abcdef1234" />
    </SectionCard>
  );
}

// 4. AI Settings -------------------------------------------------------------
export function AiSection({ data, update }: Props) {
  const provider = (str(data, 'provider') || 'openai') as string;
  const modelOptions: Record<string, { value: string; label: string }[]> = {
    openai: [
      { value: 'gpt-4o-mini', label: 'GPT-4o mini (fast, affordable)' },
      { value: 'gpt-4o', label: 'GPT-4o (highest quality)' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (legacy)' },
    ],
    gemini: [
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (fast, affordable)' },
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (highest quality)' },
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (fast)' },
    ],
    claude: [
      { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (balanced)' },
      { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (fast)' },
      { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus (highest quality)' },
    ],
    openrouter: [
      { value: 'openai/gpt-4o-mini', label: 'GPT-4o mini (via OpenRouter)' },
      { value: 'google/gemini-1.5-flash', label: 'Gemini 1.5 Flash (via OpenRouter)' },
      { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (via OpenRouter)' },
    ],
  };
  const keyHint: Record<string, string> = {
    openai: 'Get your key from platform.openai.com → API keys.',
    gemini: 'Get your key from aistudio.google.com → API key.',
    claude: 'Get your key from console.anthropic.com → API keys.',
    openrouter: 'Get your key from openrouter.ai → Keys.',
  };
  const models = modelOptions[provider] || modelOptions.openai;
  return (
    <SectionCard title="AI Settings" description="Configure the AI Generator provider, model, and behaviour.">
      <SelectField label="AI Provider" id="ai-provider" value={provider} onChange={(v) => {
        const next = modelOptions[v]?.[0]?.value || '';
        update({ provider: v, model: next });
      }}
        options={[
          { value: 'openai', label: 'OpenAI' },
          { value: 'gemini', label: 'Google Gemini' },
          { value: 'claude', label: 'Anthropic Claude' },
          { value: 'openrouter', label: 'OpenRouter' },
        ]} />
      <SelectField label="Model" id="ai-model" value={str(data, 'model') || models[0].value} onChange={(v) => update({ model: v })} options={models} />
      <SecretField label="API Key" id="ai-key" value={str(data, 'apiKey')} onChange={(v) => update({ apiKey: v })} hasExisting={data.hasApiKey === true} hint={keyHint[provider] || 'Leave blank to keep the existing key.'} />
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Temperature" id="ai-temp" type="number" value={String(data.temperature ?? 0.7)} onChange={(v) => update({ temperature: parseFloat(v) || 0 })} placeholder="0.7" hint="0 = precise, 1 = creative" />
        <TextField label="Max Article Length (words)" id="ai-maxlen" type="number" value={String(data.maxLength ?? 900)} onChange={(v) => update({ maxLength: parseInt(v, 10) || 0 })} placeholder="900" />
      </div>
      <SelectField label="Writing Style" id="ai-style" value={str(data, 'writingStyle') || 'professional'} onChange={(v) => update({ writingStyle: v })}
        options={[
          { value: 'professional', label: 'Professional' },
          { value: 'conversational', label: 'Conversational' },
          { value: 'journalistic', label: 'Journalistic' },
          { value: 'instructional', label: 'Instructional / How-to' },
        ]} />
      <ToggleField label="Auto Generate Tags" checked={bool(data, 'autoTags')} onChange={(v) => update({ autoTags: v })} hint="Let the AI suggest 5-8 tags for each article." />
      <ToggleField label="Auto Generate FAQs" checked={bool(data, 'autoFaqs')} onChange={(v) => update({ autoFaqs: v })} hint="Let the AI suggest 2-4 FAQ pairs for each article." />
    </SectionCard>
  );
}

// 5. YouTube -----------------------------------------------------------------
export function YouTubeSection({ data, update }: Props) {
  return (
    <SectionCard title="YouTube" description="YouTube channel integration for the Videos page.">
      <SecretField label="YouTube API Key" id="yt-key" value={str(data, 'apiKey')} onChange={(v) => update({ apiKey: v })} hasExisting={data.hasApiKey === true} hint="Google Cloud Console → YouTube Data API v3 key." />
      <TextField label="Channel ID" id="yt-channel" value={str(data, 'channelId')} onChange={(v) => update({ channelId: v })} placeholder="UCxxxxxxxxxxxx" />
      <TextField label="Number of Videos to Display" id="yt-count" type="number" value={String(data.videoCount ?? 6)} onChange={(v) => update({ videoCount: parseInt(v, 10) || 0 })} placeholder="6" />
      <ToggleField label="Auto Refresh Latest Videos" checked={bool(data, 'autoRefresh')} onChange={(v) => update({ autoRefresh: v })} hint="Fetch new videos automatically on page load." />
    </SectionCard>
  );
}
