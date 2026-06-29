import { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    text: 'A terapia com a Ana Clara foi transformadora. Aprendi a entender minha ansiedade ao invés de fugir dela. Hoje me sinto mais inteira e capaz de enfrentar os desafios do dia a dia.',
    name: 'Mariana S.',
    role: 'Consultora de Marketing',
    initials: 'MS',
  },
  {
    text: 'Passei por uma transição de carreira difícil e o espaço de acolhimento que encontrei aqui foi essencial. A escuta atenta e as reflexões me ajudaram a clarear meu caminho.',
    name: 'Ricardo L.',
    role: 'Engenheiro',
    initials: 'RL',
  },
  {
    text: 'Nunca imaginei que teria coragem de me abrir assim. A Ana Clara criou um ambiente completamente seguro e sem julgamentos. Foi um divisor de águas na minha vida.',
    name: 'Fernanda K.',
    role: 'Professora',
    initials: 'FK',
  },
];

export function Testimonials() {
  const { ref, inView } = useInView(0.1);
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
  const next = () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

  const t = testimonials[active];

  return (
    <>
      {/* Quote / Inspirational Block */}
      <section
        style={{
          background: 'linear-gradient(135deg, #2d2520 0%, #3a2e28 50%, #4a3830 100%)',
          padding: 'clamp(80px, 10vw, 120px) 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background circle */}
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

        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '3rem',
              color: 'rgba(192,169,130,0.25)',
              lineHeight: 1,
              marginBottom: '-12px',
            }}
          >
            "
          </div>
          <blockquote
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 300,
              lineHeight: 1.5,
              color: 'rgba(240,230,215,0.92)',
              fontStyle: 'italic',
              letterSpacing: '0.01em',
              marginBottom: '32px',
            }}
          >
            O autoconhecimento é a viagem mais corajosa que um ser humano pode fazer.
          </blockquote>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 400,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(192,169,130,0.6)',
            }}
          >
            — Ana Clara Mendes, Psicóloga Clínica
          </p>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section
        id="depoimentos"
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
              marginBottom: 'clamp(48px, 6vw, 72px)',
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
                color: 'var(--color-terra-400)',
                marginBottom: '16px',
              }}
            >
              Depoimentos
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 400,
                lineHeight: 1.15,
                color: 'var(--color-warm-800)',
                letterSpacing: '-0.01em',
              }}
            >
              Histórias de <em style={{ color: 'var(--color-terra-500)' }}>transformação</em>
            </h2>
          </div>

          {/* Testimonial Card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '64px',
              alignItems: 'center',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
            }}
            className="testimonial-grid"
          >
            {/* Quote */}
            <div>
              <Quote
                size={36}
                style={{
                  color: 'var(--color-terra-300)',
                  marginBottom: '24px',
                  opacity: 0.7,
                }}
              />

              <blockquote
                key={active}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                  fontWeight: 400,
                  lineHeight: 1.7,
                  color: 'var(--color-warm-800)',
                  fontStyle: 'italic',
                  marginBottom: '32px',
                  animation: 'fadeInUp 0.5s ease both',
                }}
              >
                "{t.text}"
              </blockquote>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
                {/* Avatar */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-terra-300), var(--color-terra-400))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, color: '#fff', letterSpacing: '0.05em' }}>
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-warm-800)' }}>
                    {t.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 300, color: 'var(--color-warm-600)' }}>
                    {t.role}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={prev}
                  aria-label="Depoimento anterior"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-terra-300)',
                    background: 'transparent',
                    color: 'var(--color-terra-500)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = 'var(--color-terra-400)';
                    el.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = 'transparent';
                    el.style.color = 'var(--color-terra-500)';
                  }}
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Dots */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      aria-label={`Depoimento ${i + 1}`}
                      style={{
                        width: i === active ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '999px',
                        background: i === active ? 'var(--color-terra-400)' : 'var(--color-terra-200)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.35s ease',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  aria-label="Próximo depoimento"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-terra-300)',
                    background: 'transparent',
                    color: 'var(--color-terra-500)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = 'var(--color-terra-400)';
                    el.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = 'transparent';
                    el.style.color = 'var(--color-terra-500)';
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Stats / Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { value: '500+', label: 'Clientes atendidos', sub: 'ao longo da carreira' },
                { value: '98%', label: 'Taxa de satisfação', sub: 'baseado em avaliações' },
                { value: '8+', label: 'Anos de experiência', sub: 'em psicologia clínica' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--color-sand-300)',
                    borderRadius: 'var(--radius-md)',
                    padding: '28px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    transition: 'all 0.3s ease',
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateX(0)' : 'translateX(32px)',
                    transitionDelay: `${0.3 + i * 0.1}s`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = 'var(--color-terra-300)';
                    el.style.boxShadow = '0 8px 32px rgba(160,120,80,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = 'var(--color-sand-300)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: '4px',
                      alignSelf: 'stretch',
                      borderRadius: '2px',
                      background: 'linear-gradient(180deg, var(--color-terra-300), var(--color-olive-300))',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 500, color: 'var(--color-terra-500)', lineHeight: 1, marginBottom: '6px' }}>
                      {stat.value}
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-warm-800)', marginBottom: '2px' }}>
                      {stat.label}
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 300, color: 'var(--color-warm-600)' }}>
                      {stat.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .testimonial-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          }
        `}</style>
      </section>
    </>
  );
}
