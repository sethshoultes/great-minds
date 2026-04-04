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
import { StickyNote, NoteColor } from "../components/StickyNote";

interface DashNote {
  color: NoteColor;
  text: string;
  rotation: number;
  aged: boolean;
  acknowledged: boolean;
  x: number;
  y: number;
}

const DASHBOARD_NOTES: DashNote[] = [
  { color: "yellow", text: "Homepage banner expires Friday", rotation: -3, aged: false, acknowledged: false, x: 20, y: 16 },
  { color: "blue", text: "@sarah — logo updated, check staging", rotation: 2, aged: false, acknowledged: true, x: 280, y: 30 },
  { color: "pink", text: "Do NOT touch the footer shortcode.", rotation: -1.5, aged: true, acknowledged: false, x: 540, y: 10 },
  { color: "green", text: "New WooCommerce order flow is live", rotation: 2.5, aged: false, acknowledged: false, x: 60, y: 230 },
  { color: "peach", text: "Team standup notes — March 12", rotation: -2.5, aged: true, acknowledged: true, x: 340, y: 250 },
];

/**
 * Scene 4 (0:28 - 0:38): Pull back to full dashboard. A constellation of
 * colorful, slightly tilted notes in the widget. Slow zoom out with
 * micro-wobble as notes settle.
 */
export const FullDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow zoom out from 1.12 to 1.0 over 300 frames (10s)
  const zoom = interpolate(frame, [0, 300], [1.12, 1.0], {
    extrapolateRight: "clamp",
  });

  // Micro-wobble for each note (settles over time)
  const wobbleDecay = interpolate(frame, [0, 180], [1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.wpAdminGray,
        display: "flex",
        position: "relative",
        transform: `scale(${zoom})`,
        transformOrigin: "center center",
      }}
    >
      {/* WP sidebar */}
      <div
        style={{
          width: 220,
          height: "100%",
          backgroundColor: colors.wpAdminSidebar,
          padding: "18px 0",
        }}
      >
        <div style={{ padding: "0 16px 18px" }}>
          <div style={{ fontFamily: fonts.body, fontSize: 20, fontWeight: 700, color: "#fff" }}>
            WordPress
          </div>
        </div>
        {["Dashboard", "Posts", "Media", "Pages", "Plugins"].map((item, i) => (
          <div
            key={item}
            style={{
              padding: "10px 16px",
              fontFamily: fonts.body,
              fontSize: 16,
              color: i === 0 ? "#fff" : "#b4b9be",
              backgroundColor: i === 0 ? colors.wpAdminLink : "transparent",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 220,
          right: 0,
          height: 46,
          backgroundColor: colors.wpAdminBar,
        }}
      />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          paddingTop: 72,
          paddingLeft: 30,
          paddingRight: 30,
          display: "flex",
          gap: 20,
        }}
      >
        {/* Pinned Notes widget — dominant */}
        <div
          style={{
            flex: 2,
            backgroundColor: "#fff",
            borderRadius: 4,
            border: "1px solid #ddd",
            overflow: "visible",
            position: "relative",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #ddd",
              fontFamily: fonts.body,
              fontSize: 16,
              fontWeight: 600,
              color: "#1d2327",
            }}
          >
            Pinned Notes
          </div>
          <div style={{ position: "relative", padding: 16, minHeight: 520 }}>
            {DASHBOARD_NOTES.map((note, i) => {
              const wobble =
                Math.sin(frame * 0.05 + i * 1.7) * 0.8 * wobbleDecay;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: note.x,
                    top: note.y,
                    transform: `rotate(${wobble}deg)`,
                  }}
                >
                  <StickyNote
                    color={note.color}
                    text={note.text}
                    rotation={note.rotation}
                    aged={note.aged}
                    width={240}
                    height={150}
                    fontSize={18}
                    enterFrame={0}
                  >
                    {/* Acknowledged badge */}
                    {note.acknowledged && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 22,
                          height: 22,
                          borderRadius: 11,
                          backgroundColor: "#22c55e",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </StickyNote>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Draft widget — lonely by comparison */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 4,
            border: "1px solid #ddd",
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #ddd",
              fontFamily: fonts.body,
              fontSize: 16,
              fontWeight: 600,
              color: "#1d2327",
            }}
          >
            Quick Draft
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ width: "100%", height: 28, backgroundColor: "#f6f7f7", borderRadius: 4, border: "1px solid #ddd", marginBottom: 12 }} />
            <div style={{ width: "100%", height: 80, backgroundColor: "#f6f7f7", borderRadius: 4, border: "1px solid #ddd" }} />
          </div>
        </div>
      </div>

      {/* VO super */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.body,
          fontSize: 28,
          color: "#555",
          fontWeight: 500,
          opacity: interpolate(frame, [60, 90, 250, 280], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Double-click. Leave a note. Move on.
      </div>
    </div>
  );
};
