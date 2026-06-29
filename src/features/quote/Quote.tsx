
export function Quote() {
  return (
    <section style={{ background: 'var(--grad-quote)', padding: 'clamp(80px,10vw,120px) 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', border: '1px solid rgba(192,169,130,0.1)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(192,169,130,0.06)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 var(--gutter)', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'rgba(192,169,130,0.25)', lineHeight: 1, marginBottom: -12 }}>“</div>
        <blockquote style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 300, lineHeight: 1.5, color: 'rgba(240,230,215,0.92)', fontStyle: 'italic', margin: '0 0 32px' }}>
          O autoconhecimento é a viagem mais corajosa que um ser humano pode fazer.
        </blockquote>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(192,169,130,0.6)' }}>
          — Eliana Lino · Psicóloga Clínica
        </p>
      </div>
    </section>
  );
}
