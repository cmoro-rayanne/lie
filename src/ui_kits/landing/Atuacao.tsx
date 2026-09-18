import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Area = {
  num: string;
  title: string;
  subtitle: string;
  lead: string;
  body: string;
};

const AREAS: Area[] = [
  {
    num: '01',
    title: 'Jornada Individual',
    subtitle: 'Desenvolvimento e Maturidade',
    lead: 'Acompanhamento individual para adolescentes, jovens e adultos em processos de autoconhecimento, amadurecimento e transformação.',
    body: 'Um espaço para reconhecer padrões, conflitos e bloqueios, fortalecer a relação consigo mesmo e encontrar formas mais autênticas de se expressar e viver.',
  },
  {
    num: '02',
    title: 'Pathwork',
    subtitle: 'Grupos de Consciência para Adultos e Jovens',
    lead: 'Grupos de autoconhecimento inspirados nos ensinamentos do Pathwork de Eva Pierrakos.',
    body: 'Um espaço para investigar emoções, padrões, conflitos e resistências, ampliando a consciência e desenvolvendo mais verdade, presença e autorresponsabilidade.',
  },
  {
    num: '03',
    title: 'O Despertar do Feminino',
    subtitle: 'Corpo · Ciclos · Linhagem · Essência',
    lead: 'Um espaço para mulheres que desejam se reconectar com seu corpo, seus ciclos, sua força e sua verdade interior.',
    body: 'Uma jornada que integra limpeza do ventre, reconexão com o feminino e constelação familiar, favorecendo um olhar consciente sobre histórias, vínculos e padrões que atravessam a experiência feminina.',
  },
];

/* ------------------------------------------------------------------
   Modal com o texto completo da área
   ------------------------------------------------------------------ */
function AreaModal({ area, onClose }: { area: Area; onClose: () => void }) {
  const { X } = window.Icons;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // portal para o body: a seção usa overflow:hidden e os cards têm transform,
  // que criariam bloco de contenção para o position:fixed do overlay
  return createPortal(
    <div
      className="area-modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--gutter)',
        background: 'rgba(38, 33, 25, 0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="area-modal-title"
        className="area-modal-panel"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 560,
          maxHeight: '86vh',
          overflowY: 'auto',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-soft)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(32px, 5vw, 56px)',
          boxShadow: '0 32px 80px rgba(60, 45, 30, 0.28)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, var(--color-terra-300), var(--color-olive-300))',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          }}
        />

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            padding: 0,
            background: 'transparent',
            border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all .3s ease',
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.borderColor = 'var(--border-accent)';
            e.currentTarget.style.color = 'var(--accent)';
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.borderColor = 'var(--border-soft)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <X size={16} />
        </button>

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            color: 'var(--color-terra-400)',
            lineHeight: 1,
            marginBottom: 20,
          }}
        >
          {area.num}
        </div>

        <h3
          id="area-modal-title"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.6rem, 3vw, 2rem)',
            fontWeight: 400,
            color: 'var(--text-strong)',
            lineHeight: 1.25,
            marginBottom: 10,
            paddingRight: 32,
          }}
        >
          {area.title}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.72rem',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-terra-400)',
            marginBottom: 24,
          }}
        >
          {area.subtitle}
        </p>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.05rem',
            fontWeight: 300,
            lineHeight: 1.8,
            color: 'var(--text-body, var(--text-muted))',
            marginBottom: 18,
          }}
        >
          {area.lead}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.05rem',
            fontWeight: 300,
            lineHeight: 1.8,
            color: 'var(--text-muted)',
          }}
        >
          {area.body}
        </p>
      </div>
    </div>,
    document.body,
  );
}

function Atuacao() {
  const { Card, SectionHeading } = window.ElianaLinoDesignSystem_6994f2;
  const { ChevronRight } = window.Icons;
  const { ref, inView } = window.useInView(0.1);
  const [openArea, setOpenArea] = useState<Area | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const open = (area: Area, el: HTMLElement) => {
    lastTrigger.current = el;
    setOpenArea(area);
  };
  const close = () => {
    setOpenArea(null);
    lastTrigger.current?.focus();
  };

  return (
    <section
      id="atuacao"
      ref={ref}
      style={{ background: 'var(--bg-warm)', padding: 'var(--section-y) 0', overflow: 'hidden' }}
    >
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        <div
          style={{
            marginBottom: 'clamp(48px,6vw,80px)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity .9s ease, transform .9s ease',
          }}
        >
          <SectionHeading align="center" eyebrow="Áreas de Atuação">
            Como posso <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>caminhar</em> ao
            seu lado
          </SectionHeading>
        </div>

        <div
          className="atuacao-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}
        >
          {AREAS.map((a, i) => (
            <div
              key={a.num}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(40px)',
                transition: `all .6s var(--ease-out-expo) ${0.15 * i}s`,
              }}
            >
              <Card
                padding="48px 40px"
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`${a.num} · ${a.title} — ler mais`}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => open(a, e.currentTarget)}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open(a, e.currentTarget);
                  }
                }}
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    color: 'var(--color-terra-400)',
                    marginBottom: 24,
                    lineHeight: 1,
                  }}
                >
                  {a.num}
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: 'var(--text-strong)',
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}
                >
                  {a.title}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-terra-400)',
                    marginBottom: 20,
                    lineHeight: 1.6,
                  }}
                >
                  {a.subtitle}
                </p>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1rem',
                    fontWeight: 300,
                    lineHeight: 1.8,
                    color: 'var(--text-muted)',
                    marginBottom: 24,
                  }}
                >
                  {a.lead}
                </p>

                <span
                  style={{
                    marginTop: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                  }}
                >
                  Saiba mais <ChevronRight size={14} />
                </span>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {openArea && <AreaModal area={openArea} onClose={close} />}
    </section>
  );
}

window.Atuacao = Atuacao;
export default Atuacao;
