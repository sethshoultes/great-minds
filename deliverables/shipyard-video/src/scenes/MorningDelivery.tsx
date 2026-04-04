import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 6 (0:50 - 1:02): Clock time-lapse + all bars 100% + deployed
 */
export const MorningDelivery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Clock rotation: 11PM to 7AM = 8 hours = 240 degrees of hour hand
  const hourAngle = interpolate(frame, [0, 200], [330, 210 + 360], {
    extrapolateRight: "clamp",
  });
  const minuteAngle = interpolate(frame, [0, 200], [0, 360 * 8], {
    extrapolateRight: "clamp",
  });

  // Time display
  const hoursElapsed = interpolate(frame, [0, 200], [0, 8], {
    extrapolateRight: "clamp",
  });
  const currentHour = Math.floor(23 + hoursElapsed) % 24;
  const displayHour = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour;
  const amPm = currentHour >= 12 ? "PM" : "AM";
  const displayMin = Math.floor((hoursElapsed % 1) * 60);

  // Progress bars all hit 100 around frame 200
  const tracks = [
    { label: "Theme", end: 160 },
    { label: "Plugins", end: 170 },
    { label: "Content", end: 180 },
    { label: "QA", end: 190 },
    { label: "A11y", end: 195 },
    { label: "SEO", end: 200 },
  ];

  // Browser expand animation starts at frame 220
  const browserScale = spring({
    frame: frame - 220,
    fps,
    config: { damping: 14, stiffness: 100, mass: 1 },
  });

  const browserExpand = frame >= 220 ? browserScale : 0;

  // Deployed badge at frame 260
  const deployedOpacity = interpolate(frame - 260, [0, 15], [0, 1], {
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
      {/* Top section: clock + bars (fades out as browser expands) */}
      <div
        style={{
          display: "flex",
          gap: 80,
          alignItems: "center",
          opacity: interpolate(browserExpand, [0, 0.5], [1, 0], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        {/* Analog Clock */}
        <div style={{ position: "relative", width: 200, height: 200 }}>
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: `3px solid ${colors.surfaceLight}`,
              position: "relative",
            }}
          >
            {/* Hour markers */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 2,
                  height: 10,
                  backgroundColor: colors.textMuted,
                  transformOrigin: "center 0",
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-88px)`,
                }}
              />
            ))}
            {/* Hour hand */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 4,
                height: 50,
                backgroundColor: colors.text,
                borderRadius: 2,
                transformOrigin: "bottom center",
                transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
              }}
            />
            {/* Minute hand */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 2,
                height: 70,
                backgroundColor: colors.accent,
                borderRadius: 2,
                transformOrigin: "bottom center",
                transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
              }}
            />
            {/* Center dot */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: colors.accent,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
          {/* Digital time */}
          <div
            style={{
              textAlign: "center",
              marginTop: 12,
              fontFamily: fonts.code,
              fontSize: 20,
              color: colors.textMuted,
            }}
          >
            {displayHour}:{String(displayMin).padStart(2, "0")} {amPm}
          </div>
        </div>

        {/* Mini progress bars */}
        <div style={{ width: 300 }}>
          {tracks.map((track) => {
            const progress = interpolate(frame, [0, track.end], [40, 100], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const isComplete = progress >= 100;
            return (
              <div key={track.label} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: fonts.body,
                    fontSize: 13,
                    color: isComplete ? colors.green : colors.textMuted,
                    marginBottom: 3,
                  }}
                >
                  <span>{track.label}</span>
                  <span>{isComplete ? "\u2713" : `${Math.round(progress)}%`}</span>
                </div>
                <div
                  style={{
                    height: 6,
                    backgroundColor: colors.surfaceLight,
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      backgroundColor: isComplete ? colors.green : colors.blue,
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Browser window (expands to fill frame) */}
      {frame >= 220 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${browserExpand})`,
            width: 900,
            backgroundColor: colors.surface,
            borderRadius: 12,
            border: `1px solid ${colors.surfaceLight}`,
            overflow: "hidden",
          }}
        >
          {/* URL bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderBottom: `1px solid ${colors.surfaceLight}`,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#28c840" }} />
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: colors.surfaceLight,
                borderRadius: 4,
                padding: "4px 12px",
                fontFamily: fonts.code,
                fontSize: 12,
                color: colors.green,
              }}
            >
              https://acme-co.emdash.dev
            </div>
          </div>

          {/* Site content */}
          <div style={{ padding: 30, minHeight: 300 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontFamily: fonts.body, fontSize: 22, fontWeight: 700, color: colors.accent }}>
                Acme Co.
              </span>
              <div style={{ display: "flex", gap: 16 }}>
                {["Home", "About", "Services", "Blog", "Contact"].map((n) => (
                  <span key={n} style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textMuted }}>{n}</span>
                ))}
              </div>
            </div>
            <div
              style={{
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.blue})`,
                borderRadius: 8,
                padding: 30,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              <div style={{ fontFamily: fonts.body, fontSize: 28, fontWeight: 700, color: "#fff" }}>
                Build Something Great
              </div>
              <div style={{ fontFamily: fonts.body, fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 8 }}>
                Powered by Shipyard AI
              </div>
            </div>
          </div>

          {/* Deployed badge */}
          {frame >= 260 && (
            <div
              style={{
                position: "absolute",
                top: 60,
                right: 20,
                opacity: deployedOpacity,
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: `${colors.green}22`,
                border: `1px solid ${colors.green}`,
                borderRadius: 6,
                padding: "6px 14px",
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: colors.green }} />
              <span style={{ fontFamily: fonts.code, fontSize: 13, color: colors.green, fontWeight: 600 }}>
                Deployed
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
