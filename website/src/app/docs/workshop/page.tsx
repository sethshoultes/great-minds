import type { Metadata } from 'next';
import DocContent from '@/components/DocContent';

export const metadata: Metadata = {
  title: 'Workshop — Great Minds Docs',
  description: 'Great Minds Agency documentation — Workshop.',
};

export default function WorkshopDocPage() {
  return <DocContent file="deliverables/workshop-plan.md" source="deliverables/workshop-plan.md" />;
}
