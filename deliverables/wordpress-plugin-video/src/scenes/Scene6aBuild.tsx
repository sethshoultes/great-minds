import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, FPS } from '../styles';
import { CodeBlock } from '../components/CodeBlock';
import { FadeIn } from '../components/FadeIn';

const ADMIN_NOTICE_LINES = [
  { text: '// Show a welcome notice in the admin dashboard', type: 'comment' as const },
  { text: 'function mfp_admin_notice() {', type: 'keyword' as const },
  { text: '    echo \'<div class="notice notice-info is-dismissible">\';', type: 'normal' as const },
  { text: '    echo \'<p>My First Plugin is active. You built this.</p>\';', type: 'string' as const },
  { text: '    echo \'</div>\';', type: 'normal' as const },
  { text: '}', type: 'keyword' as const },
  { text: 'add_action( \'admin_notices\', \'mfp_admin_notice\' );', type: 'highlight' as const },
];

export const Scene6aBuild: React.FC = () => {
  const frame = useCurrentFrame();

  // Reflection beat at end
  const reflectionStart = FPS * 25;

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
          Build It — <span style={{ color: COLORS.accent }}>Admin Notice</span>
        </h2>
      </FadeIn>

      <div style={{ width: 1200 }}>
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

        {/* Existing header (dimmed) */}
        <div style={{
          background: COLORS.editorBg,
          padding: '24px 32px 0',
          fontFamily: FONTS.code,
          fontSize: 18,
          lineHeight: 1.6,
        }}>
          {['<?php', '/**', ' * Plugin Name: My First Plugin', ' * Description: A simple plugin that proves I can do this.', ' * Version: 1.0', ' * Author: Your Name', ' */'].map((line, i) => (
            <div key={i} style={{ color: COLORS.comment, opacity: 0.4, whiteSpace: 'pre' }}>{line}</div>
          ))}
          <div style={{ height: 20 }} />
        </div>

        {/* New code */}
        <CodeBlock
          lines={ADMIN_NOTICE_LINES}
          startFrame={FPS * 3}
          framesPerLine={55}
          fontSize={22}
          showLineNumbers={false}
        />
      </div>

      {/* Reflection beat */}
      <FadeIn startFrame={reflectionStart} direction="up" style={{ marginTop: 40, textAlign: 'center' }}>
        <p style={{ fontFamily: FONTS.body, fontSize: 28, color: COLORS.comment }}>
          One function. One hook. <span style={{ color: COLORS.accent, fontWeight: 600 }}>That's the pattern.</span>
        </p>
      </FadeIn>
    </div>
  );
};
