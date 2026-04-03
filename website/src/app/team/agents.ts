/**
 * Agent roster — data for /team grid and /team/[slug] profile pages.
 * Order matters: this is the display order on the team grid.
 */

export interface Agent {
  slug: string;
  name: string;
  role: string;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  reportsTo: string | null;
  philosophy: string;
  responsibilities: string[];
  quotes: string[];
  background: string;
}

export const agents: Agent[] = [
  {
    slug: 'marcus-aurelius',
    name: 'Marcus Aurelius',
    role: 'Moderator',
    title: 'Chief of Staff',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/5',
    borderColor: 'border-amber-500/30',
    reportsTo: null,
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
  {
    slug: 'steve-jobs',
    name: 'Steve Jobs',
    role: 'Creative Director',
    title: 'Chief Design & Brand Officer',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/5',
    borderColor: 'border-orange-500/30',
    reportsTo: null,
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
    slug: 'jensen-huang',
    name: 'Jensen Huang',
    role: 'Board Advisor',
    title: 'Strategic Advisor',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/5',
    borderColor: 'border-blue-500/30',
    reportsTo: null,
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
    slug: 'margaret-hamilton',
    name: 'Margaret Hamilton',
    role: 'QA Director',
    title: 'Quality Assurance Director',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/5',
    borderColor: 'border-rose-500/30',
    reportsTo: null,
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
    slug: 'rick-rubin',
    name: 'Rick Rubin',
    role: 'Creative Vision',
    title: 'Creative Director (Sub-agent)',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/5',
    borderColor: 'border-purple-500/30',
    reportsTo: 'Steve Jobs',
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
    slug: 'sara-blakely',
    name: 'Sara Blakely',
    role: 'Growth Strategy',
    title: 'Growth Strategist (Sub-agent)',
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/5',
    borderColor: 'border-teal-500/30',
    reportsTo: 'Elon Musk',
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

export function getAgent(slug: string): Agent | null {
  return agents.find(a => a.slug === slug) || null;
}

export function getAdjacentAgents(slug: string): { prev: Agent | null; next: Agent | null } {
  const idx = agents.findIndex(a => a.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? agents[idx - 1] : null,
    next: idx < agents.length - 1 ? agents[idx + 1] : null,
  };
}
