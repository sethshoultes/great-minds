import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { fonts } from "../styles";

interface ExpiryBadgeProps {
  date: string;
  dissolveFrame: number;
}

/**
 * An expiry badge showing a date with a clock icon.
 * At dissolveFrame the parent note should start its dissolve animation.
 */
export const ExpiryBadge: React.FC<ExpiryBadgeProps> = ({
  date,
  dissolveFrame,
}) => {
  const frame = useCurrentFrame();

  const tickRotation = interpolate(frame, [0, dissolveFrame], [0, 720], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 12,
        fontFamily: fonts.body,
        fontSize: 14,
        color: "#666",
      }}
    >
      {/* Clock icon */}
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#666"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <circle cx={12} cy={12} r={10} />
        <path
          d="M12 6v6l4 2"
          style={{
            transformOrigin: "12px 12px",
            transform: `rotate(${tickRotation}deg)`,
          }}
        />
      </svg>
      <span>Expires: {date}</span>
    </div>
  );
};
