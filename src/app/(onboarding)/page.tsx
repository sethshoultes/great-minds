'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';

type OnboardingStep = 1 | 2 | 3 | 4 | 5;
type Priority = 'seo' | 'reviews' | 'social';

interface OnboardingState {
  businessName: string;
  businessType: string;
  city: string;
  photos: string[];
  description: string;
  priority: Priority | null;
}

const BUSINESS_TYPES = [
  { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { id: 'salon', label: 'Salon', icon: '💇' },
  { id: 'dental', label: 'Dental', icon: '🦷' },
  { id: 'medical', label: 'Medical', icon: '🏥' },
  { id: 'home-services', label: 'Home Services', icon: '🔧' },
  { id: 'fitness', label: 'Fitness', icon: '🏋️' },
  { id: 'retail', label: 'Retail', icon: '🛍️' },
  { id: 'other', label: 'Other', icon: '📦' },
];

const PRIORITIES = [
  { id: 'seo' as Priority, icon: '🔍', label: 'Get found online', sublabel: 'I need people to find me on Google' },
  { id: 'reviews' as Priority, icon: '⭐', label: 'Manage my reviews', sublabel: 'I need help with reviews and reputation' },
  { id: 'social' as Priority, icon: '📱', label: 'Stay active on social', sublabel: 'I need to post more consistently' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [state, setState] = useState<OnboardingState>({
    businessName: '',
    businessType: '',
    city: 'Austin, TX',
    photos: [],
    description: '',
    priority: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const progress = step / 5;

  const goNext = () => setStep((s) => Math.min(s + 1, 5) as OnboardingStep);
  const goBack = () => setStep((s) => Math.max(s - 1, 1) as OnboardingStep);

  return (
    <div className="min-h-screen bg-warm-white flex flex-col">
      {/* Progress bar */}
      <div className="h-[3px] bg-cream w-full">
        <div
          className="h-full bg-terracotta transition-all duration-normal ease-default"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Back button (Steps 2-4) */}
      {step > 1 && step < 5 && (
        <button
          onClick={goBack}
          className="self-start px-screen-margin pt-4 text-body text-slate hover:text-charcoal transition-colors"
          aria-label="Go back"
        >
          ← Back
        </button>
      )}

      {/* Step content */}
      <div className="flex-1 flex flex-col px-screen-margin py-8">
        {/* ============================================================
         * STEP 1: Tell me about your business
         * ============================================================ */}
        {step === 1 && (
          <div className="flex flex-col gap-8 flex-1">
            <div>
              <h1 className="text-h1 text-charcoal">
                Let&apos;s get your business set up.
              </h1>
              <p className="text-body text-charcoal mt-2">
                I just need a few things from you — this will take about five minutes.
              </p>
            </div>

            {/* Business name input */}
            <input
              type="text"
              value={state.businessName}
              onChange={(e) => setState({ ...state, businessName: e.target.value })}
              placeholder="Your business name"
              className={[
                'w-full min-h-tap-min',
                'px-[var(--space-input-padding-x)] py-[var(--space-input-padding-y)]',
                'text-body text-charcoal placeholder:text-slate-light',
                'bg-cream rounded-md',
                'border border-transparent focus:border-terracotta outline-none',
                'transition-colors duration-fast',
              ].join(' ')}
            />

            {/* Business type grid */}
            <div className="grid grid-cols-4 gap-3">
              {BUSINESS_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setState({ ...state, businessType: type.id })}
                  className={[
                    'flex flex-col items-center justify-center gap-1',
                    'min-h-[88px] rounded-md transition-all duration-fast',
                    state.businessType === type.id
                      ? 'bg-terracotta-light border-2 border-terracotta'
                      : 'bg-cream border-2 border-transparent hover:bg-terracotta-light/50',
                  ].join(' ')}
                  aria-pressed={state.businessType === type.id}
                  aria-label={type.label}
                >
                  <span className="text-[28px]">{type.icon}</span>
                  <span className="text-caption text-charcoal">{type.label}</span>
                </button>
              ))}
            </div>

            {/* City (auto-detected) */}
            <div className="flex items-center gap-2 text-body text-charcoal">
              <span>📍</span>
              <span>{state.city}</span>
              <button className="text-caption text-terracotta ml-auto">Edit</button>
            </div>

            {/* Continue */}
            <div className="mt-auto">
              <Button
                variant="primary"
                label="Continue"
                fullWidth
                disabled={!state.businessName.trim() || !state.businessType}
                onClick={goNext}
              />
            </div>
          </div>
        )}

        {/* ============================================================
         * STEP 2: Here's what I found
         * ============================================================ */}
        {step === 2 && (
          <div className="flex flex-col gap-8 flex-1">
            {/* Business profile card */}
            <div className="card flex flex-col gap-3">
              <h2 className="text-h2 text-charcoal font-semibold">
                {state.businessName || 'Your Business'}
              </h2>
              <div className="flex flex-col gap-2 text-body">
                <div className="flex items-center gap-2 text-charcoal">
                  <span className="text-slate">📍</span>
                  <span>1401 S Lamar Blvd, Austin, TX 78704</span>
                </div>
                <div className="flex items-center gap-2 text-charcoal">
                  <span className="text-slate">⭐</span>
                  <span>4.3 on Google (28 reviews) · Not found on Yelp</span>
                </div>
                <div className="flex items-center gap-2 text-charcoal">
                  <span className="text-slate">📸</span>
                  <span>3 photos on Google · No Instagram</span>
                </div>
                <div className="flex items-center gap-2 text-charcoal">
                  <span className="text-slate">🌐</span>
                  <span>No website found</span>
                </div>
              </div>
            </div>

            {/* Affirmation message */}
            <p className="text-body text-charcoal">
              You&apos;ve got a good foundation — 28 reviews with a 4.3 average is solid.
              Let me help you build on that.
            </p>

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-3">
              <Button
                variant="primary"
                label="That's me"
                fullWidth
                onClick={goNext}
              />
              <button className="text-caption text-terracotta text-center">
                Something wrong? Edit details
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
         * STEP 3: Show me your best (photos)
         * ============================================================ */}
        {step === 3 && (
          <div className="flex flex-col gap-8 flex-1">
            <div>
              <h1 className="text-h1 text-charcoal">
                Now show me what makes your business special.
              </h1>
              <p className="text-body text-charcoal mt-2">
                Upload a few photos — your space, your team, your best work.
                I&apos;ll use these everywhere.
              </p>
            </div>

            {/* Photo grid */}
            <div className="grid grid-cols-3 gap-2">
              {/* Placeholder uploaded photos */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-cream rounded-sm flex items-center justify-center"
                >
                  <span className="text-slate-light text-caption">Photo {i}</span>
                </div>
              ))}
              {/* Add more button */}
              <button
                className="aspect-square rounded-sm border-2 border-dashed flex items-center justify-center text-slate hover:text-charcoal hover:border-terracotta transition-colors"
                style={{ borderColor: 'var(--border-default)' }}
                aria-label="Add photo"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" x2="12" y1="5" y2="19" />
                  <line x1="5" x2="19" y1="12" y2="12" />
                </svg>
              </button>
            </div>

            {/* Optional description */}
            <input
              type="text"
              value={state.description}
              onChange={(e) => setState({ ...state, description: e.target.value })}
              placeholder="What makes you special? (optional)"
              className={[
                'w-full min-h-tap-min',
                'px-[var(--space-input-padding-x)] py-[var(--space-input-padding-y)]',
                'text-body text-charcoal placeholder:text-slate-light',
                'bg-cream rounded-md',
                'border border-transparent focus:border-terracotta outline-none',
                'transition-colors duration-fast',
              ].join(' ')}
            />

            <p className="text-caption text-slate">
              💡 the more photos you share, the better your site and posts will look
            </p>

            <div className="mt-auto">
              <Button
                variant="primary"
                label="Continue"
                fullWidth
                onClick={goNext}
              />
            </div>
          </div>
        )}

        {/* ============================================================
         * STEP 4: What matters most (priority)
         * ============================================================ */}
        {step === 4 && (
          <div className="flex flex-col gap-8 flex-1">
            <h1 className="text-h1 text-charcoal">
              What matters most to you right now?
            </h1>

            <div className="flex flex-col gap-3">
              {PRIORITIES.map((priority) => (
                <button
                  key={priority.id}
                  onClick={() => {
                    setState({ ...state, priority: priority.id });
                    setIsGenerating(true);
                    // Simulate generation delay, then advance
                    setTimeout(() => {
                      setIsGenerating(false);
                      goNext();
                    }, 300);
                  }}
                  className={[
                    'flex items-center gap-4 p-5 rounded-md text-left',
                    'bg-white shadow-sm',
                    'hover:bg-terracotta-light transition-colors duration-fast',
                    'min-h-[80px]',
                  ].join(' ')}
                >
                  <span className="text-[28px] flex-shrink-0">{priority.icon}</span>
                  <div>
                    <span className="text-h2 text-charcoal block">{priority.label}</span>
                    <span className="text-body text-slate">{priority.sublabel}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
         * STEP 5: The Reveal — The iPhone Moment
         * ============================================================ */}
        {step === 5 && (
          <div className="flex flex-col gap-8 flex-1">
            {isGenerating ? (
              /* Phase 5A: Loading glow */
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <h1 className="text-display text-charcoal text-center">
                  {state.businessName || 'Your Business'}
                </h1>
                <div className="loading-glow w-48 h-3 rounded-full" />
              </div>
            ) : (
              /* Phase 5B: The reveal */
              <>
                <h1 className="text-h1 text-charcoal">
                  Here&apos;s what I built for you.
                </h1>

                {/* Website preview */}
                <div className="card animate-in reveal-stagger-1 flex flex-col gap-card-gap">
                  <span className="text-caption text-slate uppercase tracking-widest font-semibold">
                    Your Website
                  </span>
                  <div className="aspect-video bg-cream rounded-sm flex items-center justify-center">
                    <span className="text-slate-light text-caption">Website preview</span>
                  </div>
                  <p className="text-caption text-terracotta">
                    {state.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'yourbusiness'}atx.com
                  </p>
                  <div className="flex gap-3">
                    <div className="flex-[3]">
                      <Button variant="primary" label="View Site" fullWidth onClick={() => {}} />
                    </div>
                    <div className="flex-[2]">
                      <Button variant="secondary" label="Edit" fullWidth onClick={() => {}} />
                    </div>
                  </div>
                </div>

                {/* Social post preview */}
                <div className="card animate-in reveal-stagger-2 flex flex-col gap-card-gap">
                  <span className="text-caption text-slate uppercase tracking-widest font-semibold">
                    Your First Post
                  </span>
                  <div className="aspect-square bg-cream rounded-sm flex items-center justify-center">
                    <span className="text-slate-light text-caption">Social post preview</span>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-[3]">
                      <Button variant="primary" label="Post Now" fullWidth onClick={() => {}} />
                    </div>
                    <div className="flex-[2]">
                      <Button variant="secondary" label="Edit" fullWidth onClick={() => {}} />
                    </div>
                  </div>
                </div>

                {/* Google listing */}
                <div className="card animate-in reveal-stagger-3 flex flex-col gap-card-gap">
                  <span className="text-caption text-slate uppercase tracking-widest font-semibold">
                    Your Google Listing
                  </span>
                  <p className="text-body text-charcoal">
                    Updated description + keywords. Response drafted for your latest review.
                  </p>
                  <div className="flex gap-3">
                    <div className="flex-[3]">
                      <Button variant="primary" label="Looks Good" fullWidth onClick={() => {}} />
                    </div>
                    <div className="flex-[2]">
                      <Button variant="secondary" label="Edit" fullWidth onClick={() => {}} />
                    </div>
                  </div>
                </div>

                {/* Campaign suggestion */}
                <div className="card animate-in reveal-stagger-4 flex flex-col gap-card-gap">
                  <span className="text-caption text-slate uppercase tracking-widest font-semibold">
                    First Campaign
                  </span>
                  <p className="text-body text-charcoal">
                    {state.priority === 'seo' && 'Ask your 5 most recent customers for a Google review.'}
                    {state.priority === 'reviews' && 'Respond to your latest reviews and ask happy customers for more.'}
                    {state.priority === 'social' && 'Post your best dish photo with a story about why it\'s special.'}
                    {!state.priority && 'Ask your 5 most recent customers for a Google review.'}
                  </p>
                  <div className="flex gap-3">
                    <div className="flex-[3]">
                      <Button variant="primary" label="Start Campaign" fullWidth onClick={() => {}} />
                    </div>
                    <div className="flex-[2]">
                      <Button variant="secondary" label="Later" fullWidth onClick={() => {}} />
                    </div>
                  </div>
                </div>

                {/* Master publish button */}
                <div className="mt-4 mb-8">
                  <Button
                    variant="primary"
                    label="Looks good — publish everything"
                    fullWidth
                    onClick={() => {
                      // TODO: Publish all, transition to main app
                      window.location.href = '/';
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
