import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export function WhatsAppFab() {
  const [h, setH] = useState(false);
  return (
    <a href="#contato" aria-label="Agendar pelo WhatsApp" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 200, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', transform: h ? 'translateY(-2px)' : 'translateY(0)', transition: 'all .4s var(--ease-out-expo)' }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-strong)', background: '#fff', padding: '8px 16px', borderRadius: 999, boxShadow: 'var(--shadow-float)', whiteSpace: 'nowrap', opacity: h ? 1 : 0, transform: h ? 'translateX(0)' : 'translateX(12px)', transition: 'all .4s ease', pointerEvents: 'none' }}>Agendar pelo WhatsApp</span>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #25d366, #128c7e)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: h ? '0 12px 40px rgba(37,211,102,0.45)' : '0 6px 24px rgba(37,211,102,0.3)', transition: 'box-shadow .4s ease', flexShrink: 0 }}>
        <MessageCircle size={24} />
      </div>
    </a>
  );
}
