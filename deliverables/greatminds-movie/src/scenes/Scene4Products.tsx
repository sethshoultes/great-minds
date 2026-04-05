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

interface ProductCard {
  title: string;
  label: string;
  image?: string;
  useLogoMark?: boolean;
  frameIn: number;
}

const PRODUCTS: ProductCard[] = [
  {
    title: "Dash",
    label: "Cmd+K for WordPress. 26KB. Zero dependencies.",
    image: "work/dash/dash-screenshot.png",
    frameIn: 20,
  },
  {
    title: "Pinned",
    label: "Sticky notes in wp-admin. Five colors. @mentions.",
    image: "work/pinned/pinned-dashboard.png",
    frameIn: 50,
  },
  {
    title: "Narrate",
    label: "Video narration. Remotion pipeline. Aaron Sorkin writes the scripts.",
    useLogoMark: true,
    frameIn: 80,
  },
];

/**
 * Scene 4: The Products
 * Three product cards fly in with spring physics.
 */
export const Scene4Products: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
        padding: "0 80px",
      }}
    >
      {PRODUCTS.map((product, i) => {
        const springVal = spring({
          frame: frame - product.frameIn,
          fps,
          config: { damping: 14, stiffness: 120, mass: 0.8 },
        });

        const translateY = interpolate(springVal, [0, 1], [300, 0]);
        const opacity = interpolate(
          frame - product.frameIn,
          [0, 10],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Active card scales up when VO mentions it
        const mentionFrame = product.frameIn + 30;
        const isActive =
          frame >= mentionFrame &&
          frame < mentionFrame + 120;
        const scale = isActive ? 1.05 : 1;
        const cardOpacity = isActive ? 1 : 0.8;

        return (
          <div
            key={product.title}
            style={{
              opacity: opacity * cardOpacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              width: 520,
              backgroundColor: colors.surface,
              borderRadius: 20,
              border: `2px solid ${
                isActive ? colors.accent : colors.surfaceLight
              }`,
              overflow: "hidden",
              boxShadow: isActive
                ? `0 20px 60px ${colors.accent}22`
                : "0 20px 60px rgba(0,0,0,0.4)",
              transition: "box-shadow 0.3s",
            }}
          >
            {/* Image or logo */}
            <div
              style={{
                height: 300,
                backgroundColor: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {product.image ? (
                <Img
                  src={staticFile(product.image)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Img
                  src={staticFile("logo-combined.webp")}
                  style={{
                    width: 200,
                    height: "auto",
                  }}
                />
              )}
            </div>

            {/* Label */}
            <div style={{ padding: "28px 32px" }}>
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: 32,
                  fontWeight: 800,
                  color: colors.accent,
                  marginBottom: 12,
                }}
              >
                {product.title}
              </div>
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: 22,
                  color: colors.textMuted,
                  lineHeight: 1.5,
                }}
              >
                {product.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
