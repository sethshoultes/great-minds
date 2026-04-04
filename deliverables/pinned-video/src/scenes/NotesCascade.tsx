import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { colors, fonts } from "../styles";
import { StickyNote, NoteColor } from "../components/StickyNote";

interface NoteData {
  color: NoteColor;
  text: string;
  rotation: number;
  enterFrame: number;
  aged: boolean;
  x: number;
  y: number;
}

const NOTES: NoteData[] = [
  {
    color: "yellow",
    text: "Homepage banner expires Friday",
    rotation: -3,
    enterFrame: 10,
    aged: false,
    x: 40,
    y: 30,
  },
  {
    color: "blue",
    text: "@sarah the client changed the logo AGAIN",
    rotation: 2.5,
    enterFrame: 25,
    aged: false,
    x: 320,
    y: 50,
  },
  {
    color: "pink",
    text: "Do NOT touch the footer shortcode.",
    rotation: -1.5,
    enterFrame: 40,
    aged: false,
    x: 600,
    y: 20,
  },
  {
    color: "green",
    text: "Blog redesign go-live: next Tuesday",
    rotation: 3,
    enterFrame: 55,
    aged: true,
    x: 80,
    y: 280,
  },
  {
    color: "peach",
    text: "Staging password: see 1Password",
    rotation: -2,
    enterFrame: 70,
    aged: true,
    x: 380,
    y: 300,
  },
];

/**
 * Scene 2 (0:05 - 0:15): Notes appear in quick cascade across the Pinned
 * widget. Five colors, staggered, each with its own rotation. Oldest notes
 * show a subtle aging color shift. @sarah highlights briefly in blue.
 */
export const NotesCascade: React.FC = () => {
  const frame = useCurrentFrame();

  // @sarah highlight pulse: peaks around frame 100-120
  const sarahHighlight = interpolate(frame, [90, 105, 120, 140], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
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
      }}
    >
      {/* Simplified WP sidebar */}
      <div
        style={{
          width: 220,
          height: "100%",
          backgroundColor: colors.wpAdminSidebar,
        }}
      />

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

      {/* Main: Pinned Notes widget full area */}
      <div
        style={{
          flex: 1,
          paddingTop: 72,
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        {/* Widget chrome */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 4,
            border: "1px solid #ddd",
            overflow: "visible",
            position: "relative",
            minHeight: 600,
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
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Pinned Notes</span>
            <span style={{ color: "#999", fontSize: 14 }}>5 notes</span>
          </div>

          {/* Notes area */}
          <div style={{ position: "relative", padding: 20, minHeight: 540 }}>
            {NOTES.map((note, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: note.x,
                  top: note.y,
                }}
              >
                <StickyNote
                  color={note.color}
                  text={note.text}
                  rotation={note.rotation}
                  aged={note.aged}
                  width={260}
                  height={160}
                  fontSize={20}
                  enterFrame={note.enterFrame}
                >
                  {/* @sarah highlight on the blue note */}
                  {note.color === "blue" && sarahHighlight > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -4,
                        borderRadius: 6,
                        border: `3px solid ${colors.wpAdminLink}`,
                        opacity: sarahHighlight,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </StickyNote>
              </div>
            ))}

            {/* VO super text */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: fonts.body,
                fontSize: 24,
                color: colors.textMuted,
                opacity: interpolate(frame, [160, 180, 280, 300], [0, 0.8, 0.8, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              Five colors. Notes that age. Mention a teammate.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
