import { useInView } from '../../hooks/useInView';

export function Projetos() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      id="projetos"
      ref={ref as React.RefObject<HTMLElement>}
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
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(48px, 6vw, 96px)',
          alignItems: 'center',
        }}
        className="projetos-grid"
      >
        {/* Text Column */}
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateX(0)' : 'translateX(-48px)',
            transition: 'opacity 1s ease 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
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
            Projetos Criativos
          </p>

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
            Expressão e <em style={{ color: 'var(--color-terra-500)' }}>Criatividade</em>
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
            Instrumentos que ampliam a reflexão e o autoconhecimento.
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
            A dimensão criativa é parte fundamental da minha forma de trabalhar. Sou autora de um livro que narra o diálogo sensível entre uma menina indígena e seu avô à beira do rio sobre a vida — um convite para reencontrar a criança interior que habita em cada um de nós.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              fontWeight: 300,
              lineHeight: 1.9,
              color: 'var(--color-warm-700)',
            }}
          >
            Dessa veia artística nasceram também um livro de poesias e outras ferramentas terapêuticas coletivas, como cartas e um caderno de revisão diária, criados para expandir os processos de expressão e cura.
          </p>
        </div>

        {/* Photo Column */}
        <div
          style={{
            position: 'relative',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateX(0)' : 'translateX(48px)',
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
              src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"
              alt="Livros e criatividade"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.95) contrast(1.05) saturate(0.85)',
              }}
            />
          </div>

          {/* Decorative shapes */}
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              border: '1px solid var(--color-terra-200)',
              borderRadius: 'var(--radius-sm)',
              opacity: 0.7,
              zIndex: -1,
            }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .projetos-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
