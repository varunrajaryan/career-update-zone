import { Globe, FileText, Edit3, Ticket, Trophy, Link2, ExternalLink, Download } from 'lucide-react';
import type { ImportantLink } from '../lib/supabase';

const ICON_MAP: Record<string, typeof Globe> = {
  globe: Globe,
  document: FileText,
  apply: Edit3,
  'admit-card': Ticket,
  result: Trophy,
  link: Link2,
};

const ICON_SUGGESTIONS: { test: RegExp; icon: string }[] = [
  { test: /website|official|home|portal/i, icon: 'globe' },
  { test: /apply|registration|register|login/i, icon: 'apply' },
  { test: /admit|card|hall/i, icon: 'admit-card' },
  { test: /result|score|merit/i, icon: 'result' },
  { test: /notification|notice|advertisement|document|download|syllabus|pdf/i, icon: 'document' },
];

export function suggestIcon(title: string): string {
  for (const s of ICON_SUGGESTIONS) {
    if (s.test.test(title)) return s.icon;
  }
  return 'link';
}

function isImageFile(url: string): boolean {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
}

function isPdfFile(url: string): boolean {
  return /\.pdf$/i.test(url);
}

export function ImportantLinks({ links }: { links: ImportantLink[] }) {
  if (!links || links.length === 0) return null;

  return (
    <section aria-label="Important links" className="mt-8">
      <h2 className="font-display text-2xl font-bold text-ink-950 mb-4">Important Links</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link, i) => {
          const iconKey = link.icon || suggestIcon(link.title);
          const Icon = ICON_MAP[iconKey] || Link2;
          const isImage = link.type === 'file' && isImageFile(link.url);
          const isPdf = link.type === 'file' && isPdfFile(link.url);
          const target = link.type === 'url' || isImage ? '_blank' : undefined;
          const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

          return (
            <a
              key={i}
              href={link.url}
              target={target}
              rel={rel}
              className="group flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-4 transition hover:border-brand-400 hover:shadow-md"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink-950">{link.title}</span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-ink-400">
                  {link.type === 'file' ? (
                    <><Download className="h-3 w-3" aria-hidden="true" /> {isImage ? 'View image' : isPdf ? 'View PDF' : 'Download file'}</>
                  ) : (
                    <><ExternalLink className="h-3 w-3" aria-hidden="true" /> External link</>
                  )}
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
