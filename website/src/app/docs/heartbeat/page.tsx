import type { Metadata } from 'next';
import DocContent from '@/components/DocContent';

export const metadata: Metadata = {
  title: 'Heartbeat — Great Minds Docs',
  description: 'Great Minds Agency documentation — Heartbeat.',
};

export default function HeartbeatDocPage() {
  return <DocContent file="HEARTBEAT.md" source="HEARTBEAT.md" />;
}
