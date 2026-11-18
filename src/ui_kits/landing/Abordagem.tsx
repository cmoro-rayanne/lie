import 'react';
import { content } from '../../content';
import { Emphasis } from '../../content/Emphasis';

function Abordagem() {
  const { Card, SectionHeading } = window.ElianaLinoDesignSystem_6994f2;
  const { ref, inView } = window.useInView(0.1);

  return (
    <section
      id="abordagem"
      ref={ref}
      style={{ background: 'var(--bg-page)', padding: 'var(--section-y) 0', overflow: 'hidden' }}
    >
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        {/* Title & Subtitle */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(48px,6vw,80px)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity .9s ease, transform .9s ease',
          }}
        >
          <SectionHeading align="center" eyebrow={content.approach.eyebrow}>
            <Emphasis text={content.approach.title} />
          </SectionHeading>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              fontWeight: 300,
              color: 'var(--text-muted)',
              marginTop: '16px',
            }}
          >
            {content.approach.subtitle}
          </p>
        </div>

        {/* 3-Column Grid of Cards */}
        <div
          className="about-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}
        >
          {content.approach.cards.map((s, i) => (
            <div
              key={i}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(40px)',
                transition: `all .6s var(--ease-out-expo) ${0.15 * i}s`,
              }}
            >
              <Card padding="48px 40px" style={{ height: '100%' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: 'var(--text-strong)',
                    marginBottom: 16,
                    lineHeight: 1.3,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1rem',
                    fontWeight: 300,
                    lineHeight: 1.8,
                    color: 'var(--text-muted)',
                  }}
                >
                  {s.text}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Abordagem = Abordagem;
export default Abordagem;
