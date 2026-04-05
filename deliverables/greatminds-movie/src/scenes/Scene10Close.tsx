import React from "react";
import {
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 10: The Close
 * Logo fade-in, tagline, then URL cards.
 */
export const Scene10Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo fades in over 1 second
  const logoOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(frame, [60, 90], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline fades in 0.5s after logo
  const taglineOpacity = interpolate(frame, [75, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // URL cards fade in after tagline fades
  const urlStart = 200;
  const urlOpacity = interpolate(frame - urlStart, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline fades out before URLs
  const taglineFade = interpolate(frame, [180, 200], [1, 0], {
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
        gap: 36,
      }}
    >
      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <Img
          src={staticFile("logo-combined.webp")}
          style={{
            width: 400,
            height: "auto",
          }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity * taglineFade,
          fontFamily: fonts.body,
          fontSize: 42,
          color: colors.text,
          textAlign: "center",
          fontStyle: "italic",
          maxWidth: 900,
          lineHeight: 1.5,
        }}
      >
        "We built a team that never sleeps.
        <br />
        Now we are teaching it to dream."
      </div>

      {/* URL cards */}
      <div
        style={{
          opacity: urlOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: fonts.code,
            fontSize: 36,
            color: colors.accent,
            letterSpacing: 1,
          }}
        >
          greatminds.company
        </div>
        <div
          style={{
            fontFamily: fonts.code,
            fontSize: 28,
            color: colors.textMuted,
          }}
        >
          github.com/sethshoultes/great-minds
        </div>
      </div>
    </div>
  );
};
