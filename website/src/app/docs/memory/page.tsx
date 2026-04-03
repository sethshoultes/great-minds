import type { Metadata } from 'next';
import DocContent from '@/components/DocContent';

export const metadata: Metadata = {
  title: 'Memory — Great Minds Docs',
  description: 'Great Minds Agency documentation — Memory.',
};

export default function MemoryDocPage() {
  return <DocContent file="MEMORY.md" source="MEMORY.md" />;
}
