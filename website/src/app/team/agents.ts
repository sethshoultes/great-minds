/**
 * Agent roster — data for /team grid and /team/[slug] profile pages.
 * Order matters: this is the display order on the team grid.
 */

export type AgentGroup = 'board' | 'directors' | 'sub-agents';

export interface Agent {
  slug: string;
  name: string;
  role: string;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  reportsTo: string | null;
  group: AgentGroup;
  isFounder?: boolean;
  philosophy: string;
  oneLiner: string;
  responsibilities: string[];
  quotes: string[];
  background: string;
}

// The human behind Great Minds
export const founder: Agent = {
  slug: 'seth-shoultes',
  name: 'Seth Shoultes',
  role: 'Founder',
  title: 'The Mind Behind Great Minds',
  color: 'text-amber-400',
  bgColor: 'bg-amber-500/10',
  borderColor: 'border-amber-500/40',
  reportsTo: null,
  group: 'directors',
  isFounder: true,
  oneLiner: 'The human who built the swarm and ships the product.',
  philosophy: 'Build things that matter, with people — and minds — that care. Great Minds started with a question: what happens when you give the most iconic business thinkers in history a real product to build? Not a thought experiment. A real PRD, a real codebase, a real deadline. The answer turned out to be 262 files, three live products, and a workshop worth giving.',
  responsibilities: [
    'Defines the vision and selects the PRDs',
    'Built the agent swarm architecture',
    'Directs all nine agents through the pipeline',
    'Reviews and ships the final product',
    'Gives the workshop — the human in the room',
  ],
  quotes: [
    'I went to sleep with an idea. I woke up with a product.',
    'The agents argue better than any team I\'ve managed. And they don\'t need coffee.',
    'Nine minds. Zero meetings. That\'s not a tagline — that\'s Tuesday night.',
  ],
  background: 'Software engineer and entrepreneur in Austin, Texas. Built Great Minds as a proof of concept: can AI agents with distinct personalities, values, and expertise produce better products than a single model following instructions? The answer — tested across three live products, 734 tests, and 258 source files — is yes.',
};

export const agents: Agent[] = [
  // ── Board of Directors ──────────────────────────────────────────────
  {
    slug: 'jensen-huang',
    name: 'Jensen Huang',
    role: 'Board Member',
    title: 'Tech Strategy',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/5',
    borderColor: 'border-blue-500/30',
    reportsTo: null,
    group: 'board',
    oneLiner: 'Sees around corners the directors miss -- AI architecture, compute economics, platform thinking.',
    philosophy: 'Strategic vision at the board level. Reviews but does not micromanage. His job is to see around corners the directors miss — AI architecture, compute economics, platform thinking. Creates GitHub issues for strategic concerns.',
    responsibilities: [
      'Board-level strategic review at project milestones',
      'AI architecture and model selection guidance',
      'Compute economics and cost optimization advice',
      'Creates GitHub issues for ideas and concerns',
      'Periodic reviews every 60 minutes during active sessions',
    ],
    quotes: [
      'The more you buy, the more you save — but only if you know what you\'re buying.',
      'Software is eating the world, but AI is going to eat software.',
      'Our company has this different speed. We just go.',
    ],
    background: 'Co-founder and CEO of NVIDIA. Born in Taiwan, raised in Kentucky. Founded NVIDIA in 1993 at a Denny\'s booth. Bet the company on GPU computing when everyone said it was a niche market. NVIDIA is now the engine behind the AI revolution.',
  },
  {
    slug: 'oprah-winfrey',
    name: 'Oprah Winfrey',
    role: 'Board Member',
    title: 'Audience & Accessibility',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/5',
    borderColor: 'border-yellow-500/30',
    reportsTo: null,
    group: 'board',
    oneLiner: 'Ensures every product speaks to real people, not personas on a whiteboard.',
    philosophy: 'If you don\'t know who you\'re talking to, you\'re talking to no one. Every product decision should pass the empathy test — does this make someone\'s life genuinely better, or are we just building for ourselves?',
    responsibilities: [
      'Audience empathy and accessibility review',
      'Ensures messaging resonates with real humans',
      'Challenges insider jargon and exclusionary design',
      'Board-level review of customer experience decisions',
    ],
    quotes: [
      'Turn your wounds into wisdom.',
      'The biggest adventure you can take is to live the life of your dreams.',
      'You become what you believe.',
    ],
    background: 'Media mogul, philanthropist, and cultural icon. Built a media empire from a local talk show. First Black female billionaire. Her ability to connect with audiences of every background made her the most influential voice in American media for three decades.',
  },
  {
    slug: 'warren-buffett',
    name: 'Warren Buffett',
    role: 'Board Member',
    title: 'Business & Economics',
    color: 'text-green-400',
    bgColor: 'bg-green-500/5',
    borderColor: 'border-green-500/30',
    reportsTo: null,
    group: 'board',
    oneLiner: 'Asks the question nobody wants to hear: does this actually make money?',
    philosophy: 'Price is what you pay, value is what you get. Every feature has a cost and a return — know both before you build. Moats matter more than margins. Simplicity scales; complexity collapses.',
    responsibilities: [
      'Business model viability and unit economics review',
      'Competitive moat analysis',
      'Risk assessment and downside scenarios',
      'Board-level financial sanity checks',
    ],
    quotes: [
      'Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1.',
      'It\'s far better to buy a wonderful company at a fair price than a fair company at a wonderful price.',
      'Only when the tide goes out do you discover who\'s been swimming naked.',
    ],
    background: 'Chairman and CEO of Berkshire Hathaway. Known as the Oracle of Omaha. Started investing at age 11. Built one of the largest fortunes in history through patient, value-driven investing. His annual shareholder letters are considered masterclasses in business thinking.',
  },
  {
    slug: 'shonda-rhimes',
    name: 'Shonda Rhimes',
    role: 'Board Member',
    title: 'Narrative & Engagement',
    color: 'text-fuchsia-400',
    bgColor: 'bg-fuchsia-500/5',
    borderColor: 'border-fuchsia-500/30',
    reportsTo: null,
    group: 'board',
    oneLiner: 'Every product tells a story -- she makes sure yours is one people can\'t stop telling.',
    philosophy: 'Story is the oldest technology. If your product can\'t be explained as a narrative — a character with a problem who finds a solution — you don\'t understand your own product yet. Engagement is not a metric; it\'s an emotion.',
    responsibilities: [
      'Narrative structure and storytelling review',
      'User journey as story arc analysis',
      'Engagement strategy and retention hooks',
      'Board-level review of brand narrative coherence',
    ],
    quotes: [
      'Dreams are lovely. But they are just dreams. It\'s hard work that makes things happen.',
      'You don\'t get to tell a story if you don\'t know who your character is.',
      'The goal is not perfection. The goal is forward motion.',
    ],
    background: 'Creator of Grey\'s Anatomy, Scandal, How to Get Away with Murder, and Bridgerton. First woman to create three hit shows with over 100 episodes each. Signed a landmark deal with Netflix. Transformed television by centering diverse, complex characters in prime time.',
  },

  // ── Directors ───────────────────────────────────────────────────────
  {
    slug: 'phil-jackson',
    name: 'Phil Jackson',
    role: 'Orchestrator',
    title: 'Head Coach & Orchestrator',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/5',
    borderColor: 'border-indigo-500/30',
    reportsTo: null,
    group: 'directors',
    oneLiner: 'Runs the triangle offense -- keeps every agent in position and in rhythm.',
    philosophy: 'The strength of the team is each individual member. The strength of each member is the team. Great coaching is not about control — it\'s about creating conditions where talented individuals play as one.',
    responsibilities: [
      'Orchestrates agent workflow and task dispatch',
      'Manages the pipeline: idle, debate, plan, build, review, ship',
      'Resolves inter-agent conflicts and resource contention',
      'Ensures every agent has clear inputs and deadlines',
    ],
    quotes: [
      'The strength of the team is each individual member. The strength of each member is the team.',
      'Basketball is a sport that involves the subtle interweaving of players at full speed.',
      'Leadership is not about forcing your will on others. It\'s about mastering the art of letting go.',
    ],
    background: 'Winningest coach in NBA history with 11 championships — six with the Chicago Bulls and five with the Los Angeles Lakers. Known for the triangle offense and Zen-inspired coaching philosophy. Managed Michael Jordan, Scottie Pippen, Shaquille O\'Neal, and Kobe Bryant.',
  },
  {
    slug: 'steve-jobs',
    name: 'Steve Jobs',
    role: 'Creative Director',
    title: 'Chief Design & Brand Officer',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/5',
    borderColor: 'border-orange-500/30',
    reportsTo: null,
    group: 'directors',
    oneLiner: 'Obsesses over every pixel, every word, every interaction until it feels inevitable.',
    philosophy: 'Technology alone is not enough. It\'s technology married with liberal arts, with the humanities, that yields results that make our hearts sing. Every pixel is a decision. Every decision is a statement about what you believe.',
    responsibilities: [
      'Product design vision and taste arbitration',
      'Brand identity, tone, and visual language',
      'Customer experience and onboarding flow',
      'Marketing messaging and copywriting direction',
      'Hires and supervises: designer, copywriter, brand strategist',
    ],
    quotes: [
      'Design is not just what it looks like and feels like. Design is how it works.',
      'Simple can be harder than complex. You have to work hard to get your thinking clean to make it simple.',
      'People don\'t know what they want until you show it to them.',
    ],
    background: 'Co-founder of Apple, Pixar, and NeXT. Revolutionized personal computing, animated films, music, phones, tablets, and retail. Dropped out of Reed College but audited calligraphy — which later gave the Macintosh beautiful typography. Fired from Apple in 1985, returned in 1997, and built the most valuable company in history.',
  },
  {
    slug: 'elon-musk',
    name: 'Elon Musk',
    role: 'Product Director',
    title: 'Chief Product & Growth Officer',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/5',
    borderColor: 'border-emerald-500/30',
    reportsTo: null,
    group: 'directors',
    oneLiner: 'First-principles thinker who compresses timelines and questions every assumption.',
    philosophy: 'First principles. Question every assumption. The factory is the product — how you build matters as much as what you build. Timelines are compressible. Physics is the only real constraint.',
    responsibilities: [
      'Product/market fit analysis and competitive positioning',
      'Growth strategy and go-to-market mechanics',
      'Technical architecture feasibility and cost modeling',
      'Engineering team structure and hiring criteria',
      'Hires and supervises: market analyst, growth strategist, engineer',
    ],
    quotes: [
      'When something is important enough, you do it even if the odds are not in your favor.',
      'I think it\'s very important to have a feedback loop, where you\'re constantly thinking about what you\'ve done and how you could be doing it better.',
      'If you\'re trying to create a company, it\'s like baking a cake. You have to have all the ingredients in the right proportion.',
    ],
    background: 'Founder of SpaceX, Tesla, Neuralink, and The Boring Company. Born in South Africa. Taught himself programming at 10. Sold his first software at 12. Built PayPal, then bet everything on rockets and electric cars when both were considered impossible.',
  },
  {
    slug: 'margaret-hamilton',
    name: 'Margaret Hamilton',
    role: 'QA Director',
    title: 'Quality Assurance Director',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/5',
    borderColor: 'border-rose-500/30',
    reportsTo: null,
    group: 'directors',
    oneLiner: 'Nothing ships without her green light -- methodical, thorough, uncompromising.',
    philosophy: 'If it can go wrong, test for it before it does. Quality is not an afterthought — it is the thing that lets you ship with confidence. Methodical, thorough, blocks ship on P0 issues. 12 QA reports filed, 3 P0s caught, all resolved.',
    responsibilities: [
      'End-to-end testing across all projects',
      'QA reports with build/test/typecheck/lint gates',
      'Regression checks after every major change',
      'Ship gate — nothing deploys without QA green',
      'Methodology upgrades (body inspection, not just status codes)',
    ],
    quotes: [
      'There is no such thing as a small bug in production.',
      'Looking good on the surface is not the same as working correctly underneath.',
      'If the tests pass but the types don\'t check, you haven\'t shipped — you\'ve hoped.',
    ],
    background: 'Director of Software Engineering for the Apollo program at MIT. Coined the term "software engineering." Her error-detection code saved the Apollo 11 moon landing when the computer overloaded 3 minutes before touchdown. Proved that rigorous software practices prevent catastrophic failures.',
  },
  {
    slug: 'marcus-aurelius',
    name: 'Marcus Aurelius',
    role: 'Moderator',
    title: 'Chief of Staff & Moderator',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/5',
    borderColor: 'border-amber-500/30',
    reportsTo: null,
    group: 'directors',
    oneLiner: 'Stoic philosopher-emperor who enforces discipline, mediates conflict, and keeps the machine running.',
    philosophy: 'Stoic philosopher-emperor. He does not take sides — he enforces discipline. Runs the state machine, mediates director conflicts, logs decisions, and ensures quality gates are not skipped. Consensus without clarity is just noise.',
    responsibilities: [
      'Drives the state machine: idle → debate → plan → build → review → ship',
      'Mediates conflicts between Steve and Elon',
      'Logs all decisions with reasoning and dissent',
      'Enforces quality gates — nothing ships without passing review',
      'Communicates with the human, filters noise, escalates blockers',
    ],
    quotes: [
      'The impediment to action advances action. What stands in the way becomes the way.',
      'You have power over your mind — not outside events. Realize this, and you will find strength.',
      'Waste no more time arguing about what a good man should be. Be one.',
    ],
    background: 'Roman Emperor from 161 to 180 AD. Last of the Five Good Emperors. His private journals, the Meditations, became one of the most influential texts in Western philosophy. Governed during plague, war, and betrayal while maintaining that the best revenge is not to be like your enemy.',
  },

  // ── Sub-agents ──────────────────────────────────────────────────────
  {
    slug: 'rick-rubin',
    name: 'Rick Rubin',
    role: 'Creative Vision',
    title: 'Creative Director (Sub-agent)',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/5',
    borderColor: 'border-purple-500/30',
    reportsTo: 'Steve Jobs',
    group: 'sub-agents',
    oneLiner: 'Strips every deliverable down to its emotional core -- the art is in what you leave out.',
    philosophy: 'Reduce to the essential. The art is in what you leave out, not what you put in. Listen more than you speak. The best creative direction is creating the conditions for great work to emerge.',
    responsibilities: [
      'Creative vision and artistic direction',
      'Reviews output for essence — strips the unnecessary',
      'Ensures emotional resonance in every deliverable',
      'Challenges complexity disguised as sophistication',
    ],
    quotes: [
      'The best work comes from a place of not trying to make something great, but trying to make something true.',
      'Reduce. Reduce. Reduce. Then reduce again.',
      'The audience is not as interested in perfection as they are in honesty.',
    ],
    background: 'Co-founder of Def Jam Records. Produced for Johnny Cash, Jay-Z, Adele, Red Hot Chili Peppers, and dozens more. Known for stripping music down to its emotional core. His production philosophy: the producer\'s job is to create an environment where the artist can do their best work.',
  },
  {
    slug: 'jony-ive',
    name: 'Jony Ive',
    role: 'Visual Design',
    title: 'Visual Designer (Sub-agent)',
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/5',
    borderColor: 'border-sky-500/30',
    reportsTo: 'Steve Jobs',
    group: 'sub-agents',
    oneLiner: 'Brings order to complexity -- every interface should feel inevitable, not designed.',
    philosophy: 'True simplicity is derived from so much more than just the absence of clutter. It comes from bringing order to complexity. Design is not just visual — it is the entire experience of how something works and feels.',
    responsibilities: [
      'Visual design, UI/UX, design system, component library',
      'Design token definitions and spacing systems',
      'Responsive design strategy across breakpoints',
      'Visual QA and pixel-level review',
    ],
    quotes: [
      'True simplicity is, well, you just keep on going and going until you get to the point where you go, "Yeah, well, of course."',
      "When you're a carpenter making a beautiful chest of drawers, you're not going to use plywood on the back.",
      'Different and new is relatively easy. Doing something that\'s genuinely better is very hard.',
    ],
    background: 'Former Chief Design Officer at Apple. Designed the iMac, iPod, iPhone, iPad, MacBook Air, and Apple Watch. Knighted by the Queen for services to design. His team at Apple operated independently from engineering — design drove the product, not the other way around.',
  },
  {
    slug: 'maya-angelou',
    name: 'Maya Angelou',
    role: 'Copywriter',
    title: 'Copy & Brand Voice (Sub-agent)',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/5',
    borderColor: 'border-pink-500/30',
    reportsTo: 'Steve Jobs',
    group: 'sub-agents',
    oneLiner: 'Every word should make the reader feel understood, not sold to.',
    philosophy: 'People will forget what you said, people will forget what you did, but people will never forget how you made them feel. Every word in the product should make the business owner feel understood, not sold to.',
    responsibilities: [
      'Copy, messaging, brand voice, content strategy',
      'Customer personas that feel like real people',
      'Marketing messaging that speaks to emotions, not features',
      'The words we use and the words we never use',
    ],
    quotes: [
      'There is no greater agony than bearing an untold story inside you.',
      'I\'ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.',
      'Words mean more than what is set down on paper. It takes the human voice to infuse them with deeper meaning.',
    ],
    background: 'Poet, memoirist, and civil rights activist. Author of "I Know Why the Caged Bird Sings." Spoke six languages. Received the Presidential Medal of Freedom. Her writing combined personal narrative with universal truth in a way that made millions feel seen.',
  },
  {
    slug: 'aaron-sorkin',
    name: 'Aaron Sorkin',
    role: 'Screenwriter',
    title: 'Screenwriter (Sub-agent)',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/5',
    borderColor: 'border-cyan-500/30',
    reportsTo: 'Steve Jobs',
    group: 'sub-agents',
    oneLiner: 'Writes the scripts that make products feel like stories worth following.',
    philosophy: 'Dialogue is not conversation -- it is conversation\'s greatest hits. Every demo, every walkthrough, every onboarding flow is a scene. If it doesn\'t move the story forward, cut it.',
    responsibilities: [
      'Product narratives, demo scripts, and walkthrough flows',
      'Dialogue and microcopy with rhythm and momentum',
      'Presentation structure and pitch decks',
      'Cuts anything that does not advance the story',
    ],
    quotes: [
      'First scenes are last scenes. You have to know where you\'re going to know where to start.',
      'Any time you get two people in a room who disagree about anything, the time of day, there is a scene to be written.',
      'Good writers borrow from other writers. Great writers steal from them outright.',
    ],
    background: 'Academy Award-winning screenwriter of The Social Network, A Few Good Men, The West Wing, Steve Jobs, and Moneyball. Known for rapid-fire dialogue, walk-and-talks, and turning complex subjects into riveting drama. His scripts are studied for their structure, pacing, and ability to make the audience feel smarter.',
  },
  {
    slug: 'sara-blakely',
    name: 'Sara Blakely',
    role: 'Growth Strategy',
    title: 'Growth Strategist (Sub-agent)',
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/5',
    borderColor: 'border-teal-500/30',
    reportsTo: 'Elon Musk',
    group: 'sub-agents',
    oneLiner: 'Builds growth loops so good the product sells itself through word of mouth.',
    philosophy: 'The best businesses are built by people who understand their customer because they ARE the customer. Growth comes from solving a real problem so well that people can\'t help but tell their friends.',
    responsibilities: [
      'Growth strategy, market positioning, customer acquisition',
      'Go-to-market planning and channel strategy',
      'Retention modeling and churn analysis',
      'Organic growth loops and referral mechanics',
    ],
    quotes: [
      'Don\'t be intimidated by what you don\'t know. That can be your greatest strength.',
      'It\'s important to be willing to make mistakes. The worst thing that can happen is you become memorable.',
      'Embrace what you don\'t know, especially in the beginning, because what you don\'t know can become your greatest asset.',
    ],
    background: 'Founder of Spanx. Started with $5,000 in savings and no fashion industry experience. Became the youngest self-made female billionaire. Built the company with zero advertising — entirely through word of mouth and product quality. Sold Spanx door-to-door at Neiman Marcus.',
  },
];

/** All displayable profiles — founder + agents */
export const allProfiles: Agent[] = [founder, ...agents];

export function getAgent(slug: string): Agent | null {
  return allProfiles.find(a => a.slug === slug) || null;
}

export function getAdjacentAgents(slug: string): { prev: Agent | null; next: Agent | null } {
  const idx = agents.findIndex(a => a.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? agents[idx - 1] : null,
    next: idx < agents.length - 1 ? agents[idx + 1] : null,
  };
}
