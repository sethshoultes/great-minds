'use client';

import { useState } from 'react';
import Button from '../shared/Button';

type ApprovalStatus = 'pending' | 'approved' | 'dismissed' | 'published' | 'scheduled';

interface ApprovalCardProps {
  title: string;
  description: string;
  preview?: React.ReactNode;
  primaryAction: { label: string; onPress: () => void };
  secondaryAction: { label: string; onPress: () => void };
  status?: ApprovalStatus;
  timestamp: string;
}

export default function ApprovalCard({
  title,
  description,
  preview,
  primaryAction,
  secondaryAction,
  status: initialStatus = 'pending',
  timestamp,
}: ApprovalCardProps) {
  const [status, setStatus] = useState<ApprovalStatus>(initialStatus);
  const [animating, setAnimating] = useState(false);

  const handleApprove = () => {
    setAnimating(true);
    primaryAction.onPress();
    setTimeout(() => {
      setStatus('approved');
      setAnimating(false);
    }, 300);
  };

  if (status === 'dismissed') return null;

  return (
    <article
      className="card animate-in flex flex-col gap-card-gap"
      aria-label={`Action requiring your approval: ${title}`}
    >
      {/* Title */}
      <h3 className="text-h2 text-charcoal">{title}</h3>

      {/* Description */}
      <p className="text-body text-charcoal">{description}</p>

      {/* Optional preview */}
      {preview && (
        <div className="rounded-sm overflow-hidden">
          {preview}
        </div>
      )}

      {/* Actions or status */}
      {status === 'pending' ? (
        <div className="flex gap-3">
          <div className="flex-[3]">
            <Button
              variant="primary"
              label={primaryAction.label}
              onClick={handleApprove}
              fullWidth
            />
          </div>
          <div className="flex-[2]">
            <Button
              variant="secondary"
              label={secondaryAction.label}
              onClick={secondaryAction.onPress}
              fullWidth
            />
          </div>
        </div>
      ) : (
        <div
          className={[
            'flex items-center gap-2 py-2 text-body font-semibold',
            'transition-all duration-normal',
            animating ? 'ease-spring' : '',
            status === 'approved' ? 'text-sage' : 'text-slate',
          ].join(' ')}
          aria-live="polite"
        >
          {/* Checkmark */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-sage"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {status === 'approved' && 'Approved'}
          {status === 'published' && 'Posted'}
          {status === 'scheduled' && 'Scheduled'}
        </div>
      )}

      {/* Timestamp */}
      <span className="text-caption text-slate">{timestamp}</span>
    </article>
  );
}
