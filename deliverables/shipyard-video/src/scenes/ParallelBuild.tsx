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
        padding: 40,
        gap: 40,
      }}
    >
      {/* Left: Progress Dashboard */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 16,
            color: colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: 3,
            marginBottom: 30,
            borderBottom: `1px solid ${colors.surfaceLight}`,
            paddingBottom: 16,
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
            fontSize: 16,
            color: colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: 3,
            marginBottom: 30,
            borderBottom: `1px solid ${colors.surfaceLight}`,
            paddingBottom: 16,
          }}
        >
          Live Preview
        </div>

        {/* Browser chrome */}
        <div
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 8,
            border: `1px solid ${colors.surfaceLight}`,
            overflow: "hidden",
          }}
        >
          {/* URL bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderBottom: `1px solid ${colors.surfaceLight}`,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#28c840" }} />
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: colors.surfaceLight,
                borderRadius: 4,
                padding: "4px 12px",
                fontFamily: fonts.code,
                fontSize: 12,
                color: colors.textMuted,
              }}
            >
              https://preview.emdash.dev
            </div>
          </div>

          {/* Site preview content */}
          <div style={{ padding: 24, position: "relative" }}>
            {/* Wireframe state */}
            {currentState.label === "Wireframe" && (
              <div>
                <div
                  style={{
                    width: "60%",
                    height: 20,
                    backgroundColor: colors.surfaceLight,
                    borderRadius: 4,
                    marginBottom: 16,
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: 120,
                    backgroundColor: colors.surfaceLight,
                    borderRadius: 4,
                    marginBottom: 16,
                  }}
                />
                <div style={{ display: "flex", gap: 12 }}>
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      style={{
                        flex: 1,
                        height: 80,
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
                    fontSize: 28,
                    fontWeight: 700,
                    color: colors.text,
                    marginBottom: 16,
                  }}
                >
                  Welcome to Acme Co.
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 120,
                    background: `linear-gradient(135deg, ${colors.blue}44, ${colors.accent}44)`,
                    borderRadius: 8,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: fonts.body,
                    fontSize: 16,
                    color: colors.textMuted,
                  }}
                >
                  Hero Section
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {["Services", "Portfolio", "Contact"].map((label) => (
                    <div
                      key={label}
                      style={{
                        flex: 1,
                        height: 80,
                        backgroundColor: colors.surfaceLight,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: fonts.body,
                        fontSize: 13,
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontFamily: fonts.body, fontSize: 20, fontWeight: 700, color: colors.accent }}>
                    Acme Co.
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    {["Home", "About", "Services", "Contact"].map((nav) => (
                      <span key={nav} style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textMuted }}>
                        {nav}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 120,
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.blue})`,
                    borderRadius: 8,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <span style={{ fontFamily: fonts.body, fontSize: 22, fontWeight: 700, color: "#fff" }}>
                    Build Something Great
                  </span>
                  <span
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 12,
                      color: "#fff",
                      backgroundColor: "rgba(0,0,0,0.3)",
                      padding: "6px 18px",
                      borderRadius: 4,
                    }}
                  >
                    Get Started
                  </span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {["Services", "Portfolio", "Contact"].map((label) => (
                    <div
                      key={label}
                      style={{
                        flex: 1,
                        height: 80,
                        backgroundColor: colors.surface,
                        borderRadius: 8,
                        border: `1px solid ${colors.surfaceLight}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: fonts.body,
                        fontSize: 13,
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
                bottom: 12,
                right: 12,
                fontFamily: fonts.code,
                fontSize: 10,
                color: colors.textMuted,
                backgroundColor: colors.bg,
                padding: "2px 8px",
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
