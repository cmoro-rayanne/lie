import { useInView } from '../../hooks/useInView';

const areas = [
  {
    icon: '◈',
    title: 'Desenvolvimento e Maturidade',
    description:
      'Acompanhamento de adolescentes e jovens em seus processos de amadurecimento, construção da identidade e fortalecimento de vínculos consigo mesmos e com o mundo.',
  },
  {
    icon: '◇',
    title: 'O Despertar do Feminino',
    description:
      'Espaço dedicado a acompanhar mulheres em processos de reconexão com sua essência, seus ciclos, sua potência e sua verdade interior, favorecendo caminhos de maior autenticidade e pertencimento.',
  },
  {
    icon: '◎',
    title: 'Jornada Individual & Autoconhecimento',
    description:
      'Processos terapêuticos focados na superação de bloqueios emocionais, expansão da consciência e realização pessoal.',
  },
];

function AreaCard({ area, index, inView }: { area: typeof areas[0]; index: number; inView: boolean }) {
  return (
    <div
      style={{
        background: 'var(--color-sand-50)',
        border: '1px solid var(--color-sand-300)',
        borderRadius: 'var(--radius-lg)',
        padding: '48px 40px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${index * 0.15}s`,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--color-terra-300)';
        el.style.boxShadow = '0 20px 60px rgba(160,120,80,0.08)';
        el.style.transform = 'translateY(-6px)';
        el.style.background = '#fff';
        const deco = el.querySelector('.card-deco') as HTMLDivElement;
        if (deco) deco.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--color-sand-300)';
        el.style.boxShadow = 'none';
        el.style.transform = inView ? 'translateY(0)' : 'translateY(40px)';
        el.style.background = 'var(--color-sand-50)';
        const deco = el.querySelector('.card-deco') as HTMLDivElement;
        if (deco) deco.style.opacity = '0';
      }}
    >
      {/* Decorative gradient on hover */}
      <div
        className="card-deco"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--color-terra-300), var(--color-olive-300))',
          opacity: 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Icon */}
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2rem',
          color: 'var(--color-terra-400)',
          marginBottom: '24px',
          lineHeight: 1,
        }}
      >
        {area.icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.5rem',
          fontWeight: 400,
          color: 'var(--color-warm-800)',
          marginBottom: '16px',
          lineHeight: 1.3,
        }}
      >
        {area.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1rem',
          fontWeight: 300,
          lineHeight: 1.8,
          color: 'var(--color-warm-600)',
        }}
      >
        {area.description}
      </p>
    </div>
  );
}

export function Atuacao() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      id="atuacao"
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        background: 'var(--color-terra-100)',
        padding: 'clamp(80px, 10vw, 140px) 0',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 32px' }}>
        {/* Header */}
        <div
          style={{
            marginBottom: 'clamp(48px, 6vw, 80px)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
            textAlign: 'center',
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
            Especialidades
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: 'var(--color-warm-800)',
              letterSpacing: '-0.01em',
            }}
          >
            Áreas de <em style={{ color: 'var(--color-terra-500)' }}>Dedicação</em>
          </h2>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
          }}
          className="atuacao-grid"
        >
          {areas.map((area, i) => (
            <AreaCard key={area.title} area={area} index={i} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .atuacao-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
