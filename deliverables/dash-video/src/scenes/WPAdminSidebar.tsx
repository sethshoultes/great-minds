import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { colors, fonts } from "../styles";

const SIDEBAR_ITEMS = [
  { icon: "\u{1F4CA}", label: "Dashboard" },
  { icon: "\u{1F4DD}", label: "Posts" },
  { icon: "\u{1F4C4}", label: "Pages" },
  { icon: "\u{1F3A8}", label: "Appearance" },
  { icon: "\u{1F50C}", label: "Plugins" },
  { icon: "\u{1F465}", label: "Users" },
  { icon: "\u2699\uFE0F", label: "Settings" },
  { icon: "\u{1F6E0}\uFE0F", label: "Tools" },
];

/**
 * Scene 1 (0:00 - 0:05): WordPress admin sidebar with mouse drift and dim
 * Mouse drifts toward sidebar, hesitates, stops. Sidebar dims to 40%.
 */
export const WPAdminSidebar: React.FC = () => {
  const frame = useCurrentFrame();

  // Mouse cursor drifts left over first 3 seconds (90 frames), then freezes
  const cursorX = interpolate(frame, [0, 60, 90], [960, 400, 320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [0, 60, 90], [540, 480, 460], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sidebar dims to 40% opacity after beat at frame 100
  const sidebarOpacity = interpolate(frame, [100, 120], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.wpAdmin,
        display: "flex",
        position: "relative",
      }}
    >
      {/* WordPress Sidebar */}
      <div
        style={{
          width: 260,
          backgroundColor: "#23282d",
          height: "100%",
          padding: "28px 0",
          opacity: sidebarOpacity,
          borderRight: "1px solid #333",
        }}
      >
        {/* WP Logo */}
        <div
          style={{
            padding: "0 20px 28px",
            borderBottom: "1px solid #333",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 28,
              fontWeight: 700,
              color: colors.text,
              letterSpacing: -0.5,
            }}
          >
            WordPress
          </div>
        </div>

        {/* Menu Items */}
        {SIDEBAR_ITEMS.map((item, i) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 20px",
              fontFamily: fonts.body,
              fontSize: 22,
              color: i === 0 ? colors.text : "#b4b9be",
              backgroundColor: i === 0 ? "#0073aa" : "transparent",
              cursor: "default",
            }}
          >
            <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>
              {item.icon}
            </span>
            {item.label}
          </div>
        ))}
      </div>

      {/* Main content area (empty admin) */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#f1f1f1",
          opacity: sidebarOpacity,
          padding: 56,
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 40,
            fontWeight: 400,
            color: "#23282d",
          }}
        >
          Dashboard
        </div>
        {/* Widget row 1 */}
        <div style={{ marginTop: 32, display: "flex", gap: 24 }}>
          {/* At a Glance */}
          <div style={{ flex: 1, backgroundColor: "#fff", borderRadius: 4, border: "1px solid #ccd0d4", boxShadow: "0 1px 1px rgba(0,0,0,0.04)", padding: 24 }}>
            <div style={{ fontFamily: fonts.body, fontSize: 22, fontWeight: 600, color: "#23282d", marginBottom: 16 }}>At a Glance</div>
            <div style={{ fontFamily: fonts.body, fontSize: 18, color: "#72777c", lineHeight: 2 }}>
              <div>📝 42 Posts</div>
              <div>📄 12 Pages</div>
              <div>💬 89 Comments</div>
              <div>🔌 14 Plugins</div>
            </div>
          </div>
          {/* Quick Draft */}
          <div style={{ flex: 1, backgroundColor: "#fff", borderRadius: 4, border: "1px solid #ccd0d4", boxShadow: "0 1px 1px rgba(0,0,0,0.04)", padding: 24 }}>
            <div style={{ fontFamily: fonts.body, fontSize: 22, fontWeight: 600, color: "#23282d", marginBottom: 16 }}>Quick Draft</div>
            <div style={{ fontFamily: fonts.body, fontSize: 18, color: "#72777c" }}>
              <div style={{ backgroundColor: "#f1f1f1", borderRadius: 4, padding: "10px 14px", marginBottom: 12, color: "#b4b9be" }}>Title</div>
              <div style={{ backgroundColor: "#f1f1f1", borderRadius: 4, padding: "10px 14px", height: 80, color: "#b4b9be" }}>What's on your mind?</div>
            </div>
          </div>
        </div>
        {/* Widget row 2 */}
        <div style={{ marginTop: 24, display: "flex", gap: 24 }}>
          <div style={{ flex: 1, backgroundColor: "#fff", borderRadius: 4, border: "1px solid #ccd0d4", boxShadow: "0 1px 1px rgba(0,0,0,0.04)", padding: 24 }}>
            <div style={{ fontFamily: fonts.body, fontSize: 22, fontWeight: 600, color: "#23282d", marginBottom: 16 }}>Activity</div>
            <div style={{ fontFamily: fonts.body, fontSize: 16, color: "#72777c", lineHeight: 2.2 }}>
              <div>📌 "Summer menu update" — 2 hours ago</div>
              <div>📌 "New team member onboarding" — yesterday</div>
              <div>📌 "Fix contact form" — 3 days ago</div>
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: "#fff", borderRadius: 4, border: "1px solid #ccd0d4", boxShadow: "0 1px 1px rgba(0,0,0,0.04)", padding: 24 }}>
            <div style={{ fontFamily: fonts.body, fontSize: 22, fontWeight: 600, color: "#23282d", marginBottom: 16 }}>WordPress Events</div>
            <div style={{ fontFamily: fonts.body, fontSize: 16, color: "#72777c", lineHeight: 2.2 }}>
              <div>🗓 WordCamp Austin — June 14</div>
              <div>🗓 WP Meetup — May 3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mouse cursor */}
      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          width: 0,
          height: 0,
          borderLeft: "12px solid white",
          borderRight: "12px solid transparent",
          borderBottom: "20px solid transparent",
          filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.5))",
          zIndex: 10,
        }}
      />
    </div>
  );
};
