import { redirect } from 'next/navigation';

/**
 * /projects redirects to /work/localgenius.
 * The case study page is the canonical project showcase.
 */
export default function ProjectsPage() {
  redirect('/work/localgenius');
}
