import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const [loaded, setLoaded] = useState(false);
  const decoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!decoRef.current) return;
      const { clientX, clientY } = e;
      const xPct = (clientX / window.innerWidth - 0.5) * 20;
      const yPct = (clientY / window.innerHeight - 0.5) * 12;
      decoRef.current.style.transform = `translate(${xPct}px, ${yPct}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fade = (delay: string) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 1s ease ${delay}, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}`,
  });

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: `linear-gradient(145deg, #252018 0%, #31281e 25%, #3e3025 50%, #4a3a2c 70%, #352a22 100%)`,
      }}
    >
      {/* Layered background radials */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          radial-gradient(ellipse 65% 55% at 72% 48%, rgba(170,120,75,0.22) 0%, transparent 55%),
          radial-gradient(ellipse 45% 60% at 15% 75%, rgba(110,130,90,0.14) 0%, transparent 50%),
          radial-gradient(ellipse 30% 40% at 85% 15%, rgba(192,169,130,0.08) 0%, transparent 50%)
        `,
      }} />

      {/* Subtle grain texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        opacity: 0.4,
      }} />

      {/* ── RIGHT SIDE DECO ── */}
      <div
        ref={decoRef}
        style={{
          position: 'absolute',
          right: '4%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 'min(500px, 44vw)',
          height: 'min(600px, 56vh)',
          transition: 'opacity 1s ease 0.8s, transform 0.15s ease-out',
          opacity: loaded ? 0.85 : 0,
        }}
      >
        <svg viewBox="0 0 480 560" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}>
          {/* Outer rings */}
          <circle cx="240" cy="280" r="220" stroke="rgba(192,160,110,0.18)" strokeWidth="0.8"/>
          <circle cx="240" cy="280" r="200" stroke="rgba(192,160,110,0.1)" strokeWidth="0.4"/>
          <circle cx="240" cy="280" r="155" stroke="rgba(192,160,110,0.28)" strokeWidth="1"/>
          <circle cx="240" cy="280" r="90" stroke="rgba(192,160,110,0.15)" strokeWidth="0.6"/>

          {/* Cross hair lines */}
          <line x1="240" y1="60" x2="240" y2="500" stroke="rgba(192,160,110,0.1)" strokeWidth="0.5"/>
          <line x1="20" y1="280" x2="460" y2="280" stroke="rgba(192,160,110,0.1)" strokeWidth="0.5"/>

          {/* Organic leaf shapes — top */}
          <path d="M240 82 C265 118 272 152 240 180 C208 152 215 118 240 82Z"
                fill="rgba(130,155,100,0.2)" stroke="rgba(130,155,100,0.5)" strokeWidth="0.8"/>
          {/* bottom */}
          <path d="M240 478 C265 442 272 408 240 380 C208 408 215 442 240 478Z"
                fill="rgba(130,155,100,0.2)" stroke="rgba(130,155,100,0.5)" strokeWidth="0.8"/>
          {/* left */}
          <path d="M42 280 C78 255 112 248 140 280 C112 305 78 305 42 280Z"
                fill="rgba(130,155,100,0.2)" stroke="rgba(130,155,100,0.5)" strokeWidth="0.8"/>
          {/* right */}
          <path d="M438 280 C402 255 368 248 340 280 C368 305 402 305 438 280Z"
                fill="rgba(130,155,100,0.2)" stroke="rgba(130,155,100,0.5)" strokeWidth="0.8"/>

          {/* Diagonal organic petals */}
          <path d="M155 145 C175 168 182 195 155 216 C128 195 135 168 155 145Z"
                fill="rgba(192,160,110,0.12)" stroke="rgba(192,160,110,0.35)" strokeWidth="0.7"
                transform="rotate(45 155 180)"/>
          <path d="M325 145 C345 168 352 195 325 216 C298 195 305 168 325 145Z"
                fill="rgba(192,160,110,0.12)" stroke="rgba(192,160,110,0.35)" strokeWidth="0.7"
                transform="rotate(-45 325 180)"/>
          <path d="M155 344 C175 367 182 394 155 415 C128 394 135 367 155 344Z"
                fill="rgba(192,160,110,0.12)" stroke="rgba(192,160,110,0.35)" strokeWidth="0.7"
                transform="rotate(-45 155 380)"/>
          <path d="M325 344 C345 367 352 394 325 415 C298 394 305 367 325 344Z"
                fill="rgba(192,160,110,0.12)" stroke="rgba(192,160,110,0.35)" strokeWidth="0.7"
                transform="rotate(45 325 380)"/>

          {/* Center dot */}
          <circle cx="240" cy="280" r="5" fill="rgba(192,160,110,0.55)"/>
          <circle cx="240" cy="280" r="2" fill="rgba(192,160,110,0.9)"/>

          {/* Cardinals */}
          <circle cx="240" cy="60" r="3.5" fill="rgba(192,160,110,0.45)"/>
          <circle cx="240" cy="500" r="3.5" fill="rgba(192,160,110,0.45)"/>
          <circle cx="42" cy="280" r="3.5" fill="rgba(192,160,110,0.45)"/>
          <circle cx="438" cy="280" r="3.5" fill="rgba(192,160,110,0.45)"/>

          {/* Floating label tag */}
          <rect x="180" y="254" width="120" height="52" rx="4"
                fill="rgba(192,160,110,0.06)" stroke="rgba(192,160,110,0.2)" strokeWidth="0.6"/>
          <text x="240" y="277" textAnchor="middle"
                fontFamily="Georgia, serif" fontSize="9" fill="rgba(192,160,110,0.55)"
                letterSpacing="2.5">ELIANA LINO</text>
          <text x="240" y="296" textAnchor="middle"
                fontFamily="Arial, sans-serif" fontSize="6.5" fill="rgba(192,160,110,0.35)"
                letterSpacing="2">PSICÓLOGA CLÍNICA</text>
        </svg>
      </div>

      {/* ── LEFT SIDE CONTENT ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        maxWidth: '1240px', margin: '0 auto',
        padding: '120px 32px 80px',
        width: '100%',
      }}>
        {/* Pre-title */}
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.68rem',
          fontWeight: 500, letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'rgba(192,160,110,0.85)', marginBottom: '32px',
          ...fade('0.1s'),
        }}>
          Psicologia Clínica · Autoconhecimento · Transformação
        </p>

        {/* Main Quote */}
        <div style={{ maxWidth: 'min(680px, 56vw)', marginBottom: '44px' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.6rem, 5.5vw, 5.2rem)',
            fontWeight: 300, lineHeight: 1.12,
            color: '#f5efe8', letterSpacing: '-0.01em',
            ...fade('0.2s'),
          }}>
            "Através da experiência de vida, podemos crescer e nos aproximar de quem
          </h1>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.6rem, 5.5vw, 5.2rem)',
            fontWeight: 300, lineHeight: 1.12,
            color: 'transparent', letterSpacing: '-0.01em',
            fontStyle: 'italic',
            WebkitTextStroke: '1px rgba(192,160,110,0.75)',
            ...fade('0.38s'),
          }}>
            verdadeiramente somos."
          </h1>
        </div>

        {/* Decorative line */}
        <div style={{
          width: '72px', height: '1px', marginBottom: '32px',
          background: 'linear-gradient(90deg, rgba(192,160,110,0.8), transparent)',
          transformOrigin: 'left',
          transform: loaded ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1.4s cubic-bezier(0.77,0,0.175,1) 0.55s',
        }} />

        {/* Sub-text */}
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
          fontWeight: 300, lineHeight: 1.9, color: 'rgba(235,220,200,0.7)',
          maxWidth: '430px', marginBottom: '52px',
          ...fade('0.65s'),
        }}>
          Um espaço de escuta, presença e investigação para que você reconheça, compreenda e integre suas dimensões no seu próprio ritmo.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '16px',
          ...fade('0.82s'),
        }}>
          <a
            href="#sobre"
            style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              textDecoration: 'none', padding: '15px 38px',
              background: 'linear-gradient(135deg, rgba(185,135,75,0.9), rgba(150,100,55,0.9))',
              color: '#f5efe8', borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(192,160,110,0.3)',
              transition: 'all 0.35s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 14px 44px rgba(150,100,55,0.45)';
              el.style.background = 'linear-gradient(135deg, rgba(205,150,85,1), rgba(165,115,65,1))';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = 'none';
              el.style.background = 'linear-gradient(135deg, rgba(185,135,75,0.9), rgba(150,100,55,0.9))';
            }}
          >
            Conheça meu trabalho
          </a>
          <a
            href="#contato"
            style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 400,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              textDecoration: 'none', padding: '15px 38px',
              background: 'transparent', color: 'rgba(235,220,200,0.85)',
              borderRadius: 'var(--radius-sm)', border: '1px solid rgba(235,220,200,0.22)',
              transition: 'all 0.35s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'rgba(235,220,200,0.55)';
              el.style.color = '#fff';
              el.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'rgba(235,220,200,0.22)';
              el.style.color = 'rgba(235,220,200,0.85)';
              el.style.background = 'transparent';
            }}
          >
            Agendar Consulta
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div style={{
        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        color: 'rgba(192,160,110,0.7)',
        opacity: loaded ? 0.7 : 0, transition: 'opacity 1s ease 1.4s',
      }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', letterSpacing: '0.26em', textTransform: 'uppercase' }}>Explorar</span>
        <ChevronDown size={15} className="animate-scroll-bounce" />
      </div>
    </section>
  );
}
