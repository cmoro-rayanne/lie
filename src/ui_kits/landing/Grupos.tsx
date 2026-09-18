import { useState, useEffect, useRef } from 'react';
import gruposImg from '../../assets/fotos/web/IMG_1131-web.jpg';

function Grupos() {
  // const { SectionHeading } = window.ElianaLinoDesignSystem_6994f2;
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
        background: 'var(--accent-go)',
      }}
    >
      {/* Parallax Background Glow Layer */}
      <div
        style={{
          position: 'absolute',
          inset: '-60px 0',
          zIndex: 0,
          backgroundImage:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          transform: `translateY(${offsetY}px)`,
          transition: 'transform 0.1s ease-out', // Smooth movement
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 'var(--container)',
          margin: '0 auto',
          padding: '0 var(--gutter)',
        }}
      >
        <div
          className="grupos-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 'clamp(40px,6vw,88px)',
            alignItems: 'center',
            textAlign: 'left',
          }}
        >
          {/* Foto — lado esquerdo */}
          <div
            className="grupos-photo"
            style={{
              position: 'relative',
              width: 'clamp(224px, 25vw, 320px)',
              justifySelf: 'start',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 1s ease, transform 1s var(--ease-out-expo)',
            }}
          >
            <div
              style={{
                position: 'relative',
                aspectRatio: '4/5',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 24px 56px rgba(0,0,0,0.22)',
              }}
            >
              <img
                src={gruposImg}
                alt="Eliana Lino sentada no chão com cartas terapêuticas dispostas à sua frente"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 46%',
                  filter: 'brightness(0.97) contrast(1.02) saturate(0.92)',
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: -14,
                left: -14,
                width: 96,
                height: 96,
                border: '1px solid rgba(255,255,255,0.28)',
                borderRadius: 'var(--radius-sm)',
                zIndex: -1,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -14,
                right: -14,
                width: 60,
                height: 60,
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 'var(--radius-sm)',
                zIndex: -1,
              }}
            />
          </div>

          {/* Texto — lado direito */}
          <div>
            {/* Header & Subtitle */}
            <div
              style={{
                marginBottom: 36,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity .9s ease, transform .9s ease',
              }}
            >
              {/* Eyebrow */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: 20,
                }}
              >
                Grupos Terapêuticos
              </p>

              {/* Main Title */}
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem,4vw,3.2rem)',
                  fontWeight: 400,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  margin: '0 0 16px',
                }}
              >
                Espaços de{' '}
                <em
                  style={{
                    color: 'var(--color-sand-100)',
                    fontStyle: 'italic',
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  Partilha
                </em>
              </h2>

              {/* Subtitle */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.05rem',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.78)',
                  margin: '16px 0 0',
                  maxWidth: 600,
                }}
              >
                O poder do encontro e da experiência compartilhada.
              </p>
            </div>

            {/* Subtle Divider Line */}
            <div
              className="grupos-divider"
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: 36,
                opacity: inView ? 1 : 0,
                transition: 'opacity .9s ease .2s',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 1,
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.4), transparent)',
                }}
              />
            </div>

            {/* Main Text */}
            <div
              style={{
                maxWidth: 720,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity .9s ease .4s, transform .9s ease .4s',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1rem,1.8vw,1.1rem)',
                  fontWeight: 300,
                  lineHeight: 1.95,
                  color: 'rgba(255,255,255,0.85)',
                  margin: 0,
                }}
              >
                Além dos atendimentos individuais, facilito grupos de desenvolvimento humano e
                autoconhecimento. Nesses espaços, a experiência compartilhada possibilita encontros
                profundos consigo mesmo e com os outros, ampliando a consciência, a autenticidade e
                a capacidade de construir relações mais verdadeiras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Grupos = Grupos;
export default Grupos;
