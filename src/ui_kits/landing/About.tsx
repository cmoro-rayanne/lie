import 'react';
import sobreEliana from '../../assets/fotos/web/IMG_1486-web.jpg';
import { content } from '../../content';
import { Emphasis } from '../../content/Emphasis';

function About() {
  const { SectionHeading, Divider } = window.ElianaLinoDesignSystem_6994f2;
  const { ref, inView } = window.useInView();
  return (
    <section
      id="sobre"
      ref={ref}
      style={{ background: 'var(--bg-page)', padding: 'var(--section-y) 0', overflow: 'hidden' }}
    >
      <div
        className="about-grid"
        style={{
          maxWidth: 'var(--container)',
          margin: '0 auto',
          padding: '0 var(--gutter)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(48px,6vw,96px)',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateX(0)' : 'translateX(-48px)',
            transition: 'opacity 1s ease, transform 1s var(--ease-out-expo)',
          }}
        >
          <div
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'var(--color-sand-200)',
            }}
          >
            <img
              src={content.images.about.src ?? sobreEliana}
              alt={content.images.about.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '50% 38%',
                filter: 'brightness(0.96) contrast(1.04) saturate(0.9)',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              top: -16,
              left: -16,
              width: 80,
              height: 80,
              border: '1px solid var(--color-terra-200)',
              borderRadius: 'var(--radius-sm)',
              opacity: 0.7,
              zIndex: -1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -16,
              right: -16,
              width: 120,
              height: 120,
              border: '1px solid var(--color-terra-200)',
              borderRadius: 'var(--radius-sm)',
              opacity: 0.7,
              zIndex: -1,
            }}
          />
        </div>

        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateX(0)' : 'translateX(48px)',
            transition: 'opacity 1s ease .2s, transform 1s var(--ease-out-expo) .2s',
          }}
        >
          <SectionHeading eyebrow={content.about.eyebrow}>
            <Emphasis text={content.about.title} />
          </SectionHeading>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              margin: '16px 0 28px',
            }}
          >
            {content.about.subtitle}
          </p>
          <Divider className={inView ? 'animate-line-grow' : ''} style={{ marginBottom: 28 }} />
          {content.about.paragraphs.map((text, i, all) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                fontWeight: 300,
                lineHeight: 1.9,
                color: 'var(--text-body)',
                marginBottom: i < all.length - 1 ? 20 : undefined,
              }}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
window.About = About;
export default About;
