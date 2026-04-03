import type { Metadata } from 'next';
import DocContent from '@/components/DocContent';

export const metadata: Metadata = {
  title: 'Scoreboard — Great Minds Docs',
  description: 'Great Minds Agency documentation — Scoreboard.',
};

export default function ScoreboardDocPage() {
  return <DocContent file="SCOREBOARD.md" source="SCOREBOARD.md" />;
}
