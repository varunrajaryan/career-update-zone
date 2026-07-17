import { Link } from '../router';
import { ChevronRight } from 'lucide-react';

type Crumb = { label: string; to?: string };
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-400">
      <ol className="flex items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {item.to ? <Link to={item.to} className="hover:text-ink-950 transition">{item.label}</Link> : <span className="text-ink-700" aria-current="page">{item.label}</span>}
            {i < items.length - 1 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
