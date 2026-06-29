import { Mail, Heart } from 'lucide-react';

const footerLinks = [
  { label: 'Sobre Mim', href: '#sobre' },
  { label: 'Abordagem', href: '#abordagem' },
  { label: 'Atuação', href: '#atuacao' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: 'var(--color-warm-900)',
        padding: 'clamp(80px, 10vw, 120px) 0 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 32px',
        }}
      >
        {/* Closing Message */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(64px, 8vw, 100px)' }}>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 300,
              lineHeight: 1.4,
              color: 'rgba(240,230,215,0.92)',
              fontStyle: 'italic',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            "Mais do que seguir uma metodologia, meu compromisso é acompanhar você em seu processo singular de crescimento, realização e expansão da própria vida."
          </p>
        </div>

        {/* Top */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr',
            gap: '48px',
            marginBottom: '56px',
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <a
              href="#hero"
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontWeight: 400,
                letterSpacing: '0.1em',
                color: 'rgba(240,225,205,0.92)',
                textDecoration: 'none',
                marginBottom: '8px',
              }}
            >
              Eliana Lino
            </a>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.7rem',
                fontWeight: 400,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(192,169,130,0.55)',
                marginBottom: '20px',
              }}
            >
              Psicóloga Clínica · CRP XX/XXXXX
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                fontWeight: 300,
                lineHeight: 1.8,
                color: 'rgba(220,205,185,0.6)',
                maxWidth: '280px',
              }}
            >
              Acompanhando pessoas em processos de autoconhecimento, desenvolvimento emocional e transformação pessoal.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'rgba(192,169,130,0.6)',
                marginBottom: '20px',
              }}
            >
              Navegação
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.88rem',
                      fontWeight: 300,
                      color: 'rgba(220,205,185,0.65)',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(192,169,130,0.9)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(220,205,185,0.65)'; }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'rgba(192,169,130,0.6)',
                marginBottom: '20px',
              }}
            >
              Contato
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <a
                href="mailto:contato@elianalino.com.br"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.88rem',
                  fontWeight: 300,
                  color: 'rgba(220,205,185,0.65)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(192,169,130,0.9)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(220,205,185,0.65)'; }}
              >
                <Mail size={14} />
                contato@elianalino.com.br
              </a>
            </div>

            {/* Social */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(192,169,130,0.2)',
                  background: 'rgba(192,169,130,0.06)',
                  color: 'rgba(192,169,130,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(192,169,130,0.15)';
                  el.style.color = 'rgba(192,169,130,0.9)';
                  el.style.borderColor = 'rgba(192,169,130,0.4)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(192,169,130,0.06)';
                  el.style.color = 'rgba(192,169,130,0.6)';
                  el.style.borderColor = 'rgba(192,169,130,0.2)';
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(192,169,130,0.2)',
                  background: 'rgba(192,169,130,0.06)',
                  color: 'rgba(192,169,130,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(192,169,130,0.15)';
                  el.style.color = 'rgba(192,169,130,0.9)';
                  el.style.borderColor = 'rgba(192,169,130,0.4)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(192,169,130,0.06)';
                  el.style.color = 'rgba(192,169,130,0.6)';
                  el.style.borderColor = 'rgba(192,169,130,0.2)';
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(192,169,130,0.15), transparent)',
            marginBottom: '24px',
          }}
        />

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 300,
              color: 'rgba(192,169,130,0.35)',
              letterSpacing: '0.04em',
            }}
          >
            © {year} Eliana Lino · CRP XX/XXXXX. Todos os direitos reservados.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              fontWeight: 300,
              color: 'rgba(192,169,130,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Feito com <Heart size={11} style={{ color: 'rgba(192,130,100,0.5)' }} /> e cuidado
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </footer>
  );
}
