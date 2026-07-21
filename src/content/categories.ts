export type Category = { slug: string; name: string; description: string; icon: string };
export const categories: Category[] = [
  { slug: 'latest-jobs', name: 'Latest Jobs', description: 'Latest government and private job notifications', icon: 'briefcase' },
  { slug: 'admit-card', name: 'Admit Cards', description: 'Download admit cards and exam hall tickets', icon: 'card' },
  { slug: 'result', name: 'Results', description: 'Exam results and merit lists', icon: 'trophy' },
  { slug: 'syllabus', name: 'Syllabus', description: 'Exam syllabus and pattern details', icon: 'book' },
  { slug: 'answer-key', name: 'Answer Keys', description: 'Official answer keys and solutions', icon: 'key' },
  { slug: 'admission', name: 'Admissions', description: 'College and university admission updates', icon: 'graduation' },
  { slug: 'scholarship', name: 'Scholarships', description: 'Scholarship and fellowship opportunities', icon: 'award' },
  { slug: 'career-tips', name: 'Career Tips', description: 'Career guidance and interview preparation', icon: 'lightbulb' },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
