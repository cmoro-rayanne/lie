import { useInView } from '../../hooks/useInView';

export function About() {
  const { ref: sectionRef, inView } = useInView();

  return (
    <section
      id="sobre"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{
        background: 'var(--color-sand-50)',
        padding: 'clamp(80px, 10vw, 140px) 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'clamp(48px, 6vw, 96px)',
          alignItems: 'center',
        }}
        className="about-grid"
      >
        {/* Photo Column */}
        <div
          style={{
            position: 'relative',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateX(0)' : 'translateX(-48px)',
            transition: 'opacity 1s ease, transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Main photo frame */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'var(--color-sand-200)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
              alt="Eliana Lino"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.95) contrast(1.05) saturate(0.9)',
              }}
            />
          </div>

          {/* Decorative corner */}
          <div
            style={{
              position: 'absolute',
              top: '-16px',
              left: '-16px',
              width: '80px',
              height: '80px',
              border: '1px solid var(--color-terra-200)',
              borderRadius: 'var(--radius-sm)',
              opacity: 0.7,
              zIndex: -1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-16px',
              right: '-16px',
              width: '120px',
              height: '120px',
              border: '1px solid var(--color-terra-200)',
              borderRadius: 'var(--radius-sm)',
              opacity: 0.7,
              zIndex: -1,
            }}
          />
        </div>

        {/* Text Column */}
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateX(0)' : 'translateX(48px)',
            transition: 'opacity 1s ease 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          {/* Label */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--color-terra-400)',
              marginBottom: '20px',
            }}
          >
            Sobre mim
          </p>

          {/* Heading */}
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: 'var(--color-warm-800)',
              marginBottom: '16px',
              letterSpacing: '-0.01em',
            }}
          >
            Uma escuta para a{' '}
            <em style={{ color: 'var(--color-terra-500)' }}>sua totalidade</em>
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.05rem',
              fontWeight: 400,
              color: 'var(--color-warm-600)',
              marginBottom: '28px',
            }}
          >
            Olhar para a história com presença e acolhimento.
          </p>

          {/* Divider */}
          <div
            style={{
              width: '48px',
              height: '1px',
              background: 'linear-gradient(90deg, var(--color-terra-300), transparent)',
              marginBottom: '28px',
              transformOrigin: 'left',
              transform: inView ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 1s ease 0.5s',
            }}
          />

          {/* Text */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              fontWeight: 300,
              lineHeight: 1.9,
              color: 'var(--color-warm-700)',
              marginBottom: '20px',
            }}
          >
            Sou psicóloga clínica e acompanho pessoas em processos de autoconhecimento, desenvolvimento emocional e transformação pessoal. Acredito que cada pessoa possui uma sabedoria interna capaz de orientar seu próprio caminho de crescimento.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              fontWeight: 300,
              lineHeight: 1.9,
              color: 'var(--color-warm-700)',
              marginBottom: '40px',
            }}
          >
            No entanto, padrões antigos, conflitos, medos e experiências não elaboradas podem limitar essa expressão. Meu papel é oferecer um espaço seguro de escuta, presença e investigação para que todas essas dimensões sejam reconhecidas, compreendidas e integradas no seu próprio ritmo.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
