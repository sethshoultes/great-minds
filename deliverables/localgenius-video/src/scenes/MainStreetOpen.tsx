import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 1 (0:00 - 0:06): Main Street at golden hour.
 * Camera pushes toward a bakery storefront. The "OPEN" sign flickers.
 * A laptop glows inside. We dolly-zoom into the screen — a blank
 * marketing dashboard with a blinking cursor.
 *
 * VO: "You opened a business because you're great at something.
 *      Not because you wanted to write ad copy at midnight."
 */
export const MainStreetOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dolly-zoom: scale the storefront from 1.0 → 2.8 over 4s (frames 30–150)
  const zoom = interpolate(frame, [30, 150], [1.0, 2.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // OPEN sign flicker — irregular blink pattern
  const flickerCycle = Math.sin(frame * 0.7) + Math.sin(frame * 1.3);
  const openSignOpacity = flickerCycle > 0.4 ? 1 : 0.25;
  // Sign stops flickering once we zoom past the glass
  const steadySign = frame > 120 ? 1 : openSignOpacity;

  // Laptop glow pulse
  const laptopGlow = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.7, 1],
  );

  // Dashboard cursor blink (once we're "inside" the screen — frame > 120)
  const cursorBlink = Math.floor(frame / (0.53 * fps)) % 2 === 0;
  const insideScreen = frame > 120;

  // Cross-fade: storefront fades, dashboard takes over
  const storefrontOpacity = interpolate(frame, [100, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dashboardOpacity = interpolate(frame, [100, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.creamBg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* === Storefront layer === */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${zoom})`,
          opacity: storefrontOpacity,
        }}
      >
        {/* Building facade */}
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

          {/* Sign: bakery name */}
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 48,
              fontWeight: 800,
              color: "#4a3728",
              marginTop: 18,
              letterSpacing: -1,
            }}
          >
            Mueller Street Bakery
          </div>

          {/* Window frame */}
          <div
            style={{
              width: 520,
              height: 280,
              backgroundColor: "#1a1a2e",
              borderRadius: 6,
              border: "6px solid #8b7355",
              marginTop: 16,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Laptop inside the window */}
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
                boxShadow: `0 0 ${laptopGlow * 40}px ${colors.accent}44`,
              }}
            >
              <div
                style={{
                  width: 180,
                  height: 110,
                  backgroundColor: colors.surface,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fonts.code,
                  fontSize: 14,
                  color: colors.textMuted,
                }}
              >
                Dashboard
              </div>
            </div>
          </div>

          {/* OPEN sign */}
          <div
            style={{
              position: "absolute",
              bottom: 18,
              right: 28,
              fontFamily: fonts.body,
              fontSize: 28,
              fontWeight: 900,
              color: "#ff4d4d",
              opacity: steadySign,
              textShadow: `0 0 12px #ff4d4d88`,
            }}
          >
            OPEN
          </div>
        </div>
      </div>

      {/* === Dashboard layer (blank marketing dashboard) === */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: colors.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: dashboardOpacity,
        }}
      >
        {/* Empty dashboard chrome */}
        <div
          style={{
            width: 1100,
            backgroundColor: colors.surface,
            borderRadius: 16,
            border: `1px solid ${colors.surfaceLight}`,
            overflow: "hidden",
          }}
        >
          {/* Browser bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 22px",
              borderBottom: `1px solid ${colors.surfaceLight}`,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#febc2e" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#28c840" }} />
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: colors.surfaceLight,
                borderRadius: 6,
                padding: "8px 18px",
                fontFamily: fonts.code,
                fontSize: 20,
                color: colors.textMuted,
              }}
            >
              app.localgenius.company/dashboard
            </div>
          </div>

          {/* Empty content area */}
          <div
            style={{
              padding: "80px 60px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 360,
            }}
          >
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 36,
                color: colors.textMuted,
                marginBottom: 28,
              }}
            >
              What should we post today?
            </div>

            {/* Blinking cursor input */}
            <div
              style={{
                width: 700,
                height: 64,
                backgroundColor: colors.bg,
                borderRadius: 12,
                border: `2px solid ${colors.surfaceLight}`,
                display: "flex",
                alignItems: "center",
                paddingLeft: 24,
              }}
            >
              <span
                style={{
                  fontFamily: fonts.code,
                  fontSize: 28,
                  color: colors.accent,
                  opacity: insideScreen && cursorBlink ? 1 : 0,
                }}
              >
                |
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
