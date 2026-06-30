import React from 'react';

/**
 * Avatar — a terracotta gradient circle holding initials (or an image).
 * Used beside testimonials and contact identities.
 */
export function Avatar({ initials, src, alt = '', size = 48, style = {}, ...rest }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--color-terra-300), var(--color-terra-400))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      {src ? (
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: Math.round(size * 0.32) / 16 + 'rem', fontWeight: 600, color: '#fff', letterSpacing: '0.05em' }}>
          {initials}
        </span>
      )}
    </div>
  );
}
