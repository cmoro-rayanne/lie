import React from 'react';
import logoHorizontal from '../../uploads/logo-horizontal.png';

const FOOTER_LINKS = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Abordagem', href: '#abordagem' },
  { label: 'Atuação', href: '#atuacao' },
  { label: 'Grupos', href: '#grupos' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' },
];

function Footer() {
  const { Logo, IconButton } = window.ElianaLinoDesignSystem_6994f2;
  const { Mail, Heart, Instagram } = window.Icons;
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--color-warm-900)', padding: 'clamp(80px,10vw,120px) 0 32px', overflow: 'hidden' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(56px,7vw,90px)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 300, lineHeight: 1.4, color: 'rgba(240,230,215,0.92)', fontStyle: 'italic', maxWidth: 800, margin: '0 auto' }}>
            “Mais do que seguir uma metodologia, meu compromisso é acompanhar você em seu processo singular de crescimento, realização e expansão da própria vida.”
          </p>
        </div>

        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
          <div>
            <a href="#hero" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>
              <Logo variant="stacked" tone="dark" size={70} />
            </a>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 300, lineHeight: 1.8, color: 'rgba(220,205,185,0.6)', maxWidth: 280, marginTop: 16 }}>
              Acompanhando pessoas em processos de autoconhecimento, desenvolvimento emocional e transformação pessoal.
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(192,169,130,0.6)', marginBottom: 20 }}>Navegação</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: 0 }}>
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}><a href={l.href} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 300, color: 'rgba(220,205,185,0.65)', textDecoration: 'none', transition: 'color .3s ease' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'rgba(192,169,130,0.9)'}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'rgba(220,205,185,0.65)'}>{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(192,169,130,0.6)', marginBottom: 20 }}>Contato</h4>
            <a href="mailto:contato@elianalino.com.br" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 300, color: 'rgba(220,205,185,0.65)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Mail size={14} /> contato@elianalino.com.br
            </a>
            <div style={{ display: 'flex', gap: 10 }}>
              <IconButton size="sm" tone="dark" aria-label="Instagram" href="https://www.instagram.com/eliana_lino/" target="_blank"><Instagram size={15} /></IconButton>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(192,169,130,0.15), transparent)', marginBottom: 24 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 300, color: 'rgba(192,169,130,0.65)' }}>© {year} Ilê · Eliana Lino · CRP 9424/12. Todos os direitos reservados.</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 300, color: 'rgba(192,169,130,0.65)', display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            Feito com <span style={{ color: 'rgba(192,130,100,0.65)', display: 'inline-flex' }}><Heart size={11} /></span> e cuidado por{' '}
            <a href="https://www.rmoro.com.br/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src={logoHorizontal} alt="r.moro" style={{ height: 20, width: 'auto', display: 'inline-block', opacity: 0.45, transition: 'opacity .3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.95'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.45'} />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;

export function WhatsAppFab() {
  const { MessageCircle } = window.Icons;
  const [h, setH] = React.useState<boolean>(false);
  return (
    <a href="https://wa.me/5548999212332" target="_blank" rel="noopener noreferrer" aria-label="Agendar pelo WhatsApp" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 200, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', transform: h ? 'translateY(-2px)' : 'translateY(0)', transition: 'all .4s var(--ease-out-expo)' }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-strong)', background: '#fff', padding: '8px 16px', borderRadius: 999, boxShadow: 'var(--shadow-float)', whiteSpace: 'nowrap', opacity: h ? 1 : 0, transform: h ? 'translateX(0)' : 'translateX(12px)', transition: 'all .4s ease', pointerEvents: 'none' }}>Agendar pelo WhatsApp</span>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #25d366, #128c7e)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: h ? '0 12px 40px rgba(37,211,102,0.45)' : '0 6px 24px rgba(37,211,102,0.3)', transition: 'box-shadow .4s ease', flexShrink: 0 }}>
        <MessageCircle size={24} />
      </div>
    </a>
  );
}
window.WhatsAppFab = WhatsAppFab;
export default Footer;
