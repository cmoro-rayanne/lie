
import { Logo } from '../../components/design-system/Logo';
import { IconButton } from '../../components/design-system/IconButton';
import { Mail, Heart } from 'lucide-react';
import { Instagram, Linkedin } from '../../shared/custom-icons';

const FOOTER_LINKS = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Atuação', href: '#atuacao' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Contato', href: '#contato' },
];

export function Footer() {
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
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(192,169,130,0.9)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(220,205,185,0.65)'}>{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(192,169,130,0.6)', marginBottom: 20 }}>Contato</h4>
            <a href="mailto:contato@ile.com.br" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 300, color: 'rgba(220,205,185,0.65)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Mail size={14} /> contato@ile.com.br
            </a>
            <div style={{ display: 'flex', gap: 10 }}>
              <IconButton size="sm" tone="dark" aria-label="Instagram" href="#"><Instagram size={15} /></IconButton>
              <IconButton size="sm" tone="dark" aria-label="LinkedIn" href="#"><Linkedin size={15} /></IconButton>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(192,169,130,0.15), transparent)', marginBottom: 24 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 300, color: 'rgba(192,169,130,0.35)' }}>© {year} Ilê · Eliana Lino · CRP XX/XXXXX. Todos os direitos reservados.</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 300, color: 'rgba(192,169,130,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>Feito com <span style={{ color: 'rgba(192,130,100,0.5)', display: 'inline-flex' }}><Heart size={11} /></span> e cuidado</p>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </footer>
  );
}


