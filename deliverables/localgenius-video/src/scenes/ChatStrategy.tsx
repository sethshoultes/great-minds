import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 2 (0:06 - 0:14): Chat interface springs to life.
 * Business owner types: "I run a bakery in Austin. I need more weekday
 * catering orders." LocalGenius responds with a full campaign brief —
 * neighborhood-specific, referencing local events, Tuesday promo.
 * Key phrases highlight in warm gold as they stream in.
 *
 * VO: "LocalGenius doesn't give you a template. It gives you a strategy.
 *      Your neighborhood, your customers, your voice."
 */

const USER_MESSAGE = "I run a bakery in Austin. I need more weekday catering orders.";

const AI_RESPONSE = [
  { text: "Here's your campaign brief for ", highlight: false },
  { text: "Mueller neighborhood", highlight: true },
  { text: ":\n\n", highlight: false },
  { text: "Tuesday Catering Special", highlight: true },
  { text: " — \"Fresh-baked boardroom fuel.\" Target office managers within 2 miles. ", highlight: false },
  { text: "SXSW week", highlight: true },
  { text: " push: partner with 3 co-working spaces for bulk lunch pre-orders. ", highlight: false },
  { text: "Google Business Profile", highlight: false },
  { text: " update queued with new catering photos + weekday hours.", highlight: false },
];

export const ChatStrategy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // User message typing — starts at frame 10, ~50ms per char
  const userCharsPerFrame = 1 / (0.05 * fps);
  const userTypingStart = 10;
  const userCharsVisible = Math.min(
    Math.max(0, Math.floor((frame - userTypingStart) * userCharsPerFrame)),
    USER_MESSAGE.length,
  );
  const displayedUserMsg = USER_MESSAGE.slice(0, userCharsVisible);
  const userDone = userCharsVisible >= USER_MESSAGE.length;

  // AI response streams at 30ms per character, starts after user finishes + 20 frame pause
  const aiStartFrame = userTypingStart + Math.ceil(USER_MESSAGE.length / userCharsPerFrame) + 20;
  const aiCharsPerFrame = 1 / (0.03 * fps);
  const totalAiChars = AI_RESPONSE.reduce((sum, seg) => sum + seg.text.length, 0);
  const aiCharsVisible = Math.min(
    Math.max(0, Math.floor((frame - aiStartFrame) * aiCharsPerFrame)),
    totalAiChars,
  );

  // Build AI response segments with gold highlights
  let charCount = 0;
  const aiSegments = AI_RESPONSE.map((seg) => {
    const segStart = charCount;
    charCount += seg.text.length;
    const visible = Math.max(0, Math.min(seg.text.length, aiCharsVisible - segStart));
    return {
      ...seg,
      visibleText: seg.text.slice(0, visible),
    };
  });

  // Cursor blink
  const cursorBlink = Math.floor(frame / (0.53 * fps)) % 2 === 0;

  // Chat container slide-up
  const containerSlide = interpolate(frame, [0, 12], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const containerOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 56,
      }}
    >
      <div
        style={{
          width: 1200,
          opacity: containerOpacity,
          transform: `translateY(${containerSlide}px)`,
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
            marginBottom: 42,
            borderBottom: `1px solid ${colors.surfaceLight}`,
            paddingBottom: 22,
          }}
        >
          LocalGenius Chat
        </div>

        {/* User message bubble */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              maxWidth: "75%",
              backgroundColor: colors.accent,
              borderRadius: 20,
              borderBottomRightRadius: 4,
              padding: "22px 32px",
            }}
          >
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 28,
                color: "#fff",
                lineHeight: 1.5,
              }}
            >
              {displayedUserMsg}
              {!userDone && (
                <span style={{ opacity: cursorBlink ? 1 : 0 }}>|</span>
              )}
            </div>
          </div>
        </div>

        {/* AI response bubble */}
        {userDone && frame >= aiStartFrame && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: 32,
            }}
          >
            <div style={{ maxWidth: "85%" }}>
              {/* AI label */}
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: 18,
                  color: colors.accent,
                  fontWeight: 700,
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: colors.accent,
                  }}
                />
                LocalGenius
              </div>

              <div
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 20,
                  borderBottomLeftRadius: 4,
                  padding: "26px 36px",
                  border: `1px solid ${colors.surfaceLight}`,
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 27,
                    color: colors.text,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {aiSegments.map((seg, i) => (
                    <span
                      key={i}
                      style={{
                        color: seg.highlight ? colors.gold : colors.text,
                        fontWeight: seg.highlight ? 700 : 400,
                      }}
                    >
                      {seg.visibleText}
                    </span>
                  ))}
                  {aiCharsVisible < totalAiChars && (
                    <span
                      style={{
                        color: colors.accent,
                        opacity: cursorBlink ? 1 : 0,
                      }}
                    >
                      |
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
