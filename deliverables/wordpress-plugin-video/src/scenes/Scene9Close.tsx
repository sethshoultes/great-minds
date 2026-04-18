import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, FPS } from '../styles';
import { FadeIn } from '../components/FadeIn';

const PLUGIN_CODE = [
  '<?php',
  '/**',
  ' * Plugin Name: My First Plugin',
  ' * Description: A simple plugin that proves I can do this.',
  ' * Version: 1.0',
  ' * Author: Your Name',
  ' */',
  '',
  'function mfp_admin_notice() {',
  '    echo \'<div class="notice notice-info">\';',
  '    echo \'<p>My First Plugin is active.</p>\';',
  '    echo \'</div>\';',
  '}',
  'add_action( \'admin_notices\', \'mfp_admin_notice\' );',
  '',
  'function mfp_greeting_shortcode( $atts ) {',
  '    $atts = shortcode_atts( array(',
  '        \'name\' => \'World\',',
  '    ), $atts );',
  '    return \'<p>Hello, \'',
  '        . esc_html( $atts[\'name\'] ) . \'!</p>\';',
  '}',
  'add_shortcode( \'greeting\', \'mfp_greeting_shortcode\' );',
];

const HIGHLIGHT_LINE = 3; // "Description: A simple plugin..."

export const Scene9Close: React.FC = () => {
  const frame = useCurrentFrame();

  // Code scrolls up slowly
  const scrollY = interpolate(frame, [0, FPS * 5], [400, -60], {
    extrapolateRight: 'clamp',
  });

  // Highlight the description line
  const highlightOpacity = interpolate(
    frame,
    [FPS * 4, FPS * 5, FPS * 9, FPS * 10],
    [0, 0.25, 0.25, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // End card
  const endCardStart = FPS * 10;
  const endCardOpacity = interpolate(
    frame,
    [endCardStart, endCardStart + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Final text
  const finalTextOpacity = interpolate(
    frame,
    [FPS * 6, FPS * 7],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scrolling code */}
      {frame < endCardStart && (
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: `translate(-50%, ${scrollY}px)`,
          width: 900,
        }}>
          {PLUGIN_CODE.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: FONTS.code,
                fontSize: 18,
                lineHeight: 1.6,
                color: i === HIGHLIGHT_LINE ? COLORS.text : COLORS.comment,
                whiteSpace: 'pre',
                opacity: i === HIGHLIGHT_LINE ? 1 : 0.35,
                position: 'relative',
                padding: '0 16px',
              }}
            >
              {i === HIGHLIGHT_LINE && (
                <div style={{
                  position: 'absolute',
                  inset: '-4px -8px',
                  border: `2px solid rgba(245, 158, 11, ${highlightOpacity})`,
                  borderRadius: 6,
                  boxShadow: `0 0 12px rgba(245, 158, 11, ${highlightOpacity * 0.5})`,
                }} />
              )}
              {line}
            </div>
          ))}
        </div>
      )}

      {/* "Thirty lines. Start building." */}
      {frame >= FPS * 6 && frame < endCardStart && (
        <div style={{
          position: 'absolute',
          bottom: 120,
          width: '100%',
          textAlign: 'center',
          opacity: finalTextOpacity,
        }}>
          <p style={{
            fontFamily: FONTS.body,
            fontSize: 52,
            color: COLORS.text,
            fontWeight: 700,
          }}>
            Thirty lines. <span style={{ color: COLORS.accent }}>Start building.</span>
          </p>
        </div>
      )}

      {/* End card */}
      {frame >= endCardStart && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: COLORS.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: endCardOpacity,
          gap: 24,
        }}>
          <h2 style={{
            fontFamily: FONTS.body,
            fontSize: 48,
            color: COLORS.text,
            fontWeight: 700,
            marginBottom: 40,
          }}>
            Start Building
          </h2>
          <p style={{ fontFamily: FONTS.body, fontSize: 24, color: COLORS.comment }}>
            Plugin Handbook: <span style={{ color: COLORS.accent }}>developer.wordpress.org/plugins</span>
          </p>
          <p style={{ fontFamily: FONTS.body, fontSize: 24, color: COLORS.comment }}>
            Starter Code: <span style={{ color: COLORS.accent }}>github.com/your-repo</span>
          </p>
          <div style={{ marginTop: 60 }}>
            <p style={{ fontFamily: FONTS.body, fontSize: 16, color: '#555' }}>
              Made with Great Minds Agency
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
