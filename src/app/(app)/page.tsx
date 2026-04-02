'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ConversationThread, { type ThreadMessage } from '@/components/conversation/ConversationThread';
import Input from '@/components/shared/Input';
import {
  getConversation,
  createConversation,
  streamMessage,
  type Conversation,
  type Message,
  ApiError,
} from '@/lib/api';

function apiMessageToThread(msg: Message): ThreadMessage {
  return {
    id: msg.id,
    type:
      msg.role === 'user'
        ? 'user_message'
        : msg.type === 'approval'
          ? 'approval_card'
          : msg.type === 'report'
            ? 'report_card'
            : msg.type === 'review'
              ? 'approval_card'
              : 'system_message',
    content: msg.content,
    timestamp: formatTimestamp(msg.createdAt),
    metadata: msg.metadata,
  };
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Welcome message for empty conversations
const WELCOME_MESSAGE: ThreadMessage = {
  id: 'welcome',
  type: 'system_message',
  content:
    "Good morning! I'm LocalGenius — your marketing employee. I handle your website, reviews, social posts, and more. Just tell me what you need, and I'll take care of it. What can I help with today?",
  timestamp: 'Just now',
};

export default function AppPage() {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState('');
  const cancelStreamRef = useRef<(() => void) | null>(null);

  // Load or create conversation on mount
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        // Try to load existing conversation from localStorage
        const savedId = localStorage.getItem('lg_conversation_id');

        if (savedId) {
          const conv = await getConversation(savedId);
          if (mounted) {
            setConversationId(conv.id);
            setMessages(
              conv.messages.length > 0
                ? conv.messages.map(apiMessageToThread)
                : [WELCOME_MESSAGE],
            );
          }
        } else {
          const conv = await createConversation();
          if (mounted) {
            localStorage.setItem('lg_conversation_id', conv.id);
            setConversationId(conv.id);
            setMessages([WELCOME_MESSAGE]);
          }
        }
      } catch (err) {
        // Offline or API unavailable — show welcome with placeholder
        if (mounted) {
          setConversationId('local');
          setMessages([WELCOME_MESSAGE]);
        }
      }
    }

    init();
    return () => { mounted = false; };
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      if (!conversationId || !text.trim()) return;

      setError(null);
      const userMsg: ThreadMessage = {
        id: `user-${Date.now()}`,
        type: 'user_message',
        content: text,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setIsLoading(true);
      setStreamingContent('');

      // Stream AI response
      const cancel = streamMessage(
        conversationId,
        text,
        // onChunk — typewriter effect
        (chunk) => {
          setStreamingContent((prev) => prev + chunk);
        },
        // onComplete
        (message) => {
          setStreamingContent('');
          setIsLoading(false);
          setMessages((prev) => [...prev, apiMessageToThread(message)]);
        },
        // onError
        (err) => {
          setStreamingContent('');
          setIsLoading(false);

          if (err instanceof ApiError && err.status >= 500) {
            setError('Something went wrong. Tap to retry.');
          } else {
            // Fallback: add a simulated response for demo/offline
            const fallback: ThreadMessage = {
              id: `system-${Date.now()}`,
              type: 'system_message',
              content: `Got it — I'll handle that. Here's what I'm working on for you...`,
              timestamp: 'Just now',
            };
            setMessages((prev) => [...prev, fallback]);
          }
        },
      );

      cancelStreamRef.current = cancel;
    },
    [conversationId],
  );

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.type === 'user_message');
    if (lastUserMsg) {
      // Remove the failed attempt and retry
      setMessages((prev) => prev.filter((m) => m.id !== lastUserMsg.id));
      handleSend(lastUserMsg.content);
    }
  };

  // Build messages list including streaming content
  const displayMessages = [...messages];
  if (streamingContent) {
    displayMessages.push({
      id: 'streaming',
      type: 'system_message',
      content: streamingContent,
      timestamp: 'Just now',
    });
  }

  return (
    <div className="flex flex-col h-full bg-warm-white">
      {/* Error banner */}
      {error && (
        <button
          onClick={handleRetry}
          className="mx-screen-margin mt-2 px-4 py-3 bg-error-light text-error-dark text-body rounded-md text-left"
        >
          {error}
        </button>
      )}

      {/* Thread */}
      <ConversationThread
        messages={displayMessages}
        isLoading={isLoading && !streamingContent}
      />

      {/* Input bar — positioned above bottom nav via padding */}
      <div className="pb-[60px]">
        <Input
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSend}
          placeholder="Talk to LocalGenius..."
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
