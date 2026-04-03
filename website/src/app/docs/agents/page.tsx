import type { Metadata } from 'next';
import DocContent from '@/components/DocContent';

export const metadata: Metadata = {
  title: 'Agents — Great Minds Docs',
  description: 'Great Minds Agency documentation — Agents.',
};

export default function AgentsDocPage() {
  return <DocContent file="AGENTS.md" source="AGENTS.md" />;
}
