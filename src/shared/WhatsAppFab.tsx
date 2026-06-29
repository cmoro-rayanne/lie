import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export function WhatsAppFab() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20agendar%20uma%20consulta."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar pelo WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Tooltip label */}
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.75rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: 'var(--color-warm-800)',
          background: '#fff',
          padding: '8px 16px',
          borderRadius: '999px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          whiteSpace: 'nowrap',
          transition: 'all 0.4s ease',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(12px)',
          pointerEvents: 'none',
        }}
      >
        Agendar pelo WhatsApp
      </span>

      {/* FAB Button */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25d366, #128c7e)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hovered
            ? '0 12px 40px rgba(37,211,102,0.45)'
            : '0 6px 24px rgba(37,211,102,0.3)',
          transition: 'box-shadow 0.4s ease',
          flexShrink: 0,
        }}
      >
        <MessageCircle size={24} />
      </div>

      {/* Pulse ring */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: '2px solid rgba(37,211,102,0.4)',
          animation: 'pulse-ring 2.5s ease-out infinite',
          pointerEvents: 'none',
        }}
      />

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.8; }
          80%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </a>
  );
}
