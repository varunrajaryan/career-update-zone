import { Video, Briefcase, CreditCard, Trophy, Book, Key, GraduationCap, Award, Lightbulb, type LucideIcon } from 'lucide-react';
const icons: Record<string, LucideIcon> = { briefcase: Briefcase, card: CreditCard, trophy: Trophy, book: Book, key: Key, graduation: GraduationCap, award: Award, lightbulb: Lightbulb, video: Video };
export function Icon({ name, className }: { name: string; className?: string }) {
  const C = icons[name] || Video;
  return <C className={className} />;
}
