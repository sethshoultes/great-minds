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

const PERSONAS = [
  "jensen-huang.webp",
  "margaret-hamilton.webp",
  "rick-rubin.webp",
  "jony-ive.webp",
  "maya-angelou.webp",
  "sara-blakely.webp",
  "marcus-aurelius.webp",
  "seth-shoultes.webp",
];

/**
 * Scene 2: The Premise
 * Steve vs Elon side by side, then full persona grid tiles in.
 */
export const Scene2Premise: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Steve and Elon fade in
  const steveOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const elonOpacity = interpolate(frame, [8, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // VS glow
  const vsOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Grid appears after ~4 seconds
  const gridStart = 4 * fps;
  // Steve and Elon slide apart
  const slideApart = interpolate(frame - gridStart, [0, 20], [0, 80], {
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
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Persona grid behind */}
      {frame >= gridStart && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 160px)",
            gap: 20,
            opacity: 0.4,
          }}
        >
          {PERSONAS.map((p, i) => {
            const delay = i * 3;
            const o = interpolate(
              frame - gridStart - delay,
              [0, 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const scale = interpolate(
              frame - gridStart - delay,
              [0, 15],
              [0.8, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            // Subtle breathing pulse
            const breathe =
              1 + 0.02 * Math.sin((frame - gridStart) / 30 + i);
            return (
              <div
                key={p}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  overflow: "hidden",
                  opacity: o,
                  transform: `scale(${scale * breathe})`,
                  border: `2px solid ${colors.surfaceLight}`,
                }}
              >
                <Img
                  src={staticFile(`personas/${p}`)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Main duo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 60,
          zIndex: 2,
        }}
      >
        {/* Steve */}
        <div
          style={{
            opacity: steveOpacity,
            transform: `translateX(-${slideApart}px)`,
          }}
        >
          <div
            style={{
              width: 240,
              height: 240,
              borderRadius: "50%",
              overflow: "hidden",
              border: `4px solid ${colors.blue}`,
              boxShadow: `0 0 40px ${colors.blue}44`,
            }}
          >
            <Img
              src={staticFile("personas/steve-jobs.webp")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 28,
              color: colors.text,
              textAlign: "center",
              marginTop: 16,
              fontWeight: 700,
            }}
          >
            Steve Jobs
          </div>
        </div>

        {/* VS */}
        <div
          style={{
            opacity: vsOpacity,
            fontFamily: fonts.body,
            fontSize: 48,
            fontWeight: 900,
            color: colors.accent,
            textShadow: `0 0 40px ${colors.accent}88`,
          }}
        >
          VS
        </div>

        {/* Elon */}
        <div
          style={{
            opacity: elonOpacity,
            transform: `translateX(${slideApart}px)`,
          }}
        >
          <div
            style={{
              width: 240,
              height: 240,
              borderRadius: "50%",
              overflow: "hidden",
              border: `4px solid ${colors.green}`,
              boxShadow: `0 0 40px ${colors.green}44`,
            }}
          >
            <Img
              src={staticFile("personas/elon-musk.webp")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 28,
              color: colors.text,
              textAlign: "center",
              marginTop: 16,
              fontWeight: 700,
            }}
          >
            Elon Musk
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 56,
          opacity: taglineOpacity,
          fontFamily: fonts.body,
          fontSize: 38,
          color: colors.textMuted,
          textAlign: "center",
          maxWidth: 1000,
          lineHeight: 1.5,
          zIndex: 2,
        }}
      >
        Not one AI doing everything.
        <br />A team of specialists who argue.
      </div>
    </div>
  );
};
