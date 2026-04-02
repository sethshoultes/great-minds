'use client';

import { useState, useEffect } from 'react';
import WeeklyDigest from '@/components/digest/WeeklyDigest';
import { getDigest, type DigestData, ApiError } from '@/lib/api';

// Mock data for demo/offline
const MOCK_DIGEST: DigestData = {
  businessName: "Maria's Kitchen",
  ownerName: 'Maria',
  weekOf: 'March 24 – 30, 2026',
  highlights: [
    { label: 'website visits', value: '340', change: 'up 12%' },
    { label: 'new Google reviews', value: '4', change: 'all 4+ stars' },
    { label: 'bookings through your site', value: '23' },
  ],
  actions: [
    { description: 'Posted 3 times on Instagram and twice on Facebook.' },
    { description: 'Your Tuesday lunch special post reached 456 people — your best-performing post this month.' },
    { description: 'Responded to all 4 new reviews.' },
    { description: 'Updated your Google Business Profile with your new Saturday hours.' },
  ],
  recommendation: {
    text: "You haven't sent an email to past customers in 6 weeks. Want me to send a 'thinking of you' message to customers who haven't visited in 30+ days? I've drafted one for you.",
    actionType: 'email_campaign',
    actionId: 'campaign-001',
  },
  trendData: [
    { date: '2026-03-03', value: 210 },
    { date: '2026-03-10', value: 245 },
    { date: '2026-03-17', value: 305 },
    { date: '2026-03-24', value: 340 },
  ],
  trendMetric: 'Website visits',
};

type LoadState = 'loading' | 'loaded' | 'error' | 'empty';

export default function DigestPage() {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await getDigest();
        if (mounted) {
          setDigest(data);
          setLoadState('loaded');
        }
      } catch (err) {
        if (mounted) {
          // Use mock data as fallback
          setDigest(MOCK_DIGEST);
          setLoadState('loaded');
        }
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  // Loading skeleton
  if (loadState === 'loading') {
    return (
      <div className="digest-container px-screen-margin py-6 flex flex-col gap-section-gap">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-48 bg-cream rounded-sm loading-glow" />
          <div className="h-4 w-36 bg-cream rounded-sm loading-glow" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-subtle flex flex-col gap-card-gap">
            <div className="h-4 w-32 bg-cream rounded-sm loading-glow" />
            <div className="h-12 w-full bg-cream rounded-sm loading-glow" />
            <div className="h-12 w-3/4 bg-cream rounded-sm loading-glow" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (loadState === 'error') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-screen-margin">
        <p className="text-body text-charcoal text-center">
          Couldn&apos;t load your digest right now.
        </p>
        <button
          onClick={() => {
            setLoadState('loading');
            window.location.reload();
          }}
          className="text-body text-terracotta font-semibold"
        >
          Try again
        </button>
      </div>
    );
  }

  // Empty state (first week)
  if (!digest || loadState === 'empty') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-screen-margin text-center">
        <span className="text-[48px]">📊</span>
        <h2>Your first digest is on its way.</h2>
        <p className="text-body text-slate max-w-[320px]">
          I&apos;m gathering data on your business this week. Your first Weekly Digest will arrive Monday at 7am.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <WeeklyDigest
        businessName={digest.businessName}
        ownerName={digest.ownerName}
        weekOf={digest.weekOf}
        highlights={digest.highlights}
        actions={digest.actions}
        recommendation={
          digest.recommendation
            ? {
                text: digest.recommendation.text,
                primaryAction: {
                  label: 'Send It',
                  onPress: () => {
                    // TODO: POST to campaign endpoint
                  },
                },
                secondaryAction: {
                  label: 'Skip',
                  onPress: () => {
                    // TODO: dismiss recommendation
                  },
                },
              }
            : null
        }
      />
    </div>
  );
}
