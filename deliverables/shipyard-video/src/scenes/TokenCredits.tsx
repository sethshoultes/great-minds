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
        padding: 84,
        position: "relative",
      }}
    >
      {/* Token Meter */}
      <div style={{ width: 840, marginBottom: 84 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <span
            style={{
              fontFamily: fonts.body,
              fontSize: 28,
              color: colors.text,
              fontWeight: 600,
            }}
          >
            Credit Balance
          </span>
          <span
            style={{
              fontFamily: fonts.code,
              fontSize: 32,
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
            height: 24,
            backgroundColor: colors.surfaceLight,
            borderRadius: 12,
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
              borderRadius: 12,
            }}
          />
        </div>

        {/* Activity ticks */}
        <div
          style={{
            marginTop: 22,
            display: "flex",
            gap: 6,
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
                  width: 5,
                  height: interpolate(
                    Math.sin(i * 0.8 + frame * 0.05),
                    [-1, 1],
                    [12, 36]
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
            bottom: 112,
            left: "50%",
            transform: `translateX(-50%) translateY(${notifSlide}px)`,
            opacity: notifOpacity,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.accent}`,
            borderRadius: 16,
            padding: "28px 42px",
            display: "flex",
            alignItems: "center",
            gap: 28,
            width: 770,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: colors.accent,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 24,
                color: colors.text,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Scope Change: "Can we also add a blog?"
            </div>
            <div
              style={{
                fontFamily: fonts.code,
                fontSize: 20,
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
              fontSize: 22,
              fontWeight: 700,
              color: approved ? colors.bg : colors.text,
              backgroundColor: approved ? colors.green : "transparent",
              border: `2px solid ${approved ? colors.green : colors.accent}`,
              borderRadius: 10,
              padding: "12px 28px",
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
