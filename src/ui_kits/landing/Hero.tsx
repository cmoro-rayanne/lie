import { useState, useEffect, useRef } from 'react';
import { Logo } from '../../components/brand/Logo';

function Hero() {
  const { Button } = window.ElianaLinoDesignSystem_6994f2;
  const { ChevronDown } = window.Icons;
  const [loaded, setLoaded] = useState<boolean>(false);
  const decoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    const onMove = (e: MouseEvent) => {
      if (!decoRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      decoRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('mousemove', onMove); };
  }, []);

  const fade = (d: string) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 1s ease ${d}, transform 1s var(--ease-out-expo) ${d}`,
  });

  return (
    <section id="hero" style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--grad-hero)' }}>
      {/* radial glow */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 65% 55% at 72% 48%, rgba(170,120,75,0.22) 0%, transparent 55%), radial-gradient(ellipse 45% 60% at 15% 75%, rgba(110,130,90,0.14) 0%, transparent 50%)' }} />
      {/* grain */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")" }} />

      {/* Brand-mark decoration, right */}
      <div ref={decoRef} style={{ position: 'absolute', right: '2%', top: '50%', transform: 'translate(-50%,-50%)', opacity: loaded ? 0.5 : 0, transition: 'opacity 1.4s ease 0.8s', pointerEvents: 'none' }}>
        <div style={{ position: 'relative', width: 'min(460px, 42vw)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 480 480" style={{ position: 'absolute', width: '118%', opacity: 0.6 }} fill="none">
            <circle cx="240" cy="240" r="230" stroke="rgba(192,160,110,0.16)" strokeWidth="0.8" />
            <circle cx="240" cy="240" r="180" stroke="rgba(192,160,110,0.12)" strokeWidth="0.6" />
            <line x1="240" y1="10" x2="240" y2="470" stroke="rgba(192,160,110,0.08)" strokeWidth="0.5" />
            <line x1="10" y1="240" x2="470" y2="240" stroke="rgba(192,160,110,0.08)" strokeWidth="0.5" />
          </svg>
          <Logo variant="full" size={240} mono="rgba(192,160,110,0.7)" />
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 'var(--container)', margin: '0 auto', padding: '120px var(--gutter) 80px', width: '100%' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(192,160,110,0.85)', marginBottom: '32px', ...fade('0.1s') }}>
          Psicologia Clínica · Autoconhecimento · Consciência
        </p>
        <div style={{ maxWidth: 'min(680px, 56vw)', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', fontWeight: 300, lineHeight: 1.12, color: '#f5efe8', letterSpacing: '-0.01em', ...fade('0.2s') }}>
            “Uma boa escuta pode ressignificar as
          </h1>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', fontWeight: 300, lineHeight: 1.12, color: 'transparent', fontStyle: 'italic', WebkitTextStroke: '1px rgba(192,160,110,0.75)', ...fade('0.38s') }}>
            experiências vividas e as relações que construímos.”
          </h1>
        </div>
        <div style={{ width: '72px', height: '1px', marginBottom: '32px', background: 'linear-gradient(90deg, rgba(192,160,110,0.8), transparent)', transformOrigin: 'left', transform: loaded ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 1.4s var(--ease-in-out-quint) 0.55s' }} />
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(0.9rem,1.6vw,1.05rem)', fontWeight: 300, lineHeight: 1.9, color: 'rgba(235,220,200,0.7)', maxWidth: '430px', marginBottom: '48px', ...fade('0.65s') }}>
          Um espaço de escuta, presença e investigação para que você reconheça, compreenda e integre suas dimensões no seu próprio ritmo.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', ...fade('0.82s') }}>
          <Button variant="primary" size="lg" href="#sobre">Conheça meu trabalho</Button>
          <Button variant="secondary" tone="dark" size="lg" href="#contato">Agendar Consulta</Button>
        </div>
      </div>

      <a href="#sobre" style={{ cursor: 'pointer', position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'rgba(192,160,110,0.7)', textDecoration: 'none', opacity: loaded ? 0.7 : 0, transition: 'opacity 1s ease 1.4s, color 0.3s ease' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#f5efe8'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(192,160,110,0.7)'}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', letterSpacing: '0.26em', textTransform: 'uppercase' }}>Explorar</span>
        <span className="animate-scroll-bounce" style={{ display: 'inline-flex' }}><ChevronDown size={15} /></span>
      </a>
    </section>
  );
}
window.Hero = Hero;
export default Hero;
