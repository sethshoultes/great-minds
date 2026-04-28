export interface Persona {
  id: string;
  name: string;
  plugin: string;
  tier: "founder" | "board" | "director" | "sub" | "specialist";
  role: string;
  title: string;
  tagline: string;
  color: string;
  reportsTo: string | null;
  portrait: string;
  philosophy: string[];
  personaPrompt: string;
  samplePrompts: string[];
  doesNot: string;
  bio?: string;
}

export interface Plugin {
  id: string;
  label: string;
  accent: string;
}
