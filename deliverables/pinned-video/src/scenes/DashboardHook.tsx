import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors, fonts } from "../styles";
import { StickyNote } from "../components/StickyNote";

/**
 * Scene 1 (0:00 - 0:05): WordPress dashboard, cursor drifts, double-click
 * spawns a bright yellow sticky note with a blinking cursor inside.
 */
export const DashboardHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cursor drift across the screen
  const cursorX = interpolate(frame, [0, 60, 90], [300, 900, 780], {
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [0, 60, 90], [400, 350, 420], {
    extrapolateRight: "clamp",
  });

  // Note appears at frame 90 (3s) via double-click
  const noteAppearFrame = 90;
  const noteVisible = frame >= noteAppearFrame;

  const noteScale = spring({
    frame: frame - noteAppearFrame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.7 },
  });

  // Blinking cursor inside the note
  const noteCursorBlink = Math.floor(frame / (0.53 * fps)) % 2 === 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.wpAdminGray,
        display: "flex",
        position: "relative",
      }}
    >
      {/* WP Admin sidebar */}
      <div
        style={{
          width: 220,
          height: "100%",
          backgroundColor: colors.wpAdminSidebar,
          padding: "18px 0",
        }}
      >
        {/* WP logo area */}
        <div
          style={{
            padding: "0 16px 18px",
            borderBottom: "1px solid #3c4349",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            WordPress
          </div>
        </div>
        {/* Menu items */}
        {["Dashboard", "Posts", "Media", "Pages", "Plugins", "Users", "Settings"].map(
          (item, i) => (
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
          )
        )}
      </div>

      {/* WP Admin top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 220,
          right: 0,
          height: 46,
          backgroundColor: colors.wpAdminBar,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <span style={{ fontFamily: fonts.body, fontSize: 16, color: "#c3c4c7" }}>
          Dashboard
        </span>
      </div>

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          paddingTop: 72,
          paddingLeft: 40,
          paddingRight: 40,
          position: "relative",
        }}
      >
        {/* Welcome panel placeholder */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 4,
            padding: "28px 32px",
            border: "1px solid #ddd",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 28,
              fontWeight: 400,
              color: "#1d2327",
            }}
          >
            Welcome to WordPress!
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 16,
              color: "#646970",
              marginTop: 8,
            }}
          >
            Get started by customizing your site.
          </div>
        </div>

        {/* Dashboard widgets row */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* Quick Draft widget */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 4,
              border: "1px solid #ddd",
              overflow: "hidden",
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
              <div
                style={{
                  width: "100%",
                  height: 28,
                  backgroundColor: "#f6f7f7",
                  borderRadius: 4,
                  border: "1px solid #ddd",
                  marginBottom: 12,
                }}
              />
              <div
                style={{
                  width: "100%",
                  height: 80,
                  backgroundColor: "#f6f7f7",
                  borderRadius: 4,
                  border: "1px solid #ddd",
                }}
              />
            </div>
          </div>

          {/* Pinned Notes widget (empty initially) */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 4,
              border: "1px solid #ddd",
              overflow: "hidden",
              position: "relative",
              minHeight: 240,
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
            <div
              style={{
                padding: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 180,
                position: "relative",
              }}
            >
              {!noteVisible && (
                <span
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 15,
                    color: "#999",
                  }}
                >
                  Double-click to add a note...
                </span>
              )}

              {/* The sticky note that appears */}
              {noteVisible && (
                <div
                  style={{
                    transform: `scale(${noteScale})`,
                    transformOrigin: "center center",
                  }}
                >
                  <StickyNote
                    color="yellow"
                    text=""
                    rotation={-2.5}
                    width={200}
                    height={140}
                    fontSize={20}
                    enterFrame={0}
                  >
                    <span
                      style={{
                        opacity: noteCursorBlink ? 1 : 0,
                        color: "#333",
                        fontSize: 22,
                      }}
                    >
                      |
                    </span>
                  </StickyNote>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Animated cursor */}
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            width: 20,
            height: 20,
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          <svg width={20} height={20} viewBox="0 0 20 20">
            <path
              d="M2 2l7 16 2-7 7-2L2 2z"
              fill="#333"
              stroke="#fff"
              strokeWidth={1}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
