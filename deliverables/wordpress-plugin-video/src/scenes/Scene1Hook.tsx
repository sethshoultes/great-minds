import React from 'react';
import { useCurrentFrame, interpolate, Sequence } from 'remotion';
import { COLORS, FONTS, FPS } from '../styles';
import { FadeIn } from '../components/FadeIn';

// Fake functions.php chaos lines
const CHAOS_LINES = [
  '// TODO: fix this later',
  'function custom_login_redirect($redirect_to, $request, $user) {',
  '  if (isset($user->roles) && is_array($user->roles)) {',
  '    if (in_array("administrator", $user->roles)) {',
  '      return admin_url();',
  '    } else {',
  '      return home_url("/dashboard");',
  '    }',
  '  }',
  '}',
  'add_filter("login_redirect", "custom_login_redirect", 10, 3);',
  '',
  '// DEPRECATED - do not remove (breaks checkout)',
  'function add_custom_meta_tags() {',
  '  echo \'<meta name="theme-color" content="#ff0000">\';',
  '  // @todo: why is this here??',
  '}',
  'add_action("wp_head", "add_custom_meta_tags");',
  '',
  'function modify_search_query($query) {',
  '  if (!is_admin() && $query->is_search()) {',
  '    $query->set("post_type", array("post", "page", "product"));',
  '  }',
  '  return $query;',
  '}',
  'add_filter("pre_get_posts", "modify_search_query");',
  '',
  '// WARNING: changing this breaks the header',
  'function enqueue_custom_scripts() {',
  '  wp_enqueue_script("jquery");',
  '  wp_enqueue_script("custom-js", get_template_directory_uri()...',
  '  wp_enqueue_style("custom-css", get_template_directory_uri()...',
  '  // Added by Mike - do not touch',
  '  wp_enqueue_script("slick-slider", "https://cdn...",',
  '    array("jquery"), "1.8.0", true);',
  '}',
  'add_action("wp_enqueue_scripts", "enqueue_custom_scripts");',
  '',
  '// Client asked for this 6 months ago, afraid to remove',
  'function custom_excerpt_length($length) {',
  '  return 25;',
  '}',
  'add_filter("excerpt_length", "custom_excerpt_length");',
  '',
  '/* ---- WOOCOMMERCE STUFF (DONT DELETE) ---- */',
  'function custom_woo_redirect() {',
  '  if (is_cart() && WC()->cart->is_empty()) {',
  '    wp_redirect(wc_get_page_permalink("shop"));',
  '    exit;',
  '  }',
  '}',
  'add_action("template_redirect", "custom_woo_redirect");',
];

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // Scroll the code up slowly (extended for 27s scene)
  const scrollY = interpolate(frame, [0, FPS * 20], [0, -600], {
    extrapolateRight: 'clamp',
  });

  // Zoom in slowly (1x to 1.5x over 15 seconds)
  const scale = interpolate(frame, [0, FPS * 15], [1, 1.5], {
    extrapolateRight: 'clamp',
  });

  // Hard cut to black at ~22s
  const blackOverlay = interpolate(frame, [FPS * 22, FPS * 22.1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Title appears at 22.3s, holds through end
  const titleOpacity = interpolate(
    frame,
    [FPS * 22.3, FPS * 22.9, FPS * 25.5, FPS * 26.5],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Code chaos */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: 60,
        }}
      >
        <div
          style={{
            background: COLORS.editorBg,
            borderRadius: 12,
            padding: '24px 32px',
            width: 1400,
            transform: `translateY(${scrollY}px)`,
          }}
        >
          {/* Editor title bar */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 20,
              paddingBottom: 12,
              borderBottom: '1px solid #333',
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ color: COLORS.comment, fontFamily: FONTS.body, fontSize: 14, marginLeft: 12 }}>
              functions.php — 847 lines
            </span>
          </div>
          {CHAOS_LINES.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: FONTS.code,
                fontSize: 16,
                lineHeight: 1.6,
                color: line.startsWith('//')
                  ? COLORS.comment
                  : line.startsWith('/*')
                    ? COLORS.comment
                    : line.includes("'") || line.includes('"')
                      ? COLORS.string
                      : COLORS.text,
                whiteSpace: 'pre',
              }}
            >
              <span style={{ color: COLORS.comment, marginRight: 16, minWidth: 36, display: 'inline-block', textAlign: 'right' }}>
                {(i + 203)}
              </span>
              {line}
              {/* Red underlines on some lines */}
              {(line.includes('DEPRECATED') || line.includes('WARNING') || line.includes('DONT DELETE') || line.includes('do not remove')) && (
                <span style={{ color: COLORS.red, marginLeft: 8, fontSize: 12 }}>⚠</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollbar indicator */}
      <div
        style={{
          position: 'absolute',
          right: 40,
          top: 100,
          bottom: 100,
          width: 8,
          background: '#333',
          borderRadius: 4,
        }}
      >
        <div
          style={{
            width: 8,
            height: 30,
            background: '#666',
            borderRadius: 4,
            position: 'absolute',
            top: '40%',
          }}
        />
      </div>

      {/* Black overlay for hard cut */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: COLORS.bg,
          opacity: blackOverlay,
        }}
      />

      {/* Title card */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '20%',
          opacity: titleOpacity,
        }}
      >
        <h1
          style={{
            fontFamily: FONTS.body,
            fontWeight: 700,
            fontSize: 88,
            color: COLORS.text,
            letterSpacing: '0.02em',
            textAlign: 'center',
          }}
        >
          HOW TO BUILD A<br />WORDPRESS PLUGIN
        </h1>
      </div>
    </div>
  );
};
