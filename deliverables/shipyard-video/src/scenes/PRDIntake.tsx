import React from "react";
import {
  useCurrentFrame,
  interpolate,
  staticFile,
} from "remotion";
import { colors, fonts } from "../styles";
import { AgentAvatar } from "../components/AgentAvatar";

const AGENTS = [
  { name: "Steve Jobs", img: "steve-jobs.webp" },
  { name: "Elon Musk", img: "elon-musk.webp" },
  { name: "Margaret Hamilton", img: "margaret-hamilton.webp" },
  { name: "Jensen Huang", img: "jensen-huang.webp" },
  { name: "Marcus Aurelius", img: "marcus-aurelius.webp" },
  { name: "Jony Ive", img: "jony-ive.webp" },
  { name: "Maya Angelou", img: "maya-angelou.webp" },
  { name: "Aaron Sorkin", img: "aaron-sorkin.webp" },
  { name: "Oprah Winfrey", img: "oprah-winfrey.webp" },
  { name: "Phil Jackson", img: "phil-jackson.webp" },
  { name: "Rick Rubin", img: "rick-rubin.webp" },
  { name: "Sara Blakely", img: "sara-blakely.webp" },
  { name: "Shonda Rhimes", img: "shonda-rhimes.webp" },
  { name: "Warren Buffett", img: "warren-buffett.webp" },
];

const PRD_SECTIONS = [
  "# Project Requirements Document",
  "",
  "## Sitemap",
  "- Home",
  "- About / Team",
  "- Services",
  "- Portfolio",
  "- Contact",
  "",
  "## Brand Tokens",
  "- Primary: #f59e0b",
  "- Font: Inter",
  "- Tone: Professional, bold",
  "",
  "## Feature List",
  "- Responsive design",
  "- Contact form w/ validation",
  "- Portfolio grid w/ filtering",
  "- Blog with CMS",
  "- SEO optimization",
  "- Accessibility (WCAG 2.1)",
];

/**
 * Scene 2 (0:03 - 0:10): Split screen PRD + agent grid
 */
export const PRDIntake: React.FC = () => {
  const frame = useCurrentFrame();

  // PRD scroll
  const scrollY = interpolate(frame, [0, 180], [0, -200], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
      }}
    >
      {/* Left: PRD Document */}
      <div
        style={{
          flex: 1,
          padding: "80px 60px",
          overflow: "hidden",
          borderRight: `1px solid ${colors.surfaceLight}`,
        }}
      >
        <div
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: "40px 36px",
            height: "100%",
            overflow: "hidden",
            border: `1px solid ${colors.surfaceLight}`,
          }}
        >
          <div style={{ transform: `translateY(${scrollY}px)` }}>
            {PRD_SECTIONS.map((line, i) => {
              const isHeader = line.startsWith("#");
              const isHighlighted =
                line.includes("Sitemap") ||
                line.includes("Brand Tokens") ||
                line.includes("Feature List");

              const lineOpacity = interpolate(
                frame,
                [i * 2, i * 2 + 8],
                [0.3, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              return (
                <div
                  key={i}
                  style={{
                    fontFamily: isHeader ? fonts.body : fonts.code,
                    fontSize: isHeader
                      ? line.startsWith("##")
                        ? 32
                        : 40
                      : 24,
                    fontWeight: isHeader ? 700 : 400,
                    color: isHighlighted
                      ? colors.accent
                      : isHeader
                      ? colors.text
                      : colors.textMuted,
                    marginBottom: line === "" ? 16 : 6,
                    paddingLeft: line.startsWith("-") ? 16 : 0,
                    opacity: lineOpacity,
                  }}
                >
                  {line || "\u00A0"}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Agent Grid */}
      <div
        style={{
          flex: 1,
          padding: "80px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 28,
            color: colors.textMuted,
            marginBottom: 36,
            textTransform: "uppercase",
            letterSpacing: 3,
          }}
        >
          14 Autonomous Agents
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 28,
            maxWidth: 800,
          }}
        >
          {AGENTS.map((agent, i) => (
            <AgentAvatar
              key={agent.name}
              name={agent.name}
              imageSrc={staticFile(`personas/${agent.img}`)}
              delay={i * 5 + 10}
              size={130}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
