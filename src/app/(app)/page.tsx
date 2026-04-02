'use client';

import { useState } from 'react';
import ConversationThread, { type ThreadMessage } from '@/components/conversation/ConversationThread';
import WeeklyDigest from '@/components/digest/WeeklyDigest';
import Input from '@/components/shared/Input';

type ActiveTab = 'thread' | 'digest';

// Placeholder messages demonstrating the thread UI
const INITIAL_MESSAGES: ThreadMessage[] = [
  {
    id: '1',
    type: 'system_message',
    content:
      "Your site is live at mariaskitchenatx.com — 3 people have already visited. I'll post your first social update tomorrow morning. In the meantime, I drafted responses to your 2 most recent Google reviews. Want to take a look?",
    timestamp: '2 minutes ago',
  },
  {
    id: '2',
    type: 'approval_card',
    content:
      "I drafted a response to your new 5-star review from Jake R. He loved the brisket tacos.",
    timestamp: '1 minute ago',
    metadata: {
      title: 'Review response for Jake R. ⭐⭐⭐⭐⭐',
      primaryLabel: 'Approve',
      secondaryLabel: 'Edit',
      status: 'pending',
    },
  },
  {
    id: '3',
    type: 'approval_card',
    content:
      "Here's a post for your lunch special. I'll put it on Instagram and Facebook at 11:30am — right before the lunch crowd starts searching.",
    timestamp: 'Just now',
    metadata: {
      title: 'Social post: lunch special',
      primaryLabel: 'Schedule for 11:30am',
      secondaryLabel: 'Edit',
      status: 'pending',
    },
  },
];

// Placeholder digest data
const DIGEST_DATA = {
  businessName: "Maria's Kitchen",
  ownerName: 'Maria',
  weekOf: 'March 24 – 30, 2026',
  highlights: [
    { value: '340', label: 'website visits', change: 'up 12%' },
    { value: '4', label: 'new Google reviews', change: 'all 4+ stars' },
    { value: '23', label: 'bookings' },
  ],
  actions: [
    { description: 'Posted 3 times on Instagram and twice on Facebook.' },
    { description: 'Your Tuesday lunch special post reached 456 people — your best-performing post this month.' },
    { description: 'Responded to all 4 new reviews.' },
    { description: 'Updated your Google Business Profile with your new Saturday hours.' },
  ],
  recommendation: {
    text: "You haven't sent an email to past customers in 6 weeks. Want me to send a 'thinking of you' message to customers who haven't visited in 30+ days? I've drafted one for you.",
    primaryAction: { label: 'Send It', onPress: () => {} },
    secondaryAction: { label: 'Skip', onPress: () => {} },
  },
};

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('thread');
  const [messages, setMessages] = useState<ThreadMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (text: string) => {
    // Add user message
    const userMsg: ThreadMessage = {
      id: `user-${Date.now()}`,
      type: 'user_message',
      content: text,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Simulate system response
    setTimeout(() => {
      const systemMsg: ThreadMessage = {
        id: `system-${Date.now()}`,
        type: 'system_message',
        content: `Got it. I'll handle that for you. Here's what I'm thinking...`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, systemMsg]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col bg-warm-white">
      {/* Header */}
      <header className="safe-area-top flex items-center justify-between px-screen-margin py-3 bg-white border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <h1 className="text-h2 text-charcoal">Maria&apos;s Kitchen</h1>
          <p className="text-caption text-sage">Everything&apos;s handled</p>
        </div>
      </header>

      {/* Content area */}
      {activeTab === 'thread' ? (
        <ConversationThread messages={messages} isLoading={isLoading} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <WeeklyDigest {...DIGEST_DATA} />
        </div>
      )}

      {/* Input bar (thread only) */}
      {activeTab === 'thread' && (
        <div className="mb-[60px]">
          <Input
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSend}
            placeholder="Talk to LocalGenius..."
          />
        </div>
      )}

      {/* Bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 safe-area-bottom flex items-center justify-around bg-white border-t"
        style={{ borderColor: 'var(--border-subtle)', height: '60px' }}
        role="tablist"
        aria-label="Main navigation"
      >
        <button
          onClick={() => setActiveTab('thread')}
          className={[
            'flex flex-col items-center justify-center gap-1',
            'w-[var(--tap-target-nav)] h-[var(--tap-target-nav)]',
            'transition-colors duration-instant',
            activeTab === 'thread' ? 'text-terracotta' : 'text-slate',
          ].join(' ')}
          role="tab"
          aria-selected={activeTab === 'thread'}
          aria-label="Thread"
        >
          {/* Message icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'thread' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-small">Thread</span>
        </button>

        <button
          onClick={() => setActiveTab('digest')}
          className={[
            'flex flex-col items-center justify-center gap-1',
            'w-[var(--tap-target-nav)] h-[var(--tap-target-nav)]',
            'transition-colors duration-instant relative',
            activeTab === 'digest' ? 'text-terracotta' : 'text-slate',
          ].join(' ')}
          role="tab"
          aria-selected={activeTab === 'digest'}
          aria-label="Weekly Digest"
        >
          {/* Trending up icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          <span className="text-small">Digest</span>
        </button>
      </nav>
    </div>
  );
}
