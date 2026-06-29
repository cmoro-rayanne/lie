import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Abordagem', href: '#abordagem' },
  { label: 'Atuação', href: '#atuacao' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => setMobileOpen(false);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'background 0.5s ease, box-shadow 0.5s ease, padding 0.4s ease',
          background: scrolled ? 'rgba(250, 248, 244, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled ? '0 1px 0 rgba(160,130,100,0.12)' : 'none',
          padding: scrolled ? '14px 0' : '28px 0',
        }}
      >
        <nav
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <a
            href="#hero"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 400,
              letterSpacing: '0.08em',
              color: scrolled ? 'var(--color-warm-800)' : '#fff',
              textDecoration: 'none',
              transition: 'color 0.4s ease',
              lineHeight: 1,
            }}
          >
            Eliana Lino
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.52rem',
                fontWeight: 400,
                letterSpacing: '0.28em',
                opacity: 0.65,
                textTransform: 'uppercase',
                marginTop: '3px',
              }}
            >
              Psicóloga Clínica · CRP XX/XXXXX
            </span>
          </a>

          {/* Desktop Links */}
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '36px',
              listStyle: 'none',
            }}
            className="nav-links-desktop"
          >
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.78rem',
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: scrolled ? 'var(--color-warm-700)' : 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = scrolled
                      ? 'var(--color-terra-500)' : '#fff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = scrolled
                      ? 'var(--color-warm-700)' : 'rgba(255,255,255,0.8)';
                  }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="#contato"
            className="nav-links-desktop"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '10px 22px',
              border: scrolled ? '1px solid var(--color-terra-400)' : '1px solid rgba(255,255,255,0.45)',
              color: scrolled ? 'var(--color-terra-600)' : '#fff',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.35s ease',
              background: 'transparent',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = scrolled ? 'var(--color-terra-400)' : 'rgba(255,255,255,0.12)';
              el.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'transparent';
              el.style.color = scrolled ? 'var(--color-terra-600)' : '#fff';
            }}
          >
            Agendar Consulta
          </a>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Abrir menu"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: scrolled ? 'var(--color-warm-800)' : '#fff',
              display: 'none', padding: '4px',
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 99,
            background: 'var(--color-sand-50)',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', gap: '36px',
            transition: 'opacity 0.4s ease, visibility 0.4s ease',
            opacity: mobileOpen ? 1 : 0,
            visibility: mobileOpen ? 'visible' : 'hidden',
          }}
          className="mobile-menu-overlay"
        >
          {links.map((l, i) => (
            <a
              key={l.href} href={l.href} onClick={handleLinkClick}
              style={{
                fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 400,
                color: 'var(--color-warm-800)', textDecoration: 'none',
                letterSpacing: '0.06em',
                transition: `opacity 0.3s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`,
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
              }}
            >{l.label}</a>
          ))}
          <a
            href="#contato" onClick={handleLinkClick}
            style={{
              marginTop: '12px', fontFamily: 'var(--font-sans)',
              fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.16em',
              textTransform: 'uppercase', textDecoration: 'none',
              padding: '12px 32px', border: '1px solid var(--color-terra-400)',
              color: 'var(--color-terra-600)', borderRadius: 'var(--radius-sm)',
            }}
          >Agendar Consulta</a>
        </div>
      </header>

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .mobile-menu-overlay { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-links-desktop { display: flex; }
          .nav-hamburger { display: none !important; }
          .mobile-menu-overlay { display: none !important; }
        }
      `}</style>
    </>
  );
}
