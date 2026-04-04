import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors, fonts } from "../styles";
import { StickyNote } from "../components/StickyNote";

/**
 * Scene 5 (0:38 - 0:45): Pinned wordmark on warm white background.
 * Tagline types out. A final sticky note drops in with a soft landing.
 */
export const ClosingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Wordmark fade in over 12 frames (~400ms at 30fps)
  const wordmarkOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline types out starting at frame 20
  const tagline = "Post-it notes for WordPress.";
  const tagCharsPerFrame = 1 / (0.04 * fps);
  const tagCharsVisible = Math.min(
    Math.max(0, Math.floor((frame - 20) * tagCharsPerFrame)),
    tagline.length
  );
  const displayedTagline = tagline.slice(0, tagCharsVisible);

  // Sticky note drops in at frame 80 with bounce
  const noteDropFrame = 80;
  const noteY = spring({
    frame: frame - noteDropFrame,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.8 },
  });

  const noteOpacity = interpolate(frame - noteDropFrame, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sub-tagline appears at frame 140
  const subTagOpacity = interpolate(frame, [140, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.warmWhite,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
      }}
    >
      {/* Wordmark */}
      <div
        style={{
          opacity: wordmarkOpacity,
          fontFamily: fonts.body,
          fontSize: 78,
          fontWeight: 800,
          color: "#1a1a1a",
          letterSpacing: -1,
        }}
      >
        Pinned
      </div>

      {/* Tagline types out */}
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 30,
          color: "#666",
          height: 40,
        }}
      >
        {displayedTagline}
        {tagCharsVisible < tagline.length && (
          <span
            style={{
              opacity: Math.floor(frame / (0.53 * fps)) % 2 === 0 ? 1 : 0,
              color: colors.accent,
            }}
          >
            |
          </span>
        )}
      </div>

      {/* Sticky note with CTA message */}
      {frame >= noteDropFrame && (
        <div
          style={{
            marginTop: 20,
            opacity: noteOpacity,
            transform: `translateY(${(1 - noteY) * -60}px)`,
          }}
        >
          <StickyNote
            color="yellow"
            text="Install it. You'll use it today."
            rotation={3}
            width={340}
            height={140}
            fontSize={26}
            enterFrame={0}
          />
        </div>
      )}

      {/* VO super */}
      <div
        style={{
          marginTop: 32,
          fontFamily: fonts.body,
          fontSize: 22,
          color: "#999",
          opacity: subTagOpacity,
        }}
      >
        The simplest plugin you'll install this year.
      </div>
    </div>
  );
};
