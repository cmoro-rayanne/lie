import React, { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Abordagem', href: '#abordagem' },
  { label: 'Atuação', href: '#atuacao' },
  { label: 'Grupos', href: '#grupos' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' },
];

function Navbar() {
  const { Logo, Button } = window.ElianaLinoDesignSystem_6994f2;
  const { Menu, X } = window.Icons;
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: open ? 2000 : 100,
      width: '100%',
      height: open ? '100%' : 'auto',
      transition: 'background .5s ease, box-shadow .5s ease, padding .4s ease',
      background: scrolled ? 'rgba(250,248,244,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      boxShadow: scrolled ? '0 1px 0 rgba(160,130,100,0.12)' : 'none',
      padding: scrolled ? '12px 0' : '24px 0',
    }}>
      <nav style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#hero" style={{ textDecoration: 'none' }}>
          <Logo variant="inline" size={scrolled ? 34 : 38} tone={scrolled ? 'light' : 'dark'} showTagline={false} />
        </a>

        <ul className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '36px', listStyle: 'none', margin: 0, padding: 0 }}>
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 400,
                letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
                color: scrolled ? 'var(--text-body)' : 'rgba(255,255,255,0.82)',
                transition: 'color .3s ease',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = scrolled ? 'var(--accent)' : '#fff'}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = scrolled ? 'var(--text-body)' : 'rgba(255,255,255,0.82)'}
              >{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-desktop">
          <Button variant="secondary" size="sm" tone={scrolled ? 'light' : 'dark'} href="#contato">Agendar Consulta</Button>
        </div>

        <button className="nav-burger" aria-label="Abrir menu" onClick={() => setOpen(!open)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: scrolled ? 'var(--text-strong)' : '#fff' }}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div className="mobile-menu" style={{
        position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--color-sand-50)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px',
        transition: 'opacity .4s ease, visibility .4s ease',
        opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden',
      }}>
        {/* Dedicated close button inside mobile menu */}
        <button aria-label="Fechar menu" onClick={() => setOpen(false)}
          style={{ 
            position: 'absolute', 
            top: '24px', 
            right: 'var(--gutter)', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: 8, 
            color: 'var(--text-strong)' 
          }}
        >
          <X size={28} />
        </button>

        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-strong)', textDecoration: 'none', letterSpacing: '0.06em',
          }}>{l.label}</a>
        ))}
        <Button variant="secondary" tone="light" href="#contato" onClick={() => setOpen(false)}>Agendar Consulta</Button>
      </div>
    </header>
  );
}
window.Navbar = Navbar;
export default Navbar;
