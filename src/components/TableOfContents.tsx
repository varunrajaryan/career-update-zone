type Heading = { id: string; text: string; level: number };

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  return (
    <nav aria-label="Table of Contents" className="card p-5">
      <h2 className="text-sm font-semibold text-ink-950">Table of Contents</h2>
      <ol className="mt-3 space-y-1.5">
        {headings.map((h, i) => (
          <li key={`${h.id}-${i}`} style={{ paddingLeft: h.level === 3 ? '1.25rem' : '0' }}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  history.replaceState(null, '', `#${h.id}`);
                }
              }}
              className="text-sm text-ink-500 transition hover:text-brand-700"
            >
              {h.level === 3 ? '↳ ' : ''}{h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
