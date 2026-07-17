import { useRef } from 'react';
import { Bold, Italic, List, Link2, Heading, Quote, Code, Image as ImageIcon } from 'lucide-react';

export function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function wrap(before: string, after: string = before) {
    const ta = ref.current; if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const sel = value.substring(start, end);
    const newVal = value.substring(0, start) + before + sel + after + value.substring(end);
    onChange(newVal);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(start + before.length, end + before.length); });
  }

  function linePrefix(prefix: string) {
    const ta = ref.current; if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newVal = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(newVal);
  }

  const btn = "grid h-9 w-9 place-items-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-950";

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-ink-100 bg-ink-50 p-2" role="toolbar" aria-label="Formatting toolbar">
        <button type="button" onClick={() => wrap('<strong>', '</strong>')} className={btn} title="Bold" aria-label="Bold"><Bold className="h-4 w-4" aria-hidden="true" /></button>
        <button type="button" onClick={() => wrap('<em>', '</em>')} className={btn} title="Italic" aria-label="Italic"><Italic className="h-4 w-4" aria-hidden="true" /></button>
        <button type="button" onClick={() => wrap('<h2>', '</h2>')} className={btn} title="Heading" aria-label="Heading"><Heading className="h-4 w-4" aria-hidden="true" /></button>
        <button type="button" onClick={() => linePrefix('<li>')} className={btn} title="List" aria-label="List item"><List className="h-4 w-4" aria-hidden="true" /></button>
        <button type="button" onClick={() => wrap('<a href="">', '</a>')} className={btn} title="Link" aria-label="Insert link"><Link2 className="h-4 w-4" aria-hidden="true" /></button>
        <button type="button" onClick={() => wrap('<blockquote>', '</blockquote>')} className={btn} title="Quote" aria-label="Block quote"><Quote className="h-4 w-4" aria-hidden="true" /></button>
        <button type="button" onClick={() => wrap('<code>', '</code>')} className={btn} title="Code" aria-label="Inline code"><Code className="h-4 w-4" aria-hidden="true" /></button>
        <button type="button" onClick={() => wrap('<img src="" alt="" />')} className={btn} title="Image" aria-label="Insert image"><ImageIcon className="h-4 w-4" aria-hidden="true" /></button>
      </div>
      <label htmlFor="editor-content" className="sr-only">Post content</label>
      <textarea id="editor-content" ref={ref} value={value} onChange={(e) => onChange(e.target.value)} rows={16} className="w-full resize-y bg-white px-4 py-3 text-sm text-ink-900 focus:outline-none" placeholder="Write your post content in HTML…" />
    </div>
  );
}
