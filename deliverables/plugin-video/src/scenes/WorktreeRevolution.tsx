import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 2 (0:05 - 0:15): Split view — tmux failure (left) vs worktree success (right)
 * Left panel flickers/dims. Right panel expands. Checkmarks cascade.
 */

const TMUX_PANES = [
  "dispatch:agent-1",
  "dispatch:agent-2",
  "dispatch:agent-3",
  "dispatch:agent-4",
  "dispatch:agent-5",
  "dispatch:agent-6",
  "dispatch:agent-7",
  "dispatch:agent-8",
];

const WORKTREE_TASKS = [
  { label: "brand-audit", agent: "Jobs" },
  { label: "market-analysis", agent: "Musk" },
  { label: "code-scaffold", agent: "Hamilton" },
  { label: "design-system", agent: "Ive" },
  { label: "copy-draft", agent: "Angelou" },
  { label: "qa-sweep", agent: "Huang" },
  { label: "growth-strategy", agent: "Blakely" },
  { label: "risk-assessment", agent: "Aurelius" },
  { label: "narrative-arc", agent: "Sorkin" },
  { label: "team-dynamics", agent: "Jackson" },
  { label: "sound-design", agent: "Rubin" },
  { label: "fundraise-deck", agent: "Buffett" },
];

export const WorktreeRevolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Left panel dims out over frames 60-120
  const leftOpacity = interpolate(frame, [60, 120], [1, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Right panel expands after frame 120
  const rightFlex = interpolate(frame, [120, 160], [1, 2.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flicker effect for left panel
  const flicker = frame > 40 && frame < 100
    ? (Math.sin(frame * 1.7) > 0.3 ? 1 : 0.5)
    : 1;

  // Counter for completed tasks
  const checkStartFrame = 30;
  const framesPerCheck = Math.ceil((60 / 1000) * fps); // 60ms stagger
  const completedCount = Math.min(
    Math.max(0, Math.floor((frame - checkStartFrame) / (framesPerCheck + 8))),
    25
  );
  const counterDisplay = Math.min(completedCount, 25);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        padding: 56,
        gap: 40,
      }}
    >
      {/* Left Panel: Tmux Failure */}
      <div
        style={{
          flex: 1,
          opacity: leftOpacity * flicker,
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
            marginBottom: 32,
            borderBottom: `1px solid ${colors.surfaceLight}`,
            paddingBottom: 18,
          }}
        >
          tmux dispatch
        </div>

        {/* Tmux grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            flex: 1,
          }}
        >
          {TMUX_PANES.map((pane) => (
            <div
              key={pane}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 6,
                border: `1px solid ${colors.surfaceLight}`,
                padding: "12px 14px",
                fontFamily: fonts.code,
                fontSize: 14,
                color: colors.red,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span style={{ color: colors.textMuted, fontSize: 12 }}>{pane}</span>
              <span>FAILED</span>
            </div>
          ))}
        </div>

        {/* Counter */}
        <div
          style={{
            fontFamily: fonts.code,
            fontSize: 28,
            color: colors.red,
            marginTop: 18,
            textAlign: "center",
          }}
        >
          0 of 8 dispatched
        </div>
      </div>

      {/* Right Panel: Worktree Success */}
      <div
        style={{
          flex: rightFlex,
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
            marginBottom: 32,
            borderBottom: `1px solid ${colors.surfaceLight}`,
            paddingBottom: 18,
          }}
        >
          Agent Tool + Worktrees
        </div>

        {/* Task list with branching lines */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          {WORKTREE_TASKS.map((task, i) => {
            const taskFrame = checkStartFrame + i * (framesPerCheck + 8);
            const taskOpacity = interpolate(
              frame - taskFrame,
              [0, 6],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const isDone = frame > taskFrame + 30;

            return (
              <div
                key={task.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  opacity: taskOpacity,
                  fontFamily: fonts.code,
                  fontSize: 20,
                }}
              >
                {/* Branch line */}
                <span style={{ color: colors.surfaceLight, fontSize: 16 }}>
                  {i === WORKTREE_TASKS.length - 1 ? "\\-" : "|-"}
                </span>
                {/* Checkmark or spinner */}
                <span
                  style={{
                    color: isDone ? colors.green : colors.amber,
                    fontSize: 20,
                    width: 22,
                    textAlign: "center",
                  }}
                >
                  {isDone ? "\u2713" : "\u25CB"}
                </span>
                <span style={{ color: colors.text }}>{task.label}</span>
                <span style={{ color: colors.accent, fontSize: 16 }}>{task.agent}</span>
              </div>
            );
          })}
        </div>

        {/* Counter */}
        <div
          style={{
            fontFamily: fonts.code,
            fontSize: 28,
            color: colors.green,
            marginTop: 18,
            textAlign: "center",
          }}
        >
          {counterDisplay}+ tasks complete
        </div>
      </div>
    </div>
  );
};
