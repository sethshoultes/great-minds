import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors, fonts } from "../styles";

interface FailureCard {
  title: string;
  description: string;
  frameIn: number;
}

const FAILURES: FailureCard[] = [
  {
    title: 'cron + claude -p',
    description: "Fresh context every call. Dropped steps. No memory.",
    frameIn: 30,
  },
  {
    title: "tmux send-keys",
    description: "Zero successes. Keystrokes dropped. Sessions hung.",
    frameIn: 80,
  },
  {
    title: "grep -oP on macOS",
    description: "GNU flag. BSD system. Every script broke.",
    frameIn: 130,
  },
];

/**
 * Scene 6: Three Failures + Daemon solution
 * Cards slide in, get red strikethrough, then green checkmark + daemon card.
 */
export const Scene6Failures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Daemon card appears after all failures
  const daemonStart = 480;
  const checkmarkStart = 450;

  // Checkmark draw
  const checkOpacity = interpolate(
    frame - checkmarkStart,
    [0, 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const daemonSpring = spring({
    frame: frame - daemonStart,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

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
        gap: 28,
        padding: "40px 200px",
      }}
    >
      {/* Failure cards */}
      {FAILURES.map((fail, i) => {
        const slideX = interpolate(
          frame - fail.frameIn,
          [0, 15],
          [600, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const opacity = interpolate(
          frame - fail.frameIn,
          [0, 10],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Strikethrough appears 40 frames after card
        const strikeStart = fail.frameIn + 40;
        const strikeWidth = interpolate(
          frame - strikeStart,
          [0, 20],
          [0, 100],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={fail.title}
            style={{
              opacity,
              transform: `translateX(${slideX}px)`,
              display: "flex",
              alignItems: "center",
              gap: 24,
              width: "100%",
              maxWidth: 1100,
              position: "relative",
            }}
          >
            {/* Red X */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                backgroundColor: `${colors.red}22`,
                border: `2px solid ${colors.red}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.body,
                fontSize: 32,
                fontWeight: 900,
                color: colors.red,
                flexShrink: 0,
              }}
            >
              X
            </div>

            {/* Card */}
            <div
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: "24px 32px",
                border: `1px solid ${colors.surfaceLight}`,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.code,
                  fontSize: 26,
                  color: colors.red,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {fail.title}
              </div>
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: 24,
                  color: colors.textMuted,
                }}
              >
                {fail.description}
              </div>
            </div>

            {/* Red strikethrough */}
            <div
              style={{
                position: "absolute",
                left: 80,
                top: "50%",
                height: 3,
                backgroundColor: colors.red,
                width: `${strikeWidth}%`,
                transform: "translateY(-50%)",
                zIndex: 2,
              }}
            />
          </div>
        );
      })}

      {/* Green checkmark */}
      {frame >= checkmarkStart && (
        <div
          style={{
            opacity: checkOpacity,
            fontSize: 64,
            color: colors.green,
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          {"\u2713"}
        </div>
      )}

      {/* Daemon card */}
      {frame >= daemonStart && (
        <div
          style={{
            transform: `translateY(${interpolate(
              daemonSpring,
              [0, 1],
              [80, 0]
            )}px)`,
            opacity: interpolate(
              frame - daemonStart,
              [0, 10],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
            display: "flex",
            alignItems: "center",
            gap: 24,
            width: "100%",
            maxWidth: 1100,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: `${colors.green}22`,
              border: `2px solid ${colors.green}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.body,
              fontSize: 32,
              fontWeight: 900,
              color: colors.green,
              flexShrink: 0,
            }}
          >
            {"\u2713"}
          </div>

          <div
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: "24px 32px",
              border: `2px solid ${colors.green}`,
              boxShadow: `0 0 30px ${colors.green}22`,
            }}
          >
            <div
              style={{
                fontFamily: fonts.code,
                fontSize: 26,
                color: colors.green,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Agent SDK Daemon
            </div>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 24,
                color: colors.textMuted,
              }}
            >
              One persistent process. Watches for PRDs. Runs the full
              pipeline. Never forgets.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
