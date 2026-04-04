import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors, fonts } from "../styles";
import { StickyNote } from "../components/StickyNote";
import { AcknowledgeIcon } from "../components/AcknowledgeIcon";
import { ExpiryBadge } from "../components/ExpiryBadge";

/**
 * Scene 3 (0:15 - 0:28): Teammate logs in, sees @sarah note pulsing,
 * clicks the checkmark (ink-spread fill). Then an expiring note with a date
 * badge dissolves like paper left in the rain.
 */
export const AcknowledgeAndExpire: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Part 1: Dashboard loads, @sarah note pulses
  const dashboardLoadOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gentle pulse on the @sarah note (frames 30-120)
  const pulsePhase = Math.sin((frame - 30) * 0.12) * 0.5 + 0.5;
  const pulseGlow = frame >= 30 && frame < 120 ? pulsePhase : 0;

  // Acknowledge click at frame 130
  const ackFrame = 130;

  // Part 2: Expiry note dissolve starting at frame 220
  const expiryDissolveStart = 220;
  const dissolveProgress = interpolate(
    frame - expiryDissolveStart,
    [0, 60],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Paper buckle effect: slight Y-scale compression + opacity fade
  const buckleShrink = interpolate(dissolveProgress, [0, 0.5, 1], [1, 0.97, 0.92], {
    extrapolateRight: "clamp",
  });
  const dissolveOpacity = interpolate(dissolveProgress, [0, 0.3, 1], [1, 0.7, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.wpAdminGray,
        display: "flex",
        position: "relative",
        opacity: dashboardLoadOpacity,
      }}
    >
      {/* WP sidebar */}
      <div
        style={{
          width: 220,
          height: "100%",
          backgroundColor: colors.wpAdminSidebar,
        }}
      />

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 220,
          right: 0,
          height: 46,
          backgroundColor: colors.wpAdminBar,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <span style={{ fontFamily: fonts.body, fontSize: 16, color: "#c3c4c7" }}>
          Howdy, Sarah
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          paddingTop: 72,
          paddingLeft: 56,
          paddingRight: 56,
          display: "flex",
          gap: 40,
        }}
      >
        {/* Left: @sarah note with acknowledge */}
        <div style={{ flex: 1, position: "relative" }}>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 24,
              color: colors.wpAdminBar,
              textTransform: "uppercase",
              letterSpacing: 4,
              marginBottom: 32,
              borderBottom: "1px solid #ddd",
              paddingBottom: 16,
            }}
          >
            Your Mentions
          </div>

          <div style={{ position: "relative" }}>
            {/* Pulse glow behind the note */}
            <div
              style={{
                position: "absolute",
                inset: -12,
                borderRadius: 12,
                backgroundColor: colors.noteBlue,
                opacity: pulseGlow * 0.25,
                filter: "blur(16px)",
              }}
            />
            <StickyNote
              color="blue"
              text="@sarah the client changed the logo AGAIN"
              rotation={2}
              width={320}
              height={180}
              fontSize={22}
              enterFrame={0}
            >
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <AcknowledgeIcon fillFrame={ackFrame} size={36} />
                <span
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 14,
                    color: "#666",
                    opacity: frame >= ackFrame ? 1 : 0.5,
                  }}
                >
                  {frame >= ackFrame ? "Acknowledged" : "Click to acknowledge"}
                </span>
              </div>
            </StickyNote>
          </div>
        </div>

        {/* Right: Expiring note */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 24,
              color: colors.wpAdminBar,
              textTransform: "uppercase",
              letterSpacing: 4,
              marginBottom: 32,
              borderBottom: "1px solid #ddd",
              paddingBottom: 16,
            }}
          >
            Expiring Soon
          </div>

          <div
            style={{
              opacity: dissolveOpacity,
              transform: `scaleY(${buckleShrink})`,
              transformOrigin: "bottom center",
              filter: `blur(${dissolveProgress * 3}px)`,
            }}
          >
            <StickyNote
              color="peach"
              text="Update the holiday sale banner before launch"
              rotation={-1.5}
              width={320}
              height={180}
              fontSize={22}
              enterFrame={0}
            >
              <ExpiryBadge date="March 15" dissolveFrame={expiryDissolveStart} />
            </StickyNote>
          </div>

          {/* "Note expired" ghost text after dissolve */}
          {dissolveProgress > 0.8 && (
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 16,
                color: "#bbb",
                fontStyle: "italic",
                marginTop: 16,
                opacity: interpolate(dissolveProgress, [0.8, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              Note expired and removed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
