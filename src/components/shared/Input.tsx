'use client';

import { useState, useRef, type KeyboardEvent } from 'react';

interface InputProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit: (text: string) => void;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function Input({
  value,
  onChange,
  onSubmit,
  onVoiceStart,
  onVoiceEnd,
  placeholder = 'Talk to LocalGenius...',
  disabled = false,
}: InputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit(value.trim());
      }
    }
  };

  const handleMicPress = () => {
    setIsRecording(true);
    onVoiceStart?.();
  };

  const handleMicRelease = () => {
    setIsRecording(false);
    onVoiceEnd?.();
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t safe-area-bottom"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-end gap-2 px-screen-margin py-2">
        {/* Text input — auto-grows */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            // Auto-grow
            if (textareaRef.current) {
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={[
            'flex-1 resize-none',
            'min-h-tap-min max-h-[120px]',
            'px-[var(--space-input-padding-x)] py-[var(--space-input-padding-y)]',
            'text-body text-charcoal placeholder:text-slate-light',
            'bg-cream rounded-md',
            'border border-transparent focus:border-terracotta',
            'outline-none transition-colors duration-fast',
          ].join(' ')}
          aria-label="Message input"
        />

        {/* Mic button */}
        <button
          onMouseDown={handleMicPress}
          onMouseUp={handleMicRelease}
          onTouchStart={handleMicPress}
          onTouchEnd={handleMicRelease}
          className={[
            'flex-shrink-0 flex items-center justify-center',
            'w-[var(--tap-target-min)] h-[var(--tap-target-min)]',
            'rounded-full transition-colors duration-instant',
            isRecording ? 'bg-terracotta-light text-terracotta' : 'text-slate hover:text-charcoal',
          ].join(' ')}
          aria-label={isRecording ? 'Recording... release to send' : 'Hold to record voice message'}
        >
          {/* Mic icon (Lucide Mic placeholder) */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
          {isRecording && (
            <span className="absolute w-2 h-2 bg-terracotta rounded-full animate-pulse-glow" />
          )}
        </button>

        {/* Send button — visible only when there's text */}
        {value.trim().length > 0 && (
          <button
            onClick={() => onSubmit(value.trim())}
            disabled={disabled}
            className={[
              'flex-shrink-0 flex items-center justify-center',
              'w-[var(--tap-target-min)] h-[var(--tap-target-min)]',
              'bg-terracotta text-white rounded-full',
              'hover:bg-terracotta-hover active:scale-95',
              'transition-all duration-instant',
              'disabled:opacity-40',
            ].join(' ')}
            aria-label="Send message"
          >
            {/* Arrow up icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" x2="12" y1="19" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
