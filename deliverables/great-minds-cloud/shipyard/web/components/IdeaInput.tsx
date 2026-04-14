'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { api } from '@/web/lib/api';

interface IdeaInputProps {
  onSubmit: (data: {
    title: string;
    description: string;
    prdContent: string;
    tier: 'starter' | 'standard' | 'enterprise';
  }) => void;
  isLoading?: boolean;
}

const PLACEHOLDER_TEXT = `# My Project

## Overview
Describe your product idea in 2-3 sentences. What problem does it solve?

## Target Users
Who will use this product? Be specific about their needs and pain points.

## Core Features
List the essential features for the first version:
- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## Success Metrics
How will you measure if this product is successful?

## Constraints
Any technical, budget, or timeline constraints?
`;

const TIER_INFO = {
  starter: {
    name: 'Starter',
    price: 500,
    description: 'Simple landing pages and basic apps',
    features: ['Up to 5 pages', 'Basic styling', 'Single integration', 'Email delivery'],
  },
  standard: {
    name: 'Standard',
    price: 1000,
    description: 'Full web applications with authentication',
    features: ['Unlimited pages', 'Auth system', 'Database design', 'API integrations', '3 revision rounds'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 2000,
    description: 'Complex SaaS with billing and advanced features',
    features: ['Full SaaS scaffold', 'Stripe billing', 'Admin dashboard', 'Multi-tenant', 'Priority support'],
  },
};

export function IdeaInput({ onSubmit, isLoading = false }: IdeaInputProps) {
  const [prdContent, setPrdContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedTier, setSelectedTier] = useState<'starter' | 'standard' | 'enterprise'>('standard');
  const [validation, setValidation] = useState<{
    valid: boolean;
    issues: string[];
    suggestions: string[];
    estimatedTier?: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(400, textarea.scrollHeight)}px`;
    }
  }, [prdContent]);

  // Debounced validation
  const validateContent = useCallback(async (content: string) => {
    if (content.length < 50) {
      setValidation(null);
      return;
    }

    setIsValidating(true);
    try {
      const result = await api.validatePrd(content);
      if (result.success && result.data) {
        setValidation(result.data);
        if (result.data.estimatedTier) {
          setSelectedTier(result.data.estimatedTier as 'starter' | 'standard' | 'enterprise');
        }
      }
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const handleContentChange = (value: string) => {
    setPrdContent(value);

    // Extract title from first heading
    const titleMatch = value.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      setTitle(titleMatch[1].trim());
    }

    // Debounce validation
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      validateContent(value);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prdContent.trim() || !title.trim() || isLoading) return;

    onSubmit({
      title,
      description: prdContent.slice(0, 500),
      prdContent,
      tier: selectedTier,
    });
  };

  const insertTemplate = () => {
    setPrdContent(PLACEHOLDER_TEXT);
    handleContentChange(PLACEHOLDER_TEXT);
  };

  const wordCount = prdContent.trim().split(/\s+/).filter(Boolean).length;
  const charCount = prdContent.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-shipyard-600 to-craft-600 p-6">
          <h2 className="text-2xl font-bold text-white">Paste Your Idea</h2>
          <p className="text-shipyard-100 mt-1">
            Describe what you want to build. Our 14-agent team will debate, design, and deliver.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Amazing Project"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-shipyard-500 focus:border-transparent transition-all text-lg"
              required
            />
          </div>

          {/* PRD Content */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="prd" className="block text-sm font-medium text-gray-700">
                Product Requirements
              </label>
              <button
                type="button"
                onClick={insertTemplate}
                className="text-sm text-shipyard-600 hover:text-shipyard-700 font-medium"
              >
                Insert Template
              </button>
            </div>
            <textarea
              ref={textareaRef}
              id="prd"
              value={prdContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={PLACEHOLDER_TEXT}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-shipyard-500 focus:border-transparent transition-all font-mono text-sm min-h-[400px] resize-none"
              required
            />
            <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white px-2 py-1 rounded">
              {wordCount} words / {charCount} characters
            </div>
          </div>

          {/* Validation Feedback */}
          {isValidating && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing your requirements...
            </div>
          )}

          {validation && !isValidating && (
            <div className={`rounded-xl p-4 ${validation.valid ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              {validation.valid ? (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-green-800">Your PRD looks ready!</p>
                    {validation.suggestions.length > 0 && (
                      <ul className="mt-2 text-sm text-green-700 space-y-1">
                        {validation.suggestions.map((s, i) => (
                          <li key={i}>Tip: {s}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-medium text-amber-800">A few things to consider:</p>
                    <ul className="mt-2 text-sm text-amber-700 space-y-1">
                      {validation.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tier Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Select Your Project Tier</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.entries(TIER_INFO) as [keyof typeof TIER_INFO, typeof TIER_INFO.starter][]).map(([key, tier]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedTier(key)}
              className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                selectedTier === key
                  ? 'border-shipyard-500 bg-shipyard-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {selectedTier === key && (
                <div className="absolute top-4 right-4">
                  <svg className="w-6 h-6 text-shipyard-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="text-2xl font-bold text-gray-900">${tier.price}</div>
              <div className="text-lg font-semibold text-gray-800 mt-1">{tier.name}</div>
              <div className="text-sm text-gray-500 mt-1">{tier.description}</div>
              <ul className="mt-4 space-y-2">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!prdContent.trim() || !title.trim() || isLoading}
          className="px-8 py-4 bg-gradient-to-r from-shipyard-600 to-craft-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating Project...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Launch Project
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </form>
  );
}

export default IdeaInput;
