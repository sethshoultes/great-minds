/** Great Minds Plugin style tokens */
export const colors = {
  bg: "#09090b",
  accent: "#a855f7",       // purple accent per spec
  blue: "#3b82f6",         // active agents
  red: "#ef4444",          // failure / tmux
  green: "#22c55e",        // success / worktrees
  amber: "#f59e0b",        // cron pulses
  text: "#fafafa",
  textMuted: "#a1a1aa",
  surface: "#18181b",
  surfaceLight: "#27272a",
} as const;

export const fonts = {
  code: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  body: "'Inter', system-ui, -apple-system, sans-serif",
} as const;
