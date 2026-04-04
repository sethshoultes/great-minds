import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 4 (0:26 - 0:36): Full dashboard reveal with sidebar.
 * Sidebar slides in from left showing Stripe "$49/mo", usage stats
 * ("213 posts generated"), reliability indicator (770+ tests passing),
 * and "Powered by hybrid AI" tooltip.
 *
 * VO: "Under the hood: hybrid AI that's been tested 770 times before
 *      it ever touched your business..."
 */
export const DashboardReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sidebar slides in from left over 600ms (18 frames) with overshoot
  const sidebarSlide = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.8 },
  });
  const sidebarX = interpolate(sidebarSlide, [0, 1], [-380, 0]);

  // Test count odometer: rolls up from 0 → 770 starting at frame 30
  const testCount = Math.round(
    interpolate(frame, [30, 180], [0, 770], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  // Stripe badge pulse at frame 60
  const stripePulse =
    frame >= 60 && frame < 75
      ? spring({
          frame: frame - 60,
          fps,
          config: { damping: 10, stiffness: 300, mass: 0.4 },
        })
      : 1;

  // Hybrid AI tooltip expands at frame 150
  const tooltipOpacity = interpolate(frame - 150, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tooltipWidth = interpolate(frame - 150, [0, 15], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Tooltip collapses at frame 240
  const tooltipFade = interpolate(frame - 240, [0, 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showTooltip = frame >= 150;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        position: "relative",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 380,
          backgroundColor: colors.surface,
          borderRight: `1px solid ${colors.surfaceLight}`,
          padding: "48px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 36,
          transform: `translateX(${sidebarX}px)`,
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 36,
            fontWeight: 800,
            color: colors.accent,
            marginBottom: 12,
          }}
        >
          LocalGenius
        </div>

        {/* Stripe billing */}
        <div
          style={{
            backgroundColor: colors.bg,
            borderRadius: 12,
            padding: "22px 24px",
            border: `1px solid ${colors.surfaceLight}`,
            transform: `scale(${stripePulse})`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 18,
              color: colors.textMuted,
              marginBottom: 10,
            }}
          >
            Billing
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 42,
              fontWeight: 800,
              color: colors.text,
            }}
          >
            $49
            <span
              style={{
                fontSize: 22,
                color: colors.textMuted,
                fontWeight: 400,
              }}
            >
              /mo
            </span>
          </div>
          <div
            style={{
              fontFamily: fonts.code,
              fontSize: 14,
              color: colors.sage,
              marginTop: 6,
            }}
          >
            via Stripe
          </div>
        </div>

        {/* Usage stats */}
        <div
          style={{
            backgroundColor: colors.bg,
            borderRadius: 12,
            padding: "22px 24px",
            border: `1px solid ${colors.surfaceLight}`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 18,
              color: colors.textMuted,
              marginBottom: 10,
            }}
          >
            This Month
          </div>
          <div
            style={{
              fontFamily: fonts.code,
              fontSize: 36,
              fontWeight: 700,
              color: colors.gold,
            }}
          >
            213
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 18,
              color: colors.textMuted,
              marginTop: 4,
            }}
          >
            posts generated
          </div>
        </div>

        {/* Reliability: test count odometer */}
        <div
          style={{
            backgroundColor: colors.bg,
            borderRadius: 12,
            padding: "22px 24px",
            border: `1px solid ${colors.surfaceLight}`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 18,
              color: colors.textMuted,
              marginBottom: 10,
            }}
          >
            Reliability
          </div>
          <div
            style={{
              fontFamily: fonts.code,
              fontSize: 48,
              fontWeight: 800,
              color: colors.sage,
            }}
          >
            {testCount}+
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 18,
              color: colors.textMuted,
              marginTop: 4,
            }}
          >
            tests passing
          </div>
        </div>

        {/* Hybrid AI badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: colors.accent,
            }}
          />
          <span
            style={{
              fontFamily: fonts.code,
              fontSize: 16,
              color: colors.textMuted,
            }}
          >
            Powered by hybrid AI
          </span>

          {/* Expanding tooltip */}
          {showTooltip && (
            <div
              style={{
                position: "absolute",
                top: -60,
                left: 0,
                width: tooltipWidth,
                overflow: "hidden",
                opacity: tooltipOpacity * tooltipFade,
                backgroundColor: colors.surfaceLight,
                borderRadius: 8,
                padding: "12px 18px",
                fontFamily: fonts.code,
                fontSize: 14,
                color: colors.text,
                whiteSpace: "nowrap",
              }}
            >
              Claude + Cloudflare Workers AI
            </div>
          )}
        </div>
      </div>

      {/* Main content area — dashboard preview */}
      <div
        style={{
          flex: 1,
          padding: "48px 56px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 24,
            color: colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: 42,
            borderBottom: `1px solid ${colors.surfaceLight}`,
            paddingBottom: 22,
          }}
        >
          Content Dashboard
        </div>

        {/* Content cards preview */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {["Social", "Email", "Blog", "Reviews"].map((label, i) => {
            const cardOpacity = interpolate(
              frame - (i * 10 + 20),
              [0, 10],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={label}
                style={{
                  flex: "1 1 calc(50% - 12px)",
                  minWidth: 300,
                  height: 200,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  border: `1px solid ${colors.surfaceLight}`,
                  padding: "24px 28px",
                  opacity: cardOpacity,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 24,
                    fontWeight: 700,
                    color: colors.text,
                  }}
                >
                  {label}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      style={{
                        flex: 1,
                        height: 8,
                        backgroundColor: colors.surfaceLight,
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, interpolate(frame, [i * 15 + 30, i * 15 + 180], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}%`,
                          height: "100%",
                          backgroundColor: colors.accent,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    fontFamily: fonts.code,
                    fontSize: 16,
                    color: colors.sage,
                  }}
                >
                  {Math.round(interpolate(frame, [i * 10, 200], [0, 12 + i * 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))} items queued
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
