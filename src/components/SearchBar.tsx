import { Search } from 'lucide-react';

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
      <label htmlFor="blog-search" className="sr-only">Search posts</label>
      <input id="blog-search" type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search posts…" className="input pl-10" />
    </div>
  );
}
