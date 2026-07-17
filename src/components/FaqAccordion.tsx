import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '../lib/supabase';

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="card overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left" aria-expanded={open === i} aria-controls={`faq-content-${i}`}>
            <span className="font-medium text-ink-950">{faq.q}</span>
            <ChevronDown className={`h-5 w-5 shrink-0 text-ink-400 transition ${open === i ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          {open === i && <div id={`faq-content-${i}`} className="px-5 pb-5 text-sm text-ink-600 leading-relaxed">{faq.a}</div>}
        </div>
      ))}
    </div>
  );
}
