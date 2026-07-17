import { Link } from '../router';

type Heading = { id: string; text: string; level: number };

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  return (
    <nav aria-label="Table of Contents" className="card p-5">
      <h2 className="text-sm font-semibold text-ink-950">Table of Contents</h2>
      <ol className="mt-3 space-y-1.5">
        {headings.map((h, i) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? '1.25rem' : '0' }}>
            <Link to={`#${h.id}`} className="text-sm text-ink-500 transition hover:text-brand-700">
              {h.level === 3 ? '↳ ' : ''}{h.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
