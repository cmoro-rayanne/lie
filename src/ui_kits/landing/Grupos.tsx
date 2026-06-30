import React, { useState, useEffect, useRef } from 'react';

function Grupos() {
  const { SectionHeading, Divider } = window.ElianaLinoDesignSystem_6994f2;
  const { ref: inViewRef, inView } = window.useInView(0.1);
  const sectionRef = useRef<HTMLElement>(null);
  const [offsetY, setOffsetY] = useState<number>(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // Calculate how far the section is from the middle of the viewport
      const viewportHeight = window.innerHeight;
      const sectionCenter = rect.top + rect.height / 2;
      const distanceFromCenter = sectionCenter - viewportHeight / 2;
      setOffsetY(distanceFromCenter * -0.12); // Speed multiplier
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once initially to position correctly
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section 
      id="grupos" 
      ref={(el) => {
        (sectionRef as any).current = el;
        if (inViewRef) {
          (inViewRef as any).current = el;
        }
      }} 
      style={{ 
        position: 'relative', 
        padding: 'var(--section-y) 0', 
        overflow: 'hidden', 
        background: 'var(--accent-go)' 
      }}
    >
      {/* Parallax Background Glow Layer */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: '-60px 0', 
          zIndex: 0,
          backgroundImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          transform: `translateY(${offsetY}px)`,
          transition: 'transform 0.1s ease-out', // Smooth movement
          pointerEvents: 'none'
        }} 
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', textAlign: 'center' }}>
        
        {/* Header & Subtitle */}
        <div style={{ marginBottom: 36, opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity .9s ease, transform .9s ease' }}>
          {/* Eyebrow */}
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 20 }}>
            Grupos Terapêuticos
          </p>
          
          {/* Main Title */}
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 400, color: '#ffffff', lineHeight: 1.25, margin: '0 0 16px' }}>
            Espaços de <em style={{ color: 'var(--color-sand-100)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>Partilha</em>
          </h2>

          {/* Subtitle */}
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 300, color: 'rgba(255,255,255,0.78)', margin: '16px auto 0', maxWidth: 600 }}>
            O poder do encontro e da experiência compartilhada.
          </p>
        </div>

        {/* Subtle Centered Divider Line */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36, opacity: inView ? 1 : 0, transition: 'opacity .9s ease .2s' }}>
          <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
        </div>

        {/* Main Text */}
        <div style={{ maxWidth: 720, margin: '0 auto', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity .9s ease .4s, transform .9s ease .4s' }}>
          <p style={{ 
            fontFamily: 'var(--font-sans)', 
            fontSize: 'clamp(1rem,1.8vw,1.1rem)', 
            fontWeight: 300, 
            lineHeight: 1.95, 
            color: 'rgba(255,255,255,0.85)', 
            margin: 0,
            textAlign: 'justify',
            textAlignLast: 'center' // Justified block but centered last line/overall look
          }}>
            Além dos atendimentos individuais, facilito grupos de desenvolvimento humano e autoconhecimento. Nesses espaços, a experiência compartilhada possibilita encontros profundos consigo mesmo e com os outros, ampliando a consciência, a autenticidade e a capacidade de construir relações mais verdadeiras.
          </p>
        </div>

      </div>
    </section>
  );
}

window.Grupos = Grupos;
export default Grupos;
