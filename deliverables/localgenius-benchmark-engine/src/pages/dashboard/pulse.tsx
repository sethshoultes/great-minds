/**
 * Pulse Dashboard Page
 * Spec: REQ-023, REQ-040
 *
 * Main dashboard integrating all Pulse components.
 * Shows benchmark data for authenticated users.
 *
 * Features:
 * - Hero PulseScore display
 * - Industry comparison charts
 * - Peer group information
 * - Freemium preview gating (REQ-014)
 * - Insufficient data handling (REQ-036)
 */

"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PulseScore } from "@/components/PulseScore";
import { IndustryComparison, MetricComparison } from "@/components/IndustryComparison";
import { PeerGroupSelector, PeerGroupCriteria } from "@/components/PeerGroupSelector";
import {
  EmbeddableBadge,
  generateEmbedCode,
} from "@/components/EmbeddableBadge";

/**
 * API Response Types
 */
interface BenchmarkData {
  businessId: string;
  businessName: string;
  pulseScore: number;
  calculatedAt: string;
  periodStart: string;
  periodEnd: string;
  metrics: MetricComparison[];
  peerGroup: {
    description: string;
    memberCount: number;
    regionType: "msa" | "state";
    region: string;
    sizeBucket: string;
    isOptimal: boolean;
    warnings: string[];
  };
  insufficientData: boolean;
  insufficientDataMessage?: string;
}

interface FreemiumGateProps {
  businessName: string;
  previewPercentile: number;
}

/**
 * Freemium Preview Gate (REQ-014)
 */
function FreemiumGate({ businessName, previewPercentile }: FreemiumGateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Preview badge */}
        <div className="mb-6 opacity-75 filter blur-sm">
          <div className="text-6xl font-bold text-blue-600">{previewPercentile}</div>
          <div className="text-gray-500">percentile</div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          See How You Stack Up
        </h1>
        <p className="text-gray-600 mb-6">
          Get your full Pulse benchmark report and see how {businessName} compares
          to other restaurants in your area.
        </p>

        {/* Value props */}
        <ul className="text-left space-y-3 mb-8">
          <li className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-green-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">
              Your exact percentile ranking among local restaurants
            </span>
          </li>
          <li className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-green-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">
              5 key performance metrics compared to peers
            </span>
          </li>
          <li className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-green-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">
              Embeddable badge to showcase your ranking
            </span>
          </li>
        </ul>

        {/* CTA */}
        <a
          href="/signup?source=pulse-preview"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          Start Free Trial
        </a>
        <p className="text-sm text-gray-500 mt-3">
          No credit card required. Free for 14 days.
        </p>
      </div>
    </div>
  );
}

/**
 * Embed Code Modal
 */
function EmbedCodeModal({
  embedCode,
  onClose,
}: {
  embedCode: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Embed Your Badge</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Copy this code and paste it into your website's HTML where you want the
          badge to appear.
        </p>

        <div className="relative">
          <pre className="bg-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
            <code>{embedCode}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 bg-white hover:bg-gray-50 text-gray-600 px-3 py-1 rounded-lg text-sm border"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          The badge will automatically update when your ranking changes.
        </div>
      </div>
    </div>
  );
}

/**
 * Main Pulse Dashboard Component
 */
export default function PulseDashboard() {
  const { data: session, status } = useSession();
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  // Fetch benchmark data
  useEffect(() => {
    async function fetchBenchmarks() {
      if (!session?.user?.businessId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/pulse/benchmarks/${session.user.businessId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch benchmarks");
        }

        const data = await response.json();
        setBenchmarkData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    if (status !== "loading") {
      fetchBenchmarks();
    }
  }, [session, status]);

  // Show freemium gate for unauthenticated users (REQ-014)
  if (status === "unauthenticated") {
    return (
      <FreemiumGate
        businessName="Your Restaurant"
        previewPercentile={72} // Attractive preview percentile
      />
    );
  }

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Benchmarks
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!benchmarkData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Benchmark Data
          </h2>
          <p className="text-gray-600">
            We're still collecting data for your business. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  // Prepare peer group criteria for component
  const peerGroupCriteria: PeerGroupCriteria = {
    region: benchmarkData.peerGroup.region,
    regionType: benchmarkData.peerGroup.regionType,
    sizeBucket: benchmarkData.peerGroup.sizeBucket,
    memberCount: benchmarkData.peerGroup.memberCount,
    isOptimal: benchmarkData.peerGroup.isOptimal,
    warnings: benchmarkData.peerGroup.warnings,
  };

  // Generate embed code for badge
  const embedCode = generateEmbedCode(benchmarkData.businessId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pulse</h1>
              <p className="text-gray-500">
                Industry Benchmark Report for {benchmarkData.businessName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!benchmarkData.insufficientData && (
                <button
                  onClick={() => setShowEmbedModal(true)}
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Get Embed Code
                </button>
              )}
              <a
                href={`/reports/${benchmarkData.businessId}`}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                View Public Report
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Score and Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Pulse Score */}
            <PulseScore
              percentile={benchmarkData.pulseScore}
              businessName={benchmarkData.businessName}
              calculatedAt={benchmarkData.calculatedAt}
              insufficientData={benchmarkData.insufficientData}
              insufficientDataMessage={benchmarkData.insufficientDataMessage}
            />

            {/* Industry Comparison Charts */}
            {!benchmarkData.insufficientData && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <IndustryComparison
                  metrics={benchmarkData.metrics}
                  peerGroupDescription={benchmarkData.peerGroup.description}
                  peerGroupSize={benchmarkData.peerGroup.memberCount}
                />
              </div>
            )}
          </div>

          {/* Right column - Peer Group and Badge */}
          <div className="space-y-6">
            {/* Peer Group Info */}
            <PeerGroupSelector criteria={peerGroupCriteria} />

            {/* Badge Preview */}
            {!benchmarkData.insufficientData && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Your Badge
                </h3>
                <div className="flex justify-center mb-4">
                  <EmbeddableBadge
                    percentile={benchmarkData.pulseScore}
                    businessName={benchmarkData.businessName}
                    calculatedAt={benchmarkData.calculatedAt}
                    theme="light"
                    size="medium"
                  />
                </div>
                <button
                  onClick={() => setShowEmbedModal(true)}
                  className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Get embed code for your website
                </button>
              </div>
            )}

            {/* Period Info */}
            <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-600">
              <p>
                <strong>Report Period:</strong>{" "}
                {new Date(benchmarkData.periodStart).toLocaleDateString()} -{" "}
                {new Date(benchmarkData.periodEnd).toLocaleDateString()}
              </p>
              <p className="mt-1">
                <strong>Last Updated:</strong>{" "}
                {new Date(benchmarkData.calculatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Embed Code Modal */}
      {showEmbedModal && (
        <EmbedCodeModal
          embedCode={embedCode}
          onClose={() => setShowEmbedModal(false)}
        />
      )}
    </div>
  );
}
