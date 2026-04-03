/**
 * Documentation pages — plain TypeScript data.
 * Same pattern as posts.ts. No MDX, no CMS.
 */

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  category: 'getting-started' | 'architecture' | 'personas' | 'reference';
  order: number; // Sort within category
  sections: DocSection[];
}

export type DocSection =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; text: string };

const CATEGORIES = [
  { id: 'getting-started', label: 'Getting Started', order: 0 },
  { id: 'architecture', label: 'Architecture', order: 1 },
  { id: 'personas', label: 'Personas', order: 2 },
  { id: 'reference', label: 'Reference', order: 3 },
] as const;

export { CATEGORIES };

export const docs: DocPage[] = [
  {
    slug: 'quickstart',
    title: 'Quickstart',
    description: 'Get a Great Minds agency running in under 5 minutes.',
    category: 'getting-started',
    order: 0,
    sections: [
      { type: 'paragraph', text: 'Great Minds turns a PRD into a shipped product using multiple AI agents. This guide gets you running in under 5 minutes.' },
      { type: 'heading', text: 'Prerequisites' },
      { type: 'list', items: [
        'Claude Code CLI (claude.ai/code)',
        'Node.js 20+',
        'A PRD (product requirements document) — even a rough one works',
      ]},
      { type: 'heading', text: 'Install' },
      { type: 'code', language: 'bash', code: 'git clone https://github.com/sethshoultes/great-minds.git\ncd great-minds\nnpm install' },
      { type: 'heading', text: 'Run Your First Agency' },
      { type: 'code', language: 'bash', code: 'bash launch.sh --prd your-prd.md' },
      { type: 'paragraph', text: 'The framework spawns a tmux session with the moderator (Marcus Aurelius) in the admin window and two directors (Steve Jobs, Elon Musk) in worker windows. They read your PRD, debate strategy, and start building.' },
    ],
  },
  {
    slug: 'how-it-works',
    title: 'How It Works',
    description: 'The four-phase agency workflow: Debate, Plan, Build, Review.',
    category: 'getting-started',
    order: 1,
    sections: [
      { type: 'paragraph', text: 'Every Great Minds session follows four phases. The moderator manages transitions between phases.' },
      { type: 'heading', text: 'Phase 1: Debate' },
      { type: 'paragraph', text: 'Directors stake independent positions on the PRD. Steve Jobs focuses on design and user experience. Elon Musk focuses on technical feasibility and growth. They challenge each other directly.' },
      { type: 'heading', text: 'Phase 2: Plan' },
      { type: 'paragraph', text: 'After debate, the moderator synthesizes decisions. Directors define their teams and assign sub-agents.' },
      { type: 'heading', text: 'Phase 3: Build' },
      { type: 'paragraph', text: 'Directors spawn sub-agents (up to 3 each) for parallel work. Sub-agents write code, tests, documentation. Directors review output and course-correct.' },
      { type: 'heading', text: 'Phase 4: Review' },
      { type: 'paragraph', text: 'Jensen Huang reviews all deliverables. Margaret Hamilton runs QA. Issues are filed and fixed before ship.' },
    ],
  },
  {
    slug: 'agent-architecture',
    title: 'Agent Architecture',
    description: 'How agents communicate, share memory, and coordinate work.',
    category: 'architecture',
    order: 0,
    sections: [
      { type: 'paragraph', text: 'Great Minds uses a shared-filesystem architecture. Agents run in separate tmux panes and communicate through /tmp/claude-shared/.' },
      { type: 'heading', text: 'Communication' },
      { type: 'paragraph', text: 'Agents send messages via tmux send-keys to the admin window. The moderator dispatches tasks by writing to /tmp/claude-shared/tasks/. Status updates go to /tmp/claude-shared/status/.' },
      { type: 'heading', text: 'Sub-Agents' },
      { type: 'paragraph', text: 'Directors use the Agent tool to spawn sub-agents. Each sub-agent runs in the background, completes its task, and returns a result. Directors can run up to 3 sub-agents in parallel.' },
      { type: 'code', language: 'typescript', code: '// Director spawning a sub-agent\nAgent({\n  description: "Write unit tests",\n  prompt: "Read src/services/ai.ts and write tests...",\n  model: "haiku",\n  run_in_background: true,\n})' },
    ],
  },
  {
    slug: 'memory-system',
    title: 'Memory System',
    description: 'How agents persist knowledge across sessions.',
    category: 'architecture',
    order: 1,
    sections: [
      { type: 'paragraph', text: 'Great Minds uses file-based memory stored in .claude/projects/. Memory types: user, feedback, project, reference.' },
      { type: 'heading', text: 'Memory Types' },
      { type: 'list', items: [
        'User — role, preferences, expertise level',
        'Feedback — corrections and validated approaches',
        'Project — ongoing work, deadlines, decisions',
        'Reference — pointers to external systems',
      ]},
      { type: 'heading', text: 'MEMORY.md Index' },
      { type: 'paragraph', text: 'Each memory file has frontmatter (name, description, type). MEMORY.md is a one-line-per-entry index loaded into every conversation.' },
    ],
  },
  {
    slug: 'creating-personas',
    title: 'Creating Personas',
    description: 'How to design and add custom AI personas to the agency.',
    category: 'personas',
    order: 0,
    sections: [
      { type: 'paragraph', text: 'Personas are stored in the personas/ directory. Each persona is a markdown file defining the agent\'s identity, expertise, communication style, and decision-making framework.' },
      { type: 'heading', text: 'Persona Template' },
      { type: 'code', language: 'markdown', code: '# PERSONA: Your Agent Name\n\n## Identity\nYou are [name], [role] at Great Minds Agency.\n\n## Expertise\n- Domain knowledge area 1\n- Domain knowledge area 2\n\n## Communication Style\n- How they speak\n- What they prioritize\n\n## Decision Framework\n- How they evaluate options' },
      { type: 'heading', text: 'Assigning Roles' },
      { type: 'paragraph', text: 'Roles are assigned in AGENTS.md. Each agent gets: a persona file, a worker window, and a set of deliverables they own.' },
    ],
  },
  {
    slug: 'cli-reference',
    title: 'CLI Reference',
    description: 'All launch.sh commands and configuration options.',
    category: 'reference',
    order: 0,
    sections: [
      { type: 'paragraph', text: 'The launch.sh script initializes the tmux session and starts all agents.' },
      { type: 'heading', text: 'Commands' },
      { type: 'code', language: 'bash', code: 'bash launch.sh --prd <file>     # Start agency with a PRD\nbash launch.sh --resume          # Resume previous session\nbash launch.sh --status          # Show agent status' },
      { type: 'heading', text: 'Environment Variables' },
      { type: 'list', items: [
        'ANTHROPIC_API_KEY — required for Claude API access',
        'GREAT_MINDS_MODEL — model override (default: opus)',
        'GREAT_MINDS_WORKERS — number of worker agents (default: 2)',
      ]},
    ],
  },
];

export function getDoc(slug: string): DocPage | undefined {
  return docs.find((d) => d.slug === slug);
}

export function getAllDocs(): DocPage[] {
  return [...docs].sort((a, b) => {
    const catOrder = CATEGORIES.findIndex((c) => c.id === a.category) - CATEGORIES.findIndex((c) => c.id === b.category);
    if (catOrder !== 0) return catOrder;
    return a.order - b.order;
  });
}

export function getAllDocSlugs(): string[] {
  return docs.map((d) => d.slug);
}

export function getDocsByCategory(): { category: string; label: string; docs: DocPage[] }[] {
  return CATEGORIES.map((cat) => ({
    category: cat.id,
    label: cat.label,
    docs: docs.filter((d) => d.category === cat.id).sort((a, b) => a.order - b.order),
  }));
}

export function getPrevNext(slug: string): { prev: DocPage | null; next: DocPage | null } {
  const sorted = getAllDocs();
  const idx = sorted.findIndex((d) => d.slug === slug);
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}
