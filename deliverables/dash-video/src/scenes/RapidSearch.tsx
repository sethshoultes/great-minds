import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../styles";

interface SearchAction {
  query: string;
  result: string;
  destination: string;
}

const SEARCHES: SearchAction[] = [
  { query: "user", result: "Users", destination: "Users" },
  { query: "draft", result: "Draft Posts", destination: "Posts" },
  { query: "setting", result: "Settings", destination: "Settings" },
  { query: "new page", result: "Create New Page", destination: "Pages" },
  { query: "media", result: "Media Library", destination: "Media" },
];

/**
 * Scene 3 (0:12 - 0:22): Five rapid-fire searches, hard cuts, running counter.
 * Each search-and-select takes exactly 1 second (30 frames). No transitions.
 */
export const RapidSearch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const framesPerSearch = fps; // 30 frames = 1 second each
  // First 5 seconds for searches, remaining 5 seconds hold on counter
  const searchIndex = Math.min(
    Math.floor(frame / framesPerSearch),
    SEARCHES.length - 1
  );
  const withinSearch = frame % framesPerSearch;
  const allDone = frame >= SEARCHES.length * framesPerSearch;

  // Count completed searches
  const completedCount = Math.min(
    Math.floor(frame / framesPerSearch) + 1,
    SEARCHES.length
  );

  const currentSearch = SEARCHES[searchIndex];

  // Typing progress within each 1-second search
  const charsPerFrame = 1 / (0.04 * fps);
  const charsVisible = allDone
    ? currentSearch.query.length
    : Math.min(
        Math.max(0, Math.floor(withinSearch * charsPerFrame)),
        currentSearch.query.length
      );
  const displayedQuery = currentSearch.query.slice(0, charsVisible);

  // Result appears after typing finishes (around frame 15 within each search)
  const showResult = allDone || withinSearch >= 15;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.overlay,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Counter — top right */}
      <div
        style={{
          position: "absolute",
          top: 56,
          right: 80,
          fontFamily: fonts.code,
          fontSize: 36,
          fontWeight: 700,
          color: colors.accent,
          letterSpacing: 1,
        }}
      >
        {completedCount} action{completedCount !== 1 ? "s" : ""}.{" "}
        {completedCount} second{completedCount !== 1 ? "s" : ""}.
      </div>

      {/* Search overlay */}
      <div style={{ width: 720 }}>
        {/* Search field */}
        <div
          style={{
            backgroundColor: colors.surface,
            border: `2px solid ${colors.accent}`,
            borderRadius: 12,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: fonts.body,
              fontSize: 28,
              color: colors.textMuted,
              marginRight: 16,
            }}
          >
            /
          </span>
          <span
            style={{
              fontFamily: fonts.code,
              fontSize: 32,
              color: colors.text,
            }}
          >
            {displayedQuery}
            <span
              style={{
                opacity:
                  Math.floor(frame / (0.53 * fps)) % 2 === 0 ? 1 : 0,
                color: colors.accent,
              }}
            >
              |
            </span>
          </span>
        </div>

        {/* Single result — appears instantly */}
        {showResult && (
          <div
            style={{
              marginTop: 8,
              backgroundColor: colors.surface,
              borderRadius: 12,
              border: `1px solid ${colors.surfaceLight}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 32px",
                backgroundColor: colors.accentHover,
              }}
            >
              <span
                style={{
                  fontFamily: fonts.body,
                  fontSize: 26,
                  fontWeight: 600,
                  color: colors.text,
                }}
              >
                {currentSearch.result}
              </span>
              <span
                style={{
                  fontFamily: fonts.code,
                  fontSize: 18,
                  color: colors.textMuted,
                  backgroundColor: colors.surfaceLight,
                  padding: "4px 12px",
                  borderRadius: 4,
                }}
              >
                {currentSearch.destination}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom stat: 16 built-in commands */}
      {allDone && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            fontFamily: fonts.code,
            fontSize: 24,
            color: colors.textMuted,
            letterSpacing: 1,
          }}
        >
          16 built-in commands. 300+ admin screens. One shortcut.
        </div>
      )}
    </div>
  );
};
