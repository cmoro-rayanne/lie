import { useInView } from '../../hooks/useInView';

const services = [
  {
    icon: '◎',
    title: 'Ansiedade & Estresse',
    description:
      'Desenvolva ferramentas práticas para regular emoções, reduzir a ansiedade e retomar o controle da sua vida cotidiana.',
    tags: ['TCC', 'Mindfulness', 'Regulação Emocional'],
  },
  {
    icon: '◈',
    title: 'Autoconhecimento',
    description:
      'Uma jornada de descoberta sobre padrões, crenças e comportamentos que moldam quem você é e como você se relaciona com o mundo.',
    tags: ['Identidade', 'Valores', 'Autenticidade'],
  },
  {
    icon: '◇',
    title: 'Transição de Vida',
    description:
      'Suporte nas grandes mudanças: carreira, relacionamentos, perdas, novos começos. Acompanhamento para atravessar o desconhecido com segurança.',
    tags: ['Mudanças', 'Carreira', 'Relacionamentos'],
  },
  {
    icon: '◉',
    title: 'Depressão & Luto',
    description:
      'Cuidado especializado para períodos de intensidade emocional, com um espaço de acolhimento genuíno e estratégias terapêuticas eficazes.',
    tags: ['Acolhimento', 'Processamento', 'Ressignificação'],
  },
  {
    icon: '◐',
    title: 'Relacionamentos',
    description:
      'Compreenda padrões de vínculo, melhore a comunicação e construa relações mais saudáveis — consigo mesmo e com os outros.',
    tags: ['Apego', 'Comunicação', 'Limites'],
  },
  {
    icon: '◑',
    title: 'Burnout & Trabalho',
    description:
      'Reconecte-se com seus propósitos, estabeleça limites saudáveis e recupere o equilíbrio entre vida pessoal e profissional.',
    tags: ['Exaustão', 'Propósito', 'Equilíbrio'],
  },
];

function ServiceCard({ service, index, inView }: { service: typeof services[0]; index: number; inView: boolean }) {
  return (
    <div
      style={{
        background: 'var(--color-sand-50)',
        border: '1px solid var(--color-sand-300)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 32px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--color-terra-300)';
        el.style.boxShadow = '0 16px 60px rgba(160,120,80,0.12)';
        el.style.transform = 'translateY(-4px)';
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
          height: '3px',
          background: 'linear-gradient(90deg, var(--color-terra-300), var(--color-olive-300))',
          opacity: 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Icon */}
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.6rem',
          color: 'var(--color-terra-400)',
          marginBottom: '20px',
          lineHeight: 1,
        }}
      >
        {service.icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.35rem',
          fontWeight: 400,
          color: 'var(--color-warm-800)',
          marginBottom: '14px',
          lineHeight: 1.3,
        }}
      >
        {service.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          fontWeight: 300,
          lineHeight: 1.8,
          color: 'var(--color-warm-600)',
          marginBottom: '24px',
        }}
      >
        {service.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {service.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              background: 'var(--color-olive-100)',
              color: 'var(--color-olive-600)',
              borderRadius: '999px',
              border: '1px solid var(--color-olive-200)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Services() {
  const { ref, inView } = useInView();

  return (
    <section
      id="atendimentos"
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--color-terra-500)',
                marginBottom: '16px',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.9s ease, transform 0.9s ease',
              }}
            >
              Áreas de Atuação
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 400,
                lineHeight: 1.15,
                color: 'var(--color-warm-800)',
                letterSpacing: '-0.01em',
                maxWidth: '500px',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s',
              }}
            >
              Como posso <em style={{ color: 'var(--color-terra-500)' }}>caminhar</em> ao seu lado
            </h2>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              fontWeight: 300,
              lineHeight: 1.8,
              color: 'var(--color-warm-600)',
              maxWidth: '300px',
              opacity: inView ? 1 : 0,
              transition: 'opacity 0.9s ease 0.3s',
            }}
          >
            Cada pessoa é única. Por isso, cada processo terapêutico é personalizado e construído juntos.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
          className="services-grid"
        >
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
