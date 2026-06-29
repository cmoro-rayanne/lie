import { useInView } from '../../hooks/useInView';
import { Card } from '../../components/design-system/Card';
import { SectionHeading } from '../../components/design-system/SectionHeading';

const AREAS = [
  { icon: '◈', title: 'Desenvolvimento e Maturidade', text: 'Acompanhamento de adolescentes e jovens em seus processos de amadurecimento, construção da identidade e fortalecimento de vínculos consigo mesmos e com o mundo.' },
  { icon: '◇', title: 'O Despertar do Feminino', text: 'Espaço dedicado a acompanhar mulheres em processos de reconexão com sua essência, seus ciclos, sua potência e sua verdade interior.' },
  { icon: '◎', title: 'Jornada Individual', text: 'Processos terapêuticos focados na superação de bloqueios emocionais, expansão da consciência e realização pessoal.' },
];

export function Atuacao() {
  const { ref, inView } = useInView(0.1);
  return (
    <section id="atuacao" ref={ref as React.RefObject<HTMLElement>} style={{ background: 'var(--bg-warm)', padding: 'var(--section-y) 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        <div style={{ marginBottom: 'clamp(48px,6vw,80px)', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity .9s ease, transform .9s ease' }}>
          <SectionHeading align="center" eyebrow="Áreas de Atuação">
            Como posso <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>caminhar</em> ao seu lado
          </SectionHeading>
        </div>
        <div className="atuacao-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {AREAS.map((a, i) => (
            <div key={a.title} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(40px)', transition: `all .6s var(--ease-out-expo) ${0.15 * i}s` }}>
              <Card padding="48px 40px" style={{ height: '100%' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-terra-400)', marginBottom: 24, lineHeight: 1 }}>{a.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--text-strong)', marginBottom: 16, lineHeight: 1.3 }}>{a.title}</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.8, color: 'var(--text-muted)' }}>{a.text}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .atuacao-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
