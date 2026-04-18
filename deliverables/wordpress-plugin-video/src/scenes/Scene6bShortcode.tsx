import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, FPS } from '../styles';
import { CodeBlock } from '../components/CodeBlock';
import { FadeIn } from '../components/FadeIn';

const SHORTCODE_LINES = [
  { text: '// Create a shortcode: [greeting name="World"]', type: 'comment' as const },
  { text: 'function mfp_greeting_shortcode( $atts ) {', type: 'keyword' as const },
  { text: '    $atts = shortcode_atts( array(', type: 'normal' as const },
  { text: "        'name' => 'World',", type: 'string' as const },
  { text: '    ), $atts );', type: 'normal' as const },
  { text: '', type: 'normal' as const },
  { text: "    return '<p class=\"mfp-greeting\">Hello, '", type: 'normal' as const },
  { text: "        . esc_html( $atts['name'] ) . '!</p>';", type: 'highlight' as const },
  { text: '}', type: 'keyword' as const },
  { text: "add_shortcode( 'greeting', 'mfp_greeting_shortcode' );", type: 'highlight' as const },
];

export const Scene6bShortcode: React.FC = () => {
  const frame = useCurrentFrame();

  // Green complete border
  const codeEndFrame = FPS * 20;
  const greenBorder = interpolate(
    frame,
    [codeEndFrame, codeEndFrame + FPS * 1, codeEndFrame + FPS * 3, codeEndFrame + FPS * 4],
    [0, 0.4, 0.4, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // esc_html tooltip
  const tooltipStart = FPS * 16;
  const tooltipOpacity = interpolate(
    frame,
    [tooltipStart, tooltipStart + 10, tooltipStart + FPS * 3, tooltipStart + FPS * 3.5],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <FadeIn startFrame={0} direction="down" style={{ marginBottom: 40 }}>
        <h2 style={{ fontFamily: FONTS.body, fontSize: 40, color: COLORS.text, fontWeight: 700, textAlign: 'center' }}>
          Build It — <span style={{ color: COLORS.accent }}>Shortcode</span>
        </h2>
      </FadeIn>

      <div style={{
        width: 1200,
        position: 'relative',
        border: greenBorder > 0 ? `2px solid rgba(34, 197, 94, ${greenBorder})` : '2px solid transparent',
        borderRadius: 12,
        boxShadow: greenBorder > 0 ? `0 0 20px rgba(34, 197, 94, ${greenBorder * 0.3})` : 'none',
      }}>
        {/* Editor chrome */}
        <div style={{
          background: '#2a2a2a',
          borderRadius: '12px 12px 0 0',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ color: COLORS.comment, fontFamily: FONTS.code, fontSize: 14, marginLeft: 12 }}>
            my-first-plugin.php
          </span>
        </div>

        <CodeBlock
          lines={SHORTCODE_LINES}
          startFrame={FPS * 2}
          framesPerLine={50}
          fontSize={22}
          showLineNumbers={false}
        />

        {/* esc_html tooltip */}
        <div style={{
          position: 'absolute',
          right: 60,
          top: 310,
          opacity: tooltipOpacity,
          background: 'rgba(245, 158, 11, 0.15)',
          border: `1px solid ${COLORS.accent}`,
          borderRadius: 8,
          padding: '8px 16px',
        }}>
          <span style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.accent }}>
            Security first — always escape output
          </span>
        </div>
      </div>

      {/* Checkpoint */}
      <FadeIn startFrame={codeEndFrame + FPS * 1} direction="up" style={{ marginTop: 40, textAlign: 'center' }}>
        <p style={{ fontFamily: FONTS.body, fontSize: 28, color: COLORS.text }}>
          Header. Action hook. Shortcode. <span style={{ color: COLORS.accent, fontWeight: 700 }}>Three concepts. Thirty lines.</span>
        </p>
      </FadeIn>
    </div>
  );
};
