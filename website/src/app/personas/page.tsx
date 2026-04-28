import type { Metadata } from "next";
import PersonaApp from "@/components/personas/PersonaApp";
import "./personas.css";

export const metadata: Metadata = {
  title: "Personas — Great Minds",
  description: "99 personas across 10 disciplines. Click any portrait to read their philosophy and test their voice. Convene them in the boardroom. Compare two minds on the same question.",
  openGraph: {
    title: "Great Minds — Persona Testbed",
    description: "99 personas, 10 disciplines, 0 meetings.",
    url: "https://greatminds.company/personas",
    type: "website",
  },
};

export default function PersonasPage() {
  return <PersonaApp />;
}
