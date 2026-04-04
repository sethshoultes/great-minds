import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 3 (0:14 - 0:26): 2x3 content grid.
 * Six outputs generate simultaneously — social post, Google Business
 * update, email campaign, blog outline, review response, voice memo
 * transcription. Each tile completes at a different time with an
 * "AI Draft" → "Ready to Post" card-flip badge.
 *
 * VO: "One conversation becomes six pieces of content..."
 */

interface ContentTile {
  title: string;
  icon: string;
  preview: string;
  completionFrame: number;
}

const TILES: ContentTile[] = [
  {
    title: "Social Post",
    icon: "📱",
    preview: '"Tuesday Catering Special — fresh-baked boardroom fuel. Order by Mon 5pm..."',
    completionFrame: 80,
  },
  {
    title: "Google Business",
    icon: "📍",
    preview: "Updated hours: Weekday catering 7am–2pm. New photos: 4 uploaded.",
    completionFrame: 100,
  },
  {
    title: "Email Campaign",
    icon: "✉️",
    preview: "Subject: Your team deserves better than cold pizza. Body: 3 paragraphs + CTA",
    completionFrame: 120,
  },
  {
    title: "Blog Outline",
    icon: "📝",
    preview: "5 Reasons to Cater Local for Your Next Team Lunch — 800 words, SEO-optimized",
    completionFrame: 140,
  },
  {
    title: "Review Response",
    icon: "⭐",
    preview: '"Thanks Maria! We\'re glad the pastry platter was a hit at your..."',
    completionFrame: 160,
  },
  {
    title: "Voice Memo → Copy",
    icon: "🎙️",
    preview: "Transcribed 47s memo → polished catering menu description. Ready for print.",
    completionFrame: 180,
  },
];

export const ContentGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
        padding: 56,
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 24,
          color: colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: 4,
          marginBottom: 48,
          borderBottom: `1px solid ${colors.surfaceLight}`,
          paddingBottom: 22,
          width: 1400,
        }}
      >
        Content Generated
      </div>

      {/* 2x3 Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 28,
          width: 1400,
          justifyContent: "center",
        }}
      >
        {TILES.map((tile, i) => {
          // Staggered cascade: 400ms (12 frames) apart, top-left to bottom-right
          const tileDelay = i * 12;

          const tileOpacity = interpolate(
            frame - tileDelay,
            [0, 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const tileSlide = interpolate(
            frame - tileDelay,
            [0, 12],
            [40, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          const isComplete = frame >= tile.completionFrame;

          // Badge flip animation
          const badgeFlip = spring({
            frame: frame - tile.completionFrame,
            fps,
            config: { damping: 14, stiffness: 200, mass: 0.6 },
          });
          const badgeRotateY = isComplete
            ? interpolate(badgeFlip, [0, 1], [180, 360])
            : 0;

          // Content reveal — text streams in
          const previewCharsPerFrame = 1 / (0.02 * fps);
          const previewCharsVisible = Math.min(
            Math.max(0, Math.floor((frame - tileDelay - 12) * previewCharsPerFrame)),
            tile.preview.length,
          );

          return (
            <div
              key={tile.title}
              style={{
                width: 440,
                backgroundColor: colors.surface,
                borderRadius: 16,
                border: `1px solid ${colors.surfaceLight}`,
                padding: "28px 32px",
                opacity: tileOpacity,
                transform: `translateY(${tileSlide}px)`,
                position: "relative",
              }}
            >
              {/* Tile header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 32 }}>{tile.icon}</span>
                  <span
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 24,
                      fontWeight: 700,
                      color: colors.text,
                    }}
                  >
                    {tile.title}
                  </span>
                </div>

                {/* Badge: AI Draft → Ready to Post */}
                <div
                  style={{
                    fontFamily: fonts.code,
                    fontSize: 14,
                    fontWeight: 700,
                    color: isComplete ? colors.bg : colors.gold,
                    backgroundColor: isComplete ? colors.sage : "transparent",
                    border: `1px solid ${isComplete ? colors.sage : colors.gold}`,
                    borderRadius: 6,
                    padding: "6px 14px",
                    transform: `rotateY(${badgeRotateY}deg)`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  {isComplete ? "Ready to Post" : "AI Draft"}
                </div>
              </div>

              {/* Preview text */}
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: 19,
                  color: colors.textMuted,
                  lineHeight: 1.5,
                  minHeight: 72,
                }}
              >
                {tile.preview.slice(0, previewCharsVisible)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
