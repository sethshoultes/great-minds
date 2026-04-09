/**
 * Public Benchmark Report Page
 * Spec: REQ-011, REQ-012, REQ-024
 *
 * SEO-optimized public page displaying benchmark data.
 * Accessible without authentication for sharing.
 *
 * Features:
 * - SEO-friendly meta tags
 * - Social sharing optimization
 * - Embeddable badge promotion
 * - Public-safe data display (no sensitive info)
 */

import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { db } from "@/lib/db";
import {
  pulseBenchmarks,
  pulsePublicReports,
  businesses,
} from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { PulseScore } from "@/components/PulseScore";
import { IndustryComparison, MetricComparison } from "@/components/IndustryComparison";
import {
  EmbeddableBadge,
  generateBadgeImageUrl,
} from "@/components/EmbeddableBadge";

/**
 * Page props
 */
interface PublicReportPageProps {
  report: {
    businessId: string;
    businessName: string;
    slug: string;
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
    };
    insufficientData: boolean;
    insufficientDataMessage?: string;
  } | null;
  error?: string;
}

/**
 * Interpret percentile for meta description
 */
function interpretPercentile(percentile: number): string {
  if (percentile >= 90) return "in the top 10% of restaurants";
  if (percentile >= 75) return "outperforming most restaurants";
  if (percentile >= 50) return "performing above average";
  return "on a growth journey";
}

/**
 * Public Report Page Component
 */
export default function PublicReportPage({
  report,
  error,
}: PublicReportPageProps) {
  // Error state
  if (error || !report) {
    return (
      <>
        <Head>
          <title>Report Not Found | Pulse by LocalGenius</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Report Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "This benchmark report doesn't exist or has been removed."}
            </p>
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      </>
    );
  }

  const interpretation = interpretPercentile(report.pulseScore);
  const badgeImageUrl = generateBadgeImageUrl(report.businessId);
  const canonicalUrl = `https://pulse.localgenius.com/reports/${report.slug}`;

  return (
    <>
      {/* SEO Meta Tags (REQ-012) */}
      <Head>
        <title>
          {report.businessName} | {report.pulseScore}th Percentile | Pulse
        </title>
        <meta
          name="description"
          content={`${report.businessName} is ${interpretation} in their area. See their Pulse benchmark report comparing performance across key metrics.`}
        />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`${report.businessName} - ${report.pulseScore}th Percentile`}
        />
        <meta
          property="og:description"
          content={`${report.businessName} is ${interpretation}. View their full industry benchmark report.`}
        />
        <meta property="og:image" content={badgeImageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Pulse by LocalGenius" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${report.businessName} - ${report.pulseScore}th Percentile`}
        />
        <meta
          name="twitter:description"
          content={`${report.businessName} is ${interpretation}. View their full industry benchmark report.`}
        />
        <meta name="twitter:image" content={badgeImageUrl} />

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: `${report.businessName} Industry Benchmark Report`,
              description: `${report.businessName} ranks in the ${report.pulseScore}th percentile among similar restaurants.`,
              image: badgeImageUrl,
              datePublished: report.calculatedAt,
              dateModified: report.calculatedAt,
              publisher: {
                "@type": "Organization",
                name: "LocalGenius",
                logo: {
                  "@type": "ImageObject",
                  url: "https://localgenius.com/logo.png",
                },
              },
            }),
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-600">Pulse</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600">by LocalGenius</span>
              </div>
              <a
                href="/signup?source=public-report"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Get Your Free Report
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          {/* Business Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {report.businessName}
            </h1>
            <p className="text-gray-600">
              Industry Benchmark Report | Updated{" "}
              {new Date(report.calculatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {report.insufficientData ? (
            /* Insufficient data display */
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Benchmark In Progress
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                {report.insufficientDataMessage ||
                  "We're still gathering data to calculate benchmarks for this business. Check back soon!"}
              </p>
            </div>
          ) : (
            <>
              {/* Pulse Score */}
              <div className="mb-8">
                <PulseScore
                  percentile={report.pulseScore}
                  businessName={report.businessName}
                  calculatedAt={report.calculatedAt}
                />
              </div>

              {/* Industry Comparison */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <IndustryComparison
                  metrics={report.metrics}
                  peerGroupDescription={report.peerGroup.description}
                  peerGroupSize={report.peerGroup.memberCount}
                />
              </div>

              {/* Badge Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Share This Achievement
                </h2>
                <div className="flex justify-center mb-6">
                  <EmbeddableBadge
                    percentile={report.pulseScore}
                    businessName={report.businessName}
                    calculatedAt={report.calculatedAt}
                    theme="light"
                    size="large"
                  />
                </div>
                <p className="text-gray-600 mb-6">
                  Embed this badge on your website or share on social media.
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `${report.businessName} ranks in the ${report.pulseScore}th percentile among local restaurants!`
                    )}&url=${encodeURIComponent(canonicalUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Share on Twitter
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      canonicalUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Share on Facebook
                  </a>
                </div>
              </div>
            </>
          )}

          {/* Peer Group Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Compared against {report.peerGroup.memberCount.toLocaleString()}{" "}
              {report.peerGroup.description}
            </p>
            <p className="mt-1">
              Report period:{" "}
              {new Date(report.periodStart).toLocaleDateString()} -{" "}
              {new Date(report.periodEnd).toLocaleDateString()}
            </p>
          </div>
        </main>

        {/* CTA Footer */}
        <footer className="bg-blue-600 text-white py-12 mt-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Want Your Own Benchmark Report?
            </h2>
            <p className="text-blue-100 mb-6 max-w-lg mx-auto">
              See how your restaurant stacks up against the competition with Pulse
              by LocalGenius. Get your free report today.
            </p>
            <a
              href="/signup?source=public-report-footer"
              className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              Get My Free Report
            </a>
          </div>
        </footer>

        {/* Powered by */}
        <div className="bg-gray-900 text-gray-400 py-4 text-center text-sm">
          Powered by{" "}
          <a
            href="https://localgenius.com"
            className="text-white hover:text-blue-400 transition-colors"
          >
            LocalGenius
          </a>
        </div>
      </div>
    </>
  );
}

/**
 * Server-side data fetching
 */
export const getServerSideProps: GetServerSideProps<
  PublicReportPageProps
> = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    // Look up public report by slug
    const [publicReport] = await db
      .select()
      .from(pulsePublicReports)
      .where(
        and(eq(pulsePublicReports.slug, slug), eq(pulsePublicReports.isPublic, 1))
      )
      .limit(1);

    if (!publicReport) {
      // Try slug as businessId for backwards compatibility
      const [benchmark] = await db
        .select()
        .from(pulseBenchmarks)
        .where(eq(pulseBenchmarks.businessId, slug))
        .orderBy(desc(pulseBenchmarks.calculatedAt))
        .limit(1);

      if (!benchmark) {
        return { props: { report: null, error: "Report not found" } };
      }

      // Get business name
      const [business] = await db
        .select({ name: businesses.name })
        .from(businesses)
        .where(eq(businesses.id, benchmark.businessId))
        .limit(1);

      // Transform benchmark to report format
      return {
        props: {
          report: {
            businessId: benchmark.businessId,
            businessName: business?.name || "Restaurant",
            slug: benchmark.businessId,
            pulseScore: benchmark.compositePercentile,
            calculatedAt: benchmark.calculatedAt.toISOString(),
            periodStart: benchmark.periodStart.toISOString(),
            periodEnd: benchmark.periodEnd.toISOString(),
            metrics: [
              {
                name: "engagementRate",
                displayName: "Engagement Rate",
                value: Number(benchmark.engagementRate),
                unit: "%",
                percentile: benchmark.engagementRatePercentile,
                interpretation: `${benchmark.engagementRatePercentile}th percentile for engagement`,
              },
              {
                name: "postFrequency",
                displayName: "Posting Frequency",
                value: Number(benchmark.postFrequency),
                unit: "posts/week",
                percentile: benchmark.postFrequencyPercentile,
                interpretation: `${benchmark.postFrequencyPercentile}th percentile for posting`,
              },
              {
                name: "engagementGrowth",
                displayName: "Engagement Growth",
                value: Number(benchmark.engagementGrowth),
                unit: "% week-over-week",
                percentile: benchmark.engagementGrowthPercentile,
                interpretation: `${benchmark.engagementGrowthPercentile}th percentile for growth`,
              },
              {
                name: "responseTime",
                displayName: "Response Time",
                value: Number(benchmark.responseTime),
                unit: "hours",
                percentile: benchmark.responseTimePercentile,
                interpretation: `${benchmark.responseTimePercentile}th percentile for response time`,
              },
              {
                name: "conversionRate",
                displayName: "Conversion Rate",
                value: Number(benchmark.conversionRate),
                unit: "%",
                percentile: benchmark.conversionRatePercentile,
                interpretation: `${benchmark.conversionRatePercentile}th percentile for conversion`,
              },
            ],
            peerGroup: {
              description:
                benchmark.peerGroupRegionType === "msa"
                  ? `restaurants in ${benchmark.peerGroupRegion} Metro Area`
                  : `restaurants in ${benchmark.peerGroupRegion}`,
              memberCount: benchmark.peerGroupSize,
              regionType: benchmark.peerGroupRegionType as "msa" | "state",
              region: benchmark.peerGroupRegion,
            },
            insufficientData: false,
          },
        },
      };
    }

    // Get benchmark data
    const [benchmark] = await db
      .select()
      .from(pulseBenchmarks)
      .where(eq(pulseBenchmarks.businessId, publicReport.businessId))
      .orderBy(desc(pulseBenchmarks.calculatedAt))
      .limit(1);

    if (!benchmark) {
      return {
        props: {
          report: {
            businessId: publicReport.businessId,
            businessName: publicReport.businessDisplayName,
            slug: publicReport.slug,
            pulseScore: 0,
            calculatedAt: new Date().toISOString(),
            periodStart: new Date().toISOString(),
            periodEnd: new Date().toISOString(),
            metrics: [],
            peerGroup: {
              description: "restaurants",
              memberCount: 0,
              regionType: "state",
              region: "",
            },
            insufficientData: true,
            insufficientDataMessage:
              "Benchmark data is being calculated. Check back soon!",
          },
        },
      };
    }

    // Return full report
    return {
      props: {
        report: {
          businessId: publicReport.businessId,
          businessName: publicReport.businessDisplayName,
          slug: publicReport.slug,
          pulseScore: benchmark.compositePercentile,
          calculatedAt: benchmark.calculatedAt.toISOString(),
          periodStart: benchmark.periodStart.toISOString(),
          periodEnd: benchmark.periodEnd.toISOString(),
          metrics: [
            {
              name: "engagementRate",
              displayName: "Engagement Rate",
              value: Number(benchmark.engagementRate),
              unit: "%",
              percentile: benchmark.engagementRatePercentile,
              interpretation: `${benchmark.engagementRatePercentile}th percentile for engagement`,
            },
            {
              name: "postFrequency",
              displayName: "Posting Frequency",
              value: Number(benchmark.postFrequency),
              unit: "posts/week",
              percentile: benchmark.postFrequencyPercentile,
              interpretation: `${benchmark.postFrequencyPercentile}th percentile for posting`,
            },
            {
              name: "engagementGrowth",
              displayName: "Engagement Growth",
              value: Number(benchmark.engagementGrowth),
              unit: "% week-over-week",
              percentile: benchmark.engagementGrowthPercentile,
              interpretation: `${benchmark.engagementGrowthPercentile}th percentile for growth`,
            },
            {
              name: "responseTime",
              displayName: "Response Time",
              value: Number(benchmark.responseTime),
              unit: "hours",
              percentile: benchmark.responseTimePercentile,
              interpretation: `${benchmark.responseTimePercentile}th percentile for response time`,
            },
            {
              name: "conversionRate",
              displayName: "Conversion Rate",
              value: Number(benchmark.conversionRate),
              unit: "%",
              percentile: benchmark.conversionRatePercentile,
              interpretation: `${benchmark.conversionRatePercentile}th percentile for conversion`,
            },
          ],
          peerGroup: {
            description:
              benchmark.peerGroupRegionType === "msa"
                ? `restaurants in ${benchmark.peerGroupRegion} Metro Area`
                : `restaurants in ${benchmark.peerGroupRegion}`,
            memberCount: benchmark.peerGroupSize,
            regionType: benchmark.peerGroupRegionType as "msa" | "state",
            region: benchmark.peerGroupRegion,
          },
          insufficientData: false,
        },
      },
    };
  } catch (error) {
    console.error("[Public Report] Error fetching report:", error);
    return {
      props: {
        report: null,
        error: "An error occurred while loading this report",
      },
    };
  }
};
