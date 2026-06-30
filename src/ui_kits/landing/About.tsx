import 'react';
import sobreEliana from '../../uploads/sobre-eliana.png';

function About() {
  const { SectionHeading, Divider } = window.ElianaLinoDesignSystem_6994f2;
  const { ref, inView } = window.useInView();
  return (
    <section id="sobre" ref={ref} style={{ background: 'var(--bg-page)', padding: 'var(--section-y) 0', overflow: 'hidden' }}>
      <div className="about-grid" style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(48px,6vw,96px)', alignItems: 'center' }}>
        <div style={{ position: 'relative', opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-48px)', transition: 'opacity 1s ease, transform 1s var(--ease-out-expo)' }}>
          <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--color-sand-200)' }}>
            <img src={sobreEliana} alt="Eliana Lino"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '42% 40%', filter: 'brightness(0.96) contrast(1.04) saturate(0.9)' }} />
          </div>
          <div style={{ position: 'absolute', top: -16, left: -16, width: 80, height: 80, border: '1px solid var(--color-terra-200)', borderRadius: 'var(--radius-sm)', opacity: 0.7, zIndex: -1 }} />
          <div style={{ position: 'absolute', bottom: -16, right: -16, width: 120, height: 120, border: '1px solid var(--color-terra-200)', borderRadius: 'var(--radius-sm)', opacity: 0.7, zIndex: -1 }} />
        </div>

        <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(48px)', transition: 'opacity 1s ease .2s, transform 1s var(--ease-out-expo) .2s' }}>
          <SectionHeading eyebrow="Sobre mim">
            Uma escuta para a <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>sua totalidade</em>
          </SectionHeading>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', color: 'var(--text-muted)', margin: '16px 0 28px' }}>
            Olhar para a história com presença e acolhimento.
          </p>
          <Divider className={inView ? 'animate-line-grow' : ''} style={{ marginBottom: 28 }} />
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.9, color: 'var(--text-body)', marginBottom: 20 }}>
            Sou psicóloga clínica e acompanho pessoas em processos de autoconhecimento, desenvolvimento emocional e transformação pessoal. Acredito que cada pessoa possui uma sabedoria interna capaz de orientar seu próprio caminho de crescimento.
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.9, color: 'var(--text-body)' }}>
            Meu papel é oferecer um espaço seguro de escuta, presença e investigação para que todas as suas dimensões sejam reconhecidas, compreendidas e integradas no seu próprio ritmo.
          </p>
        </div>
      </div>
    </section>
  );
}
window.About = About;
export default About;
