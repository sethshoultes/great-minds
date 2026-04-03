import type { Metadata } from 'next';
import DocContent from '@/components/DocContent';

export const metadata: Metadata = {
  title: 'Retrospective — Great Minds Docs',
  description: 'Great Minds Agency documentation — Retrospective.',
};

export default function RetrospectiveDocPage() {
  return <DocContent file="deliverables/retrospective.md" source="deliverables/retrospective.md" />;
}
