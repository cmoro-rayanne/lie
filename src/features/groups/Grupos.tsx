import { useInView } from '../../hooks/useInView';

export function Grupos() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      id="grupos"
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        background: 'linear-gradient(135deg, var(--color-warm-900) 0%, #3a2e28 50%, #4a3830 100%)',
        padding: 'clamp(80px, 10vw, 120px) 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background circles */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          border: '1px solid rgba(192,169,130,0.1)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          border: '1px solid rgba(192,169,130,0.06)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '0 32px',
          position: 'relative',
          zIndex: 1,
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 1s ease, transform 1s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 400,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(192,169,130,0.8)',
            marginBottom: '16px',
          }}
        >
          Grupos Terapêuticos
        </p>
        
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: '#f5efe8',
            marginBottom: '20px',
            letterSpacing: '-0.01em',
          }}
        >
          Espaços de <em style={{ color: 'rgba(192,169,130,1)', fontStyle: 'italic' }}>Partilha</em>
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.05rem',
            fontWeight: 300,
            color: 'rgba(235,220,200,0.8)',
            marginBottom: '36px',
          }}
        >
          O poder do encontro e da experiência compartilhada.
        </p>

        {/* Divider */}
        <div
          style={{
            width: '48px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(192,169,130,0.6), transparent)',
            margin: '0 auto 36px',
          }}
        />

        <blockquote
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 300,
            lineHeight: 1.8,
            color: 'rgba(240,230,215,0.92)',
            letterSpacing: '0.01em',
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          Além dos atendimentos individuais, facilito grupos de desenvolvimento humano e autoconhecimento. Nesses espaços, a experiência compartilhada possibilita encontros profundos consigo mesmo e com os outros, ampliando a consciência, a autenticidade e a capacidade de construir relações mais verdadeiras.
        </blockquote>
      </div>
    </section>
  );
}
