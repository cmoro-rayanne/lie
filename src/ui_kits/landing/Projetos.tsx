import 'react';
import projetosImg from '../../uploads/projetos-criativos.png';

function Projetos() {
  const { SectionHeading, Divider } = window.ElianaLinoDesignSystem_6994f2;
  const { ref, inView } = window.useInView(0.15);

  return (
    <section 
      id="projetos" 
      ref={ref} 
      style={{ 
        background: 'var(--bg-page)', 
        padding: 'var(--section-y) 0', 
        position: 'relative', 
        overflow: 'hidden' 
      }}
    >
      <style>{`
        @keyframes floatY {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .floating-image {
          animation: floatY 7s ease-in-out infinite;
        }
        .projects-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: clamp(48px, 6vw, 96px);
          align-items: center;
        }
        @media (max-width: 860px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>

      {/* Decorative Organic Elements in Background */}
      <div style={{ position: 'absolute', top: '10%', left: '-5%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,160,110,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(110,130,90,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', position: 'relative', zIndex: 1 }}>
        <div className="projects-grid">
          
          {/* Left Column: Text Content */}
          <div style={{ 
            opacity: inView ? 1 : 0, 
            transform: inView ? 'translateY(0)' : 'translateY(32px)', 
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)' 
          }}>
            <SectionHeading eyebrow="Projetos Criativos">
              Expressão e <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Criatividade</em>
            </SectionHeading>
            
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', color: 'var(--text-muted)', margin: '16px 0 24px' }}>
              Instrumentos que ampliam a reflexão e o autoconhecimento.
            </p>
            
            <Divider className={inView ? 'animate-line-grow' : ''} style={{ marginBottom: 28 }} />
            
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.85, color: 'var(--text-body)', marginBottom: 20 }}>
              A dimensão criativa é parte fundamental da minha forma de trabalhar. Sou autora de um livro que narra o diálogo sensível entre uma menina indígena e seu avô à beira do rio sobre a vida — um convite para reencontrar a criança interior que habita em cada um de nós.
            </p>
            
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.85, color: 'var(--text-body)' }}>
              Dessa veia artística nasceram também um livro de poesias e outras ferramentas terapêuticas coletivas, como cartas e um caderno de revisão diária, criados para expandir os processos de expressão e cura.
            </p>
          </div>

          {/* Right Column: Floating Artwork Mockup */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            opacity: inView ? 1 : 0, 
            transform: inView ? 'scale(1)' : 'scale(0.96)', 
            transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s' 
          }}>
            <div className="floating-image" style={{ position: 'relative', width: '100%', maxWidth: '420px', aspectRatio: '4/5', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 20px 48px rgba(160, 120, 80, 0.12)' }}>
              <img 
                src={projetosImg} 
                alt="Instrumentos e projetos criativos de Eliana Lino" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  filter: 'brightness(0.97) contrast(1.02) saturate(0.95)' 
                }} 
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

window.Projetos = Projetos;
export default Projetos;
