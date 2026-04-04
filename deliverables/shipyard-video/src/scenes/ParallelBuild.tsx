import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { colors, fonts } from "../styles";
import { ProgressBar } from "../components/ProgressBar";

const BUILD_TRACKS = [
  { label: "Theme Scaffold", agent: "Jony Ive", start: 10, end: 340 },
  { label: "Plugin: Contact Form", agent: "Margaret Hamilton", start: 30, end: 380 },
  { label: "Content & Copy", agent: "Maya Angelou", start: 20, end: 350 },
  { label: "Responsive QA", agent: "Jensen Huang", start: 60, end: 420 },
  { label: "Accessibility Audit", agent: "Marcus Aurelius", start: 80, end: 440 },
  { label: "SEO Optimization", agent: "Sara Blakely", start: 50, end: 400 },
];

const SITE_STATES = [
  { label: "Wireframe", fromFrame: 0, toFrame: 140 },
  { label: "Styled", fromFrame: 140, toFrame: 300 },
  { label: "Rendered", fromFrame: 300, toFrame: 480 },
];

/**
 * Scene 4 (0:22 - 0:38): Build dashboard with parallel progress bars
 */
export const ParallelBuild: React.FC = () => {
  const frame = useCurrentFrame();

  const currentState =
    SITE_STATES.find(
      (s) => frame >= s.fromFrame && frame < s.toFrame
    ) || SITE_STATES[SITE_STATES.length - 1];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        padding: 56,
        gap: 56,
      }}
    >
      {/* Left: Progress Dashboard */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
          Build Dashboard
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {BUILD_TRACKS.map((track, i) => (
            <ProgressBar
              key={track.label}
              label={track.label}
              agent={track.agent}
              startFrame={track.start}
              endFrame={track.end}
              color={i % 2 === 0 ? colors.blue : colors.accent}
            />
          ))}
        </div>
      </div>

      {/* Right: Site Preview */}
      <div
        style={{
          flex: 1,
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
          Live Preview
        </div>

        {/* Browser chrome */}
        <div
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 12,
            border: `1px solid ${colors.surfaceLight}`,
            overflow: "hidden",
          }}
        >
          {/* URL bar */}
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
                padding: "6px 16px",
                fontFamily: fonts.code,
                fontSize: 18,
                color: colors.textMuted,
              }}
            >
              https://preview.emdash.dev
            </div>
          </div>

          {/* Site preview content */}
          <div style={{ padding: 34, position: "relative" }}>
            {/* Wireframe state */}
            {currentState.label === "Wireframe" && (
              <div>
                <div
                  style={{
                    width: "60%",
                    height: 28,
                    backgroundColor: colors.surfaceLight,
                    borderRadius: 6,
                    marginBottom: 22,
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: 168,
                    backgroundColor: colors.surfaceLight,
                    borderRadius: 6,
                    marginBottom: 22,
                  }}
                />
                <div style={{ display: "flex", gap: 16 }}>
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      style={{
                        flex: 1,
                        height: 112,
                        backgroundColor: colors.surfaceLight,
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Styled state */}
            {currentState.label === "Styled" && (
              <div>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 40,
                    fontWeight: 700,
                    color: colors.text,
                    marginBottom: 22,
                  }}
                >
                  Welcome to Acme Co.
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 168,
                    background: `linear-gradient(135deg, ${colors.blue}44, ${colors.accent}44)`,
                    borderRadius: 12,
                    marginBottom: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: fonts.body,
                    fontSize: 24,
                    color: colors.textMuted,
                  }}
                >
                  Hero Section
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  {["Services", "Portfolio", "Contact"].map((label) => (
                    <div
                      key={label}
                      style={{
                        flex: 1,
                        height: 112,
                        backgroundColor: colors.surfaceLight,
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: fonts.body,
                        fontSize: 20,
                        color: colors.textMuted,
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fully rendered state */}
            {currentState.label === "Rendered" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                  <div style={{ fontFamily: fonts.body, fontSize: 28, fontWeight: 700, color: colors.accent }}>
                    Acme Co.
                  </div>
                  <div style={{ display: "flex", gap: 20 }}>
                    {["Home", "About", "Services", "Contact"].map((nav) => (
                      <span key={nav} style={{ fontFamily: fonts.body, fontSize: 18, color: colors.textMuted }}>
                        {nav}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 168,
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.blue})`,
                    borderRadius: 12,
                    marginBottom: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <span style={{ fontFamily: fonts.body, fontSize: 32, fontWeight: 700, color: "#fff" }}>
                    Build Something Great
                  </span>
                  <span
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 18,
                      color: "#fff",
                      backgroundColor: "rgba(0,0,0,0.3)",
                      padding: "8px 24px",
                      borderRadius: 4,
                    }}
                  >
                    Get Started
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  {["Services", "Portfolio", "Contact"].map((label) => (
                    <div
                      key={label}
                      style={{
                        flex: 1,
                        height: 112,
                        backgroundColor: colors.surface,
                        borderRadius: 12,
                        border: `1px solid ${colors.surfaceLight}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: fonts.body,
                        fontSize: 20,
                        color: colors.text,
                        fontWeight: 500,
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* State label */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                fontFamily: fonts.code,
                fontSize: 16,
                color: colors.textMuted,
                backgroundColor: colors.bg,
                padding: "4px 12px",
                borderRadius: 4,
              }}
            >
              {currentState.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
