import React from 'react';

const STEPS = [
  {
    title: 'Olhar Integral',
    text: 'A experiência clínica me ensinou que o ser humano deve ser compreendido em sua totalidade. Cada atendimento respeita a sua história singular, seus recursos atuais e seu ritmo de desenvolvimento.'
  },
  {
    title: 'Bases e Abordagens',
    text: 'Minha prática profissional integra diferentes campos de estudo que sustentam e dão profundidade ao trabalho: a Gestalt-terapia, a Psicologia Corporal, a Psicologia Transpessoal, a Constelação Familiar e o Pathwork.'
  },
  {
    title: 'A Inspiração do Pathwork',
    text: 'Uma das grandes bases deste percurso é a visão de desenvolvimento baseada na integração das diferentes dimensões da personalidade e no encontro com a sua verdade interior.'
  }
];

function Abordagem() {
  const { Card, SectionHeading } = window.ElianaLinoDesignSystem_6994f2;
  const { ref, inView } = window.useInView(0.1);

  return (
    <section id="abordagem" ref={ref} style={{ background: 'var(--bg-page)', padding: 'var(--section-y) 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        
        {/* Title & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,6vw,80px)', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity .9s ease, transform .9s ease' }}>
          <SectionHeading align="center" eyebrow="Abordagem Terapêutica">
            O Caminho de <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Integração</em>
          </SectionHeading>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 300, color: 'var(--text-muted)', marginTop: '16px' }}>
            Mente, corpo, emoções e espiritualidade caminham juntos.
          </p>
        </div>

        {/* 3-Column Grid of Cards */}
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {STEPS.map((s, i) => (
            <div key={s.title} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(40px)', transition: `all .6s var(--ease-out-expo) ${0.15 * i}s` }}>
              <Card padding="48px 40px" style={{ height: '100%' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--text-strong)', marginBottom: 16, lineHeight: 1.3 }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.8, color: 'var(--text-muted)' }}>
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
