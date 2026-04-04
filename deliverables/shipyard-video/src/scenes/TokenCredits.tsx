import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 5 (0:38 - 0:50): Token credit meter + scope creep approval
 */
export const TokenCredits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Token meter draining over time
  const tokensRemaining = interpolate(frame, [0, 360], [8500, 4200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const meterPercent = (tokensRemaining / 10000) * 100;

  // Scope creep notification slides up at frame 100
  const notifSlide = interpolate(frame - 100, [0, 15], [200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const notifOpacity = interpolate(frame - 100, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Approve button pulse at frame 200
  const pulseScale = frame >= 200 && frame < 230
    ? spring({
        frame: frame - 200,
        fps,
        config: { damping: 8, stiffness: 300, mass: 0.5 },
      })
    : 1;

  // Click approval at frame 240
  const approved = frame >= 240;

  // After approval, tokens adjust
  const postApprovalTokens = approved
    ? interpolate(frame - 240, [0, 60], [tokensRemaining, tokensRemaining - 1200], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : tokensRemaining;

  const displayTokens = Math.round(approved ? postApprovalTokens : tokensRemaining);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        position: "relative",
      }}
    >
      {/* Token Meter */}
      <div style={{ width: 600, marginBottom: 60 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: fonts.body,
              fontSize: 18,
              color: colors.text,
              fontWeight: 600,
            }}
          >
            Credit Balance
          </span>
          <span
            style={{
              fontFamily: fonts.code,
              fontSize: 20,
              color: colors.accent,
              fontWeight: 700,
            }}
          >
            {displayTokens.toLocaleString()} tokens
          </span>
        </div>

        {/* Gauge */}
        <div
          style={{
            width: "100%",
            height: 16,
            backgroundColor: colors.surfaceLight,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${meterPercent}%`,
              height: "100%",
              backgroundColor:
                meterPercent > 50
                  ? colors.green
                  : meterPercent > 25
                  ? colors.accent
                  : "#ef4444",
              borderRadius: 8,
            }}
          />
        </div>

        {/* Activity ticks */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 4,
          }}
        >
          {Array.from({ length: 40 }).map((_, i) => {
            const tickOpacity = interpolate(
              frame,
              [i * 8, i * 8 + 4],
              [0, 0.6],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div
                key={i}
                style={{
                  width: 3,
                  height: interpolate(
                    Math.sin(i * 0.8 + frame * 0.05),
                    [-1, 1],
                    [8, 24]
                  ),
                  backgroundColor: colors.accent,
                  borderRadius: 2,
                  opacity: tickOpacity,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Scope Creep Notification */}
      {frame >= 100 && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: `translateX(-50%) translateY(${notifSlide}px)`,
            opacity: notifOpacity,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.accent}`,
            borderRadius: 12,
            padding: "20px 30px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            width: 550,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: colors.accent,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 16,
                color: colors.text,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Scope Change: "Can we also add a blog?"
            </div>
            <div
              style={{
                fontFamily: fonts.code,
                fontSize: 13,
                color: colors.accent,
              }}
            >
              Requires 1,200 additional credits
            </div>
          </div>

          {/* Approve button */}
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 14,
              fontWeight: 700,
              color: approved ? colors.bg : colors.text,
              backgroundColor: approved ? colors.green : "transparent",
              border: `2px solid ${approved ? colors.green : colors.accent}`,
              borderRadius: 8,
              padding: "8px 20px",
              transform: `scale(${pulseScale})`,
              cursor: "pointer",
            }}
          >
            {approved ? "Approved" : "Approve"}
          </div>
        </div>
      )}
    </div>
  );
};
