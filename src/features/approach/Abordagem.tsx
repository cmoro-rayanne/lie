import { useInView } from '../../hooks/useInView';

const approachCards = [
  {
    title: 'Olhar Integral',
    text: 'A experiência clínica me ensinou que o ser humano deve ser compreendido em sua totalidade. Cada atendimento respeita a sua história singular, seus recursos atuais e seu ritmo de desenvolvimento.',
  },
  {
    title: 'Bases e Abordagens',
    text: 'Minha prática profissional integra diferentes campos de estudo que sustentam e dão profundidade ao trabalho: a Gestalt-terapia, a Psicologia Corporal, a Psicologia Transpessoal, a Constelação Familiar e o Pathwork.',
  },
  {
    title: 'A Inspiração do Pathwork',
    text: 'Uma das grandes bases deste percurso é a visão de desenvolvimento baseada na integração das diferentes dimensões da personalidade e no encontro com a sua verdade interior.',
  },
];

export function Abordagem() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      id="abordagem"
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        background: 'var(--color-sand-100)',
        padding: 'clamp(80px, 10vw, 140px) 0',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 32px' }}>
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(48px, 6vw, 80px)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--color-terra-500)',
              marginBottom: '16px',
            }}
          >
            Abordagem Terapêutica
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: 'var(--color-warm-800)',
              letterSpacing: '-0.01em',
              marginBottom: '20px',
            }}
          >
            O Caminho de <em style={{ color: 'var(--color-terra-500)' }}>Integração</em>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              fontWeight: 300,
              color: 'var(--color-warm-600)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Mente, corpo, emoções e espiritualidade caminham juntos.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
          }}
          className="approach-grid"
        >
          {approachCards.map((card, i) => (
            <div
              key={card.title}
              style={{
                background: i % 2 === 0 ? 'var(--color-sand-50)' : 'var(--color-olive-100)',
                border: '1px solid rgba(192,160,110,0.15)',
                borderRadius: 'var(--radius-lg)',
                padding: '48px 36px',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.15}s`,
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.4rem',
                  fontWeight: 400,
                  color: 'var(--color-warm-800)',
                  marginBottom: '20px',
                  lineHeight: 1.3,
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.95rem',
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: 'var(--color-warm-700)',
                }}
              >
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .approach-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
