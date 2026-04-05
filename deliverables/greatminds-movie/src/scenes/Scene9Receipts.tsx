import React from "react";
import {
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";
import { colors, fonts } from "../styles";

const SCREENSHOTS = [
  { file: "gm-homepage.png", label: "Homepage" },
  { file: "gm-services.png", label: "Services" },
  { file: "gm-work.png", label: "Work" },
  { file: "gm-team.png", label: "Team" },
  { file: "localgenius-homepage.png", label: "LocalGenius" },
  { file: "shipyard-homepage.png", label: "Shipyard" },
];

/**
 * Scene 9: The Receipts
 * 3x2 mosaic of everything built, slow zoom-out.
 */
export const Scene9Receipts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow zoom out
  const zoomScale = interpolate(frame, [0, 300], [1.1, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pipeline fade-in behind at ~60%
  const pipelineOpacity = interpolate(frame, [180, 250], [0, 0.3], {
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
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Faint pipeline behind */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: pipelineOpacity,
          fontFamily: fonts.code,
          fontSize: 28,
          color: colors.accent,
          whiteSpace: "nowrap",
          letterSpacing: 2,
        }}
      >
        PRD {"\u2192"} Debate {"\u2192"} Plan {"\u2192"} Build {"\u2192"} QA{" "}
        {"\u2192"} Board {"\u2192"}{" "}
        <span style={{ fontWeight: 800, textShadow: `0 0 20px ${colors.green}66` }}>
          Ship
        </span>
      </div>

      {/* Screenshot mosaic */}
      <div
        style={{
          transform: `scale(${zoomScale})`,
          display: "grid",
          gridTemplateColumns: "repeat(3, 540px)",
          gridTemplateRows: "repeat(2, 340px)",
          gap: 16,
          zIndex: 2,
        }}
      >
        {SCREENSHOTS.map((shot, i) => {
          const delay = i * 6;
          const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const scale = interpolate(frame - delay, [0, 15], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={shot.file}
              style={{
                opacity,
                transform: `scale(${scale})`,
                borderRadius: 12,
                overflow: "hidden",
                border: `2px solid ${colors.surfaceLight}`,
                position: "relative",
              }}
            >
              <Img
                src={staticFile(shot.file)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* Label overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "10px 16px",
                  background:
                    "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  fontFamily: fonts.body,
                  fontSize: 18,
                  color: colors.text,
                  fontWeight: 600,
                }}
              >
                {shot.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
