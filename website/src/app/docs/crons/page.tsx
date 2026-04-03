import type { Metadata } from 'next';
import DocContent from '@/components/DocContent';

export const metadata: Metadata = {
  title: 'Cron Jobs — Great Minds Docs',
  description: 'Great Minds Agency documentation — Cron Jobs.',
};

export default function CronJobsDocPage() {
  return <DocContent file="CRONS.md" source="CRONS.md" />;
}
