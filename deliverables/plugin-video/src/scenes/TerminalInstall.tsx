import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 1 (0:00 - 0:05): Terminal typing + agent name cascade
 * Types: $ npx plugins add sethshoultes/great-minds-plugin
 * Then 14 agent names cascade down the left margin.
 */

const AGENTS = [
  "Jobs",
  "Musk",
  "Hamilton",
  "Lovelace",
  "Huang",
  "Angelou",
  "Aurelius",
  "Ive",
  "Sorkin",
  "Blakely",
  "Buffett",
  "Rhimes",
  "Jackson",
  "Rubin",
];

export const TerminalInstall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const command = "$ npx plugins add sethshoultes/great-minds-plugin";
  const msPerChar = 35;
  const charsPerFrame = 1 / ((msPerChar / 1000) * fps);
  const typingStartFrame = 10;

  const charsVisible = Math.min(
    Math.max(0, Math.floor((frame - typingStartFrame) * charsPerFrame)),
    command.length
  );
  const displayedText = command.slice(0, charsVisible);
  const typingDone = charsVisible >= command.length;

  // Cursor blink
  const cursorBlink = Math.floor(frame / (0.53 * fps)) % 2 === 0;

  // Agent cascade starts after typing finishes
  const cascadeStartFrame = typingStartFrame + Math.ceil(command.length / charsPerFrame) + 5;
  const msPerAgent = 80;
  const framesPerAgent = Math.ceil((msPerAgent / 1000) * fps);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#111111",
          borderRadius: 12,
          padding: "48px 64px",
          border: `1px solid ${colors.surfaceLight}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          minWidth: 1100,
          maxWidth: 1400,
        }}
      >
        {/* Terminal dots */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
        </div>

        {/* Command text */}
        <div
          style={{
            fontFamily: fonts.code,
            fontSize: 38,
            color: colors.green,
            letterSpacing: 0.5,
            marginBottom: typingDone ? 28 : 0,
          }}
        >
          {displayedText}
          <span style={{ opacity: cursorBlink ? 1 : 0, color: colors.accent }}>|</span>
        </div>

        {/* Agent cascade */}
        {typingDone && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {AGENTS.map((agent, i) => {
              const agentFrame = cascadeStartFrame + i * framesPerAgent;
              const agentOpacity = interpolate(
                frame - agentFrame,
                [0, 4],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              // Pulse glow on arrival
              const glowIntensity = interpolate(
                frame - agentFrame,
                [0, 3, 8],
                [0, 1, 0.3],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              if (frame < agentFrame) return null;

              return (
                <div
                  key={agent}
                  style={{
                    fontFamily: fonts.code,
                    fontSize: 22,
                    color: colors.accent,
                    opacity: agentOpacity,
                    textShadow: `0 0 ${glowIntensity * 16}px ${colors.accent}88`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ color: colors.blue }}>{">"}</span>
                  <span>agent:{agent.toLowerCase()}</span>
                  <span style={{ color: colors.green, fontSize: 18 }}>initialized</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
