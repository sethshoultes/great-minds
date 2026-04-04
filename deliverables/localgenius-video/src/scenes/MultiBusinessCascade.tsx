import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 5 (0:36 - 0:50): Calendar fills with scheduled content.
 * Camera pulls back to reveal three browser windows cascade:
 * bakery, yoga studio, plumber — each with different content and voice.
 * All three minimize into a terminal with a deployment log:
 * "265 files deployed. 14 agents completed. Build successful."
 *
 * VO: "A bakery in Austin. A yoga studio in Portland. A plumber in
 *      Detroit. Three different businesses. Three different voices.
 *      Same genius."
 */

interface BusinessWindow {
  name: string;
  city: string;
  color: string;
  url: string;
  posts: string[];
}

const BUSINESSES: BusinessWindow[] = [
  {
    name: "Mueller Street Bakery",
    city: "Austin, TX",
    color: colors.gold,
    url: "bakery.localgenius.company",
    posts: ["Tues Catering Special", "SXSW Lunch Deals", "Fresh Pastry Friday"],
  },
  {
    name: "Flow State Yoga",
    city: "Portland, OR",
    color: colors.accent,
    url: "flowstate.localgenius.company",
    posts: ["Morning Flow Series", "New Student Intro", "Workshop: Breathwork"],
  },
  {
    name: "Detroit Drain Pros",
    city: "Detroit, MI",
    color: "#3b82f6",
    url: "drainpros.localgenius.company",
    posts: ["24/7 Emergency Service", "Winter Pipe Tips", "Customer Spotlight"],
  },
];

const DEPLOY_LINES = [
  "$ localgenius deploy --all",
  "Compiling 265 files...",
  "14 agents completed tasks",
  "Running test suite... 770/770 passed",
  "Deploying to production...",
  "Build successful.",
];

export const MultiBusinessCascade: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (frames 0–160): Calendar fills
  const calendarOpacity = interpolate(frame, [0, 10, 160, 180], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2 (frames 180–320): Three cascading browser windows
  const showWindows = frame >= 180;
  const windowsOpacity = interpolate(frame, [180, 200, 320, 340], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 3 (frames 340+): Terminal with deployment log
  const showTerminal = frame >= 340;
  const terminalScale = spring({
    frame: frame - 340,
    fps,
    config: { damping: 14, stiffness: 100, mass: 1 },
  });

  // Calendar days
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const calendarPosts = [
    ["Social", "Email"],
    ["Blog", "Social", "Review"],
    ["Social", "GBP"],
    ["Email", "Social"],
    ["Blog", "Social", "Voice"],
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Phase 1: Calendar view */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 56,
          opacity: calendarOpacity,
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 24,
            color: colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: 42,
            borderBottom: `1px solid ${colors.surfaceLight}`,
            paddingBottom: 22,
            width: 1200,
          }}
        >
          Content Calendar — This Week
        </div>

        <div style={{ display: "flex", gap: 20, width: 1200 }}>
          {days.map((day, dayIdx) => {
            const dayDelay = dayIdx * 18; // typewriter rhythm
            return (
              <div
                key={day}
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  border: `1px solid ${colors.surfaceLight}`,
                  padding: "20px 18px",
                  opacity: interpolate(frame - dayDelay, [0, 10], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 22,
                    fontWeight: 700,
                    color: colors.text,
                    marginBottom: 18,
                    textAlign: "center",
                  }}
                >
                  {day}
                </div>
                {calendarPosts[dayIdx].map((post, postIdx) => {
                  const postDelay = dayDelay + postIdx * 8 + 12;
                  const postOpacity = interpolate(
                    frame - postDelay,
                    [0, 8],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  );
                  return (
                    <div
                      key={postIdx}
                      style={{
                        backgroundColor: colors.bg,
                        borderRadius: 8,
                        padding: "10px 14px",
                        marginBottom: 10,
                        opacity: postOpacity,
                        borderLeft: `3px solid ${colors.accent}`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: fonts.code,
                          fontSize: 15,
                          color: colors.textMuted,
                        }}
                      >
                        {post}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase 2: Cascading browser windows */}
      {showWindows && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: windowsOpacity,
          }}
        >
          {BUSINESSES.map((biz, i) => {
            const winDelay = (frame - 180) - i * 6; // 200ms stagger
            const winScale = spring({
              frame: winDelay,
              fps,
              config: { damping: 14, stiffness: 120, mass: 0.8 },
            });
            const offsetX = (i - 1) * 380;
            const offsetY = i * 24;

            return (
              <div
                key={biz.name}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${offsetX}px)`,
                  top: `calc(50% + ${offsetY}px)`,
                  transform: `translate(-50%, -50%) scale(${winScale})`,
                  width: 540,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  border: `1px solid ${colors.surfaceLight}`,
                  overflow: "hidden",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                  zIndex: 3 - i,
                }}
              >
                {/* Browser bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 18px",
                    borderBottom: `1px solid ${colors.surfaceLight}`,
                  }}
                >
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
                    <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
                    <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      backgroundColor: colors.surfaceLight,
                      borderRadius: 4,
                      padding: "4px 12px",
                      fontFamily: fonts.code,
                      fontSize: 14,
                      color: colors.textMuted,
                    }}
                  >
                    {biz.url}
                  </div>
                </div>

                {/* Window content */}
                <div style={{ padding: "22px 24px" }}>
                  <div
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 26,
                      fontWeight: 700,
                      color: biz.color,
                      marginBottom: 6,
                    }}
                  >
                    {biz.name}
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 16,
                      color: colors.textMuted,
                      marginBottom: 18,
                    }}
                  >
                    {biz.city}
                  </div>
                  {biz.posts.map((post, pi) => (
                    <div
                      key={pi}
                      style={{
                        backgroundColor: colors.bg,
                        borderRadius: 8,
                        padding: "10px 16px",
                        marginBottom: 8,
                        borderLeft: `3px solid ${biz.color}`,
                        fontFamily: fonts.code,
                        fontSize: 16,
                        color: colors.text,
                      }}
                    >
                      {post}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phase 3: Terminal deployment log */}
      {showTerminal && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              transform: `scale(${terminalScale})`,
              width: 900,
              backgroundColor: "#111111",
              borderRadius: 16,
              border: `1px solid ${colors.surfaceLight}`,
              padding: "36px 44px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Terminal dots */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#febc2e" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#28c840" }} />
            </div>

            {DEPLOY_LINES.map((line, i) => {
              const lineDelay = (frame - 340) - i * 12;
              const lineOpacity = interpolate(lineDelay, [0, 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const isLast = i === DEPLOY_LINES.length - 1;
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: fonts.code,
                    fontSize: 26,
                    color: isLast ? colors.accent : i === 0 ? colors.sage : colors.textMuted,
                    fontWeight: isLast ? 700 : 400,
                    marginBottom: 14,
                    opacity: lineOpacity,
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
