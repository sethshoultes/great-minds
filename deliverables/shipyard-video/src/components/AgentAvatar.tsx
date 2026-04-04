import React from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "../styles";

interface AgentAvatarProps {
  name: string;
  imageSrc: string;
  delay: number;
  size?: number;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  name,
  imageSrc,
  delay,
  size = 80,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glow = interpolate(frame - delay, [0, 8, 16], [0, 1, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          border: `2px solid ${colors.accent}`,
          boxShadow: `0 0 ${glow * 20}px ${colors.accent}88`,
        }}
      >
        <Img
          src={imageSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: fonts.body,
          fontSize: 11,
          color: colors.text,
          textAlign: "center",
          opacity: interpolate(frame - delay, [5, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {name}
      </span>
    </div>
  );
};
