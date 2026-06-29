import { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { SectionHeading } from '../../components/design-system/SectionHeading';
import { IconButton } from '../../components/design-system/IconButton';
import { Avatar } from '../../components/design-system/Avatar';
import { StatCard } from '../../components/design-system/StatCard';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TESTIMONIALS = [
  { text: 'A terapia foi transformadora. Aprendi a entender minha ansiedade ao invés de fugir dela. Hoje me sinto mais inteira e capaz de enfrentar os desafios do dia a dia.', name: 'Mariana S.', role: 'Consultora de Marketing', initials: 'MS' },
  { text: 'Passei por uma transição de carreira difícil e o espaço de acolhimento que encontrei aqui foi essencial. A escuta atenta me ajudou a clarear meu caminho.', name: 'Ricardo L.', role: 'Engenheiro', initials: 'RL' },
  { text: 'Nunca imaginei que teria coragem de me abrir assim. Um ambiente completamente seguro e sem julgamentos. Foi um divisor de águas na minha vida.', name: 'Fernanda K.', role: 'Professora', initials: 'FK' },
];

const STATS = [
  { value: '500+', label: 'Pessoas acompanhadas', sub: 'ao longo da carreira' },
  { value: '98%', label: 'Taxa de satisfação', sub: 'baseado em avaliações' },
  { value: '8+', label: 'Anos de experiência', sub: 'em psicologia clínica' },
];

export function Testimonials() {
  const { ref, inView } = useInView(0.1);
  const [active, setActive] = useState(0);
  const t = TESTIMONIALS[active];
  const prev = () => setActive((a) => (a === 0 ? TESTIMONIALS.length - 1 : a - 1));
  const next = () => setActive((a) => (a === TESTIMONIALS.length - 1 ? 0 : a + 1));

  return (
    <section id="depoimentos" ref={ref as React.RefObject<HTMLElement>} style={{ background: 'var(--bg-subtle)', padding: 'var(--section-y) 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        <div style={{ marginBottom: 'clamp(48px,6vw,72px)', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity .9s ease, transform .9s ease' }}>
          <SectionHeading eyebrow="Depoimentos">
            Histórias de <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>transformação</em>
          </SectionHeading>
        </div>

        <div className="testimonial-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity .9s ease .2s, transform .9s ease .2s' }}>
          <div>
            <span style={{ color: 'var(--color-terra-300)', opacity: 0.7, display: 'inline-flex', marginBottom: 24 }}><Quote size={36} /></span>
            <blockquote key={active} className="animate-fade-in-up" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.1rem,2vw,1.4rem)', fontWeight: 400, lineHeight: 1.7, color: 'var(--text-strong)', fontStyle: 'italic', margin: '0 0 32px' }}>
              “{t.text}”
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
              <Avatar initials={t.initials} />
              <div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-strong)', margin: 0 }}>{t.name}</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 300, color: 'var(--text-muted)', margin: 0 }}>{t.role}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <IconButton aria-label="Depoimento anterior" onClick={prev}><ChevronLeft size={18} /></IconButton>
              <div style={{ display: 'flex', gap: 8 }}>
                {TESTIMONIALS.map((_, i) => (
                  <button key={i} aria-label={`Depoimento ${i + 1}`} onClick={() => setActive(i)} style={{
                    width: i === active ? 24 : 8, height: 8, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0,
                    background: i === active ? 'var(--color-terra-400)' : 'var(--color-terra-200)', transition: 'all .35s ease',
                  }} />
                ))}
              </div>
              <IconButton aria-label="Próximo depoimento" onClick={next}><ChevronRight size={18} /></IconButton>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {STATS.map((s) => <StatCard key={s.label} value={s.value} label={s.label} sub={s.sub} />)}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .testimonial-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}
