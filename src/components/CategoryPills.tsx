import { Link } from '../router';
import { categories } from '../content/categories';
import { Icon } from './Icon';

export function CategoryPills({ active }: { active: string }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Category filter">
      <Link to="/blog" className={`chip transition ${!active ? 'bg-ink-950 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}>All</Link>
      {categories.map((c) => (
        <Link key={c.slug} to={`/blog?category=${c.slug}`} className={`chip transition ${active === c.slug ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}>
          <Icon name={c.icon} className="h-3 w-3" aria-hidden="true" /> {c.name}
        </Link>
      ))}
    </div>
  );
}
