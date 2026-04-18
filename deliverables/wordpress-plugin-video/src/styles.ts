export const COLORS = {
  bg: '#0a0a0a',
  editorBg: '#1a1a1a',
  accent: '#f59e0b',
  text: '#fafafa',
  textDim: 'rgba(250, 250, 250, 0.9)',
  comment: '#9ca3af',
  string: '#f59e0b',
  keyword: '#fafafa',
  red: '#ef4444',
  green: '#22c55e',
  greenDim: 'rgba(34, 197, 94, 0.4)',
} as const;

export const FONTS = {
  code: 'JetBrains Mono, Fira Code, monospace',
  body: 'Inter, system-ui, sans-serif',
} as const;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene durations in seconds (matched to VO audio lengths + padding)
export const SCENES = {
  scene1: 27,   // VO: 25.3s + 1.7s buffer
  scene2: 16,   // VO: 15.2s + 0.8s buffer
  scene3: 57,   // VO: 55.4s + 1.6s buffer
  scene4: 45,   // VO: 32.5s (extra space for diagram pauses)
  scene5: 23,   // VO: 21.3s + 1.7s buffer
  scene6a: 35,  // VO: 18.2s (extra space for code typing)
  scene6b: 35,  // VO: 21.0s (extra space for code typing)
  scene7: 40,   // VO: 36.3s + 3.7s buffer
  scene8: 24,   // VO: 22.2s + 1.8s buffer
  scene9: 19,   // VO: 17.5s + 1.5s buffer
} as const;

export const TOTAL_DURATION_FRAMES =
  Object.values(SCENES).reduce((a, b) => a + b, 0) * FPS;
