import { redirect } from 'next/navigation';

/**
 * /projects redirects to homepage projects section.
 * Case studies live at /work/[slug].
 */
export default function ProjectsPage() {
  redirect('/#projects');
}
