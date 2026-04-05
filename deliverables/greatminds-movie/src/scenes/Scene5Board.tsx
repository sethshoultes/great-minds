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

interface BoardMember {
  name: string;
  avatar?: string;
  initial?: string;
  question: string;
  color: string;
}

const BOARD: BoardMember[] = [
  {
    name: "Jensen Huang",
    avatar: "personas/jensen-huang.webp",
    question: "What's the data moat?",
    color: colors.green,
  },
  {
    name: "Oprah Winfrey",
    avatar: "personas/oprah-winfrey.webp",
    question: "Who is this really for?",
    color: colors.purple,
  },
  {
    name: "Warren Buffett",
    avatar: "personas/warren-buffett.webp",
    question: "What are the unit economics?",
    color: colors.accent,
  },
  {
    name: "Shonda Rhimes",
    avatar: "personas/shonda-rhimes.webp",
    question: "Does the story hold?",
    color: colors.red,
  },
];

/**
 * Scene 5: The Board
 * Four portraits in semicircle, stats counter, Buffett quote card.
 */
export const Scene5Board: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stats animate at ~frame 300
  const statsStart = 300;
  const statsProgress = interpolate(
    frame - statsStart,
    [0, 45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Quote card appears near end
  const quoteStart = 550;
  const quoteOpacity = interpolate(
    frame - quoteStart,
    [0, 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

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
        padding: "40px 100px",
        position: "relative",
      }}
    >
      {/* Board members in semicircle */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 56,
          marginBottom: 48,
        }}
      >
        {BOARD.map((member, i) => {
          const delay = i * 12;
          const memberOpacity = interpolate(
            frame - delay,
            [0, 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <div
              key={member.name}
              style={{
                opacity: memberOpacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `4px solid ${member.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.surface,
                }}
              >
                {member.avatar ? (
                  <Img
                    src={staticFile(member.avatar)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 64,
                      fontWeight: 800,
                      color: member.color,
                    }}
                  >
                    {member.initial}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: 20,
                  fontWeight: 600,
                  color: colors.text,
                }}
              >
                {member.name}
              </div>
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: 22,
                  color: member.color,
                  fontStyle: "italic",
                  textAlign: "center",
                  maxWidth: 280,
                }}
              >
                "{member.question}"
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats counter */}
      <div
        style={{
          fontFamily: fonts.code,
          fontSize: 32,
          color: colors.accent,
          textAlign: "center",
          marginBottom: 40,
          opacity: interpolate(frame - statsStart, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {Math.round(23 * statsProgress)} board reviews.{" "}
        {Math.round(9 * statsProgress)} GitHub issues filed.{" "}
        {Math.round(8 * statsProgress)} fixed.
      </div>

      {/* Buffett quote card */}
      <div
        style={{
          opacity: quoteOpacity,
          backgroundColor: colors.surface,
          border: `2px solid ${colors.accent}`,
          borderRadius: 16,
          padding: "32px 56px",
          maxWidth: 900,
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 36,
            color: colors.text,
            fontStyle: "italic",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          "Warren Buffett called our plugin a hobby.
          <br />
          He was right. We shipped it anyway."
        </div>
      </div>
    </div>
  );
};
