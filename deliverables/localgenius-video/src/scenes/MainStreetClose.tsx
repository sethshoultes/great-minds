import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 6 (0:50 - 1:00): Back to Main Street — bookend.
 * Bakery window shows "Catering Orders Up 40%" notification.
 * Pull back through the window (reverse of Scene 1 dolly zoom).
 * OPEN sign is steady now. LocalGenius logo resolves, then settles
 * on clean dark bg. Below: localgenius.company. Tagline types out:
 * "Your first AI employee. No interview required."
 *
 * VO: "LocalGenius. Your first AI employee. Start at localgenius.company."
 */
export const MainStreetClose: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (frames 0–60): storefront with notification
  const storefrontOpacity = interpolate(frame, [0, 8, 60, 80], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Reverse dolly zoom — scale from 2.4 → 1.0
  const zoom = interpolate(frame, [0, 60], [2.4, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Notification bounce at frame 15
  const notifBounce = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.6 },
  });

  // Phase 2 (frames 80+): Logo + CTA on dark bg
  const showCTA = frame >= 80;

  // Logo fade-in over 800ms (24 frames)
  const logoOpacity = interpolate(frame - 80, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // URL types out starting at frame 120
  const url = "localgenius.company";
  const urlCharsPerFrame = 1 / (0.05 * fps);
  const urlCharsVisible = Math.min(
    Math.max(0, Math.floor((frame - 120) * urlCharsPerFrame)),
    url.length,
  );
  const displayedUrl = url.slice(0, urlCharsVisible);

  // Tagline types out starting at frame 170
  const tagline = "Your first AI employee. No interview required.";
  const taglineCharsPerFrame = 1 / (0.04 * fps);
  const taglineStart = 170;
  const taglineCharsVisible = Math.min(
    Math.max(0, Math.floor((frame - taglineStart) * taglineCharsPerFrame)),
    tagline.length,
  );
  const displayedTagline = tagline.slice(0, taglineCharsVisible);

  // Cursor blink
  const cursorBlink = Math.floor(frame / (0.53 * fps)) % 2 === 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Phase 1: Storefront pull-back */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: colors.creamBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: storefrontOpacity,
          transform: `scale(${zoom})`,
        }}
      >
        {/* Building facade (simplified bookend) */}
        <div
          style={{
            width: 640,
            height: 480,
            backgroundColor: "#e8dcc8",
            borderRadius: 8,
            border: "4px solid #c9b99a",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Awning */}
          <div
            style={{
              width: "110%",
              height: 56,
              background: "linear-gradient(180deg, #b35c3a, #943e24)",
              borderRadius: "0 0 12px 12px",
              marginTop: -4,
            }}
          />

          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 48,
              fontWeight: 800,
              color: "#4a3728",
              marginTop: 18,
            }}
          >
            Mueller Street Bakery
          </div>

          {/* Window with notification on laptop */}
          <div
            style={{
              width: 520,
              height: 280,
              backgroundColor: "#1a1a2e",
              borderRadius: 6,
              border: "6px solid #8b7355",
              marginTop: 16,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Laptop */}
            <div
              style={{
                width: 220,
                height: 150,
                backgroundColor: "#111",
                borderRadius: 8,
                border: `2px solid ${colors.surfaceLight}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Success notification */}
              <div
                style={{
                  transform: `scale(${notifBounce})`,
                  backgroundColor: colors.sage,
                  borderRadius: 8,
                  padding: "10px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  Catering Orders
                </div>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 18,
                    fontWeight: 900,
                    color: "#fff",
                  }}
                >
                  Up 40%
                </div>
              </div>
            </div>
          </div>

          {/* Steady OPEN sign */}
          <div
            style={{
              position: "absolute",
              bottom: 18,
              right: 28,
              fontFamily: fonts.body,
              fontSize: 28,
              fontWeight: 900,
              color: "#ff4d4d",
              textShadow: "0 0 12px #ff4d4d88",
            }}
          >
            OPEN
          </div>
        </div>
      </div>

      {/* Phase 2: Logo + CTA on dark background */}
      {showCTA && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: colors.charcoal,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              opacity: logoOpacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                width: 112,
                height: 112,
                borderRadius: 22,
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.sage})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.body,
                fontSize: 56,
                fontWeight: 900,
                color: colors.charcoal,
              }}
            >
              LG
            </div>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 78,
                fontWeight: 800,
                color: colors.text,
                letterSpacing: -1,
              }}
            >
              LocalGenius
            </div>
          </div>

          {/* URL — types out in monospace */}
          <div
            style={{
              fontFamily: fonts.code,
              fontSize: 36,
              color: colors.accent,
              letterSpacing: 1,
            }}
          >
            {displayedUrl}
          </div>

          {/* Tagline — types out beneath */}
          {frame >= taglineStart && (
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 32,
                color: colors.cream,
                marginTop: 12,
              }}
            >
              {displayedTagline}
              {taglineCharsVisible < tagline.length && (
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
          )}
        </div>
      )}
    </div>
  );
};
