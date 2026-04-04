import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";
import { colors, fonts } from "../styles";

interface ChatMessage {
  agent: string;
  avatar: string;
  text: string;
  side: "left" | "right";
  frameIn: number;
  color: string;
}

const MESSAGES: ChatMessage[] = [
  {
    agent: "Steve Jobs",
    avatar: "steve-jobs.webp",
    text: "The homepage needs three elements max. Anything more is clutter.",
    side: "left",
    frameIn: 10,
    color: colors.blue,
  },
  {
    agent: "Elon Musk",
    avatar: "elon-musk.webp",
    text: "Speed over aesthetics. The site should load in under 1 second.",
    side: "right",
    frameIn: 45,
    color: colors.green,
  },
  {
    agent: "Margaret Hamilton",
    avatar: "margaret-hamilton.webp",
    text: "Edge case: what happens when the form submits with no JS?",
    side: "left",
    frameIn: 85,
    color: "#a78bfa",
  },
  {
    agent: "Steve Jobs",
    avatar: "steve-jobs.webp",
    text: "Fine. Three elements, sub-second load. No progressive enhancement compromises the experience.",
    side: "left",
    frameIn: 130,
    color: colors.blue,
  },
  {
    agent: "Elon Musk",
    avatar: "elon-musk.webp",
    text: "Agreed. Ship the static HTML first, hydrate after. Best of both.",
    side: "right",
    frameIn: 170,
    color: colors.green,
  },
];

/**
 * Scene 3 (0:10 - 0:22): War room chat feed with Decision Locked stamp
 */
export const AgentDebate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Decision Locked badge appears at frame 250
  const badgeFrame = 250;
  const badgeProgress = spring({
    frame: frame - badgeFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 200,
      mass: 0.8,
    },
  });

  const badgeOpacity = interpolate(frame - badgeFrame, [0, 5], [0, 1], {
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
        flexDirection: "column",
        padding: "40px 120px",
        position: "relative",
      }}
    >
      {/* Header */}
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
        Strategy War Room
      </div>

      {/* Chat feed */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {MESSAGES.map((msg, i) => {
          const slideIn = interpolate(
            frame - msg.frameIn,
            [0, 12],
            [msg.side === "left" ? -400 : 400, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const msgOpacity = interpolate(
            frame - msg.frameIn,
            [0, 8],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  msg.side === "left" ? "flex-start" : "flex-end",
                marginBottom: 16,
                opacity: msgOpacity,
                transform: `translateX(${slideIn}px)`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  maxWidth: "70%",
                  flexDirection:
                    msg.side === "left" ? "row" : "row-reverse",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: `2px solid ${msg.color}`,
                  }}
                >
                  <Img
                    src={staticFile(`personas/${msg.avatar}`)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 12,
                      color: msg.color,
                      fontWeight: 600,
                      marginBottom: 4,
                      textAlign: msg.side === "left" ? "left" : "right",
                    }}
                  >
                    {msg.agent}
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 18,
                      color: colors.text,
                      backgroundColor: colors.surface,
                      padding: "12px 18px",
                      borderRadius: 12,
                      border: `1px solid ${colors.surfaceLight}`,
                      lineHeight: 1.4,
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Locked Badge */}
      {frame >= badgeFrame && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${badgeProgress})`,
            opacity: badgeOpacity,
          }}
        >
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 48,
              fontWeight: 900,
              color: colors.accent,
              textTransform: "uppercase",
              letterSpacing: 6,
              padding: "20px 50px",
              border: `4px solid ${colors.accent}`,
              borderRadius: 12,
              backgroundColor: `${colors.bg}ee`,
              textAlign: "center",
            }}
          >
            Decision Locked
          </div>
        </div>
      )}
    </div>
  );
};
