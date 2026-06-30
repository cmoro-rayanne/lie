import React, { useState } from 'react';

function Contact() {
  const { SectionHeading, Divider, Button, IconButton, Input } = window.ElianaLinoDesignSystem_6994f2;
  const { Phone, Mail, MapPin, MessageCircle, Instagram, Linkedin } = window.Icons;
  const { ref, inView } = window.useInView(0.1);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => { setBusy(false); setSent(true); setTimeout(() => setSent(false), 5000); }, 1100);
  };

  const INFO = [
    { icon: <Phone size={18} />, label: 'Telefone / WhatsApp', value: '+55 (11) 99999-9999' },
    { icon: <Mail size={18} />, label: 'E-mail', value: 'contato@ile.com.br' },
    { icon: <MapPin size={18} />, label: 'Endereço', value: 'Av. Paulista, 1000 — São Paulo, SP' },
  ];

  return (
    <>
      {/* Olive CTA banner */}
      <section style={{ background: 'var(--accent-go)', padding: 'clamp(60px,8vw,100px) 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 var(--gutter)', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 20 }}>Pronto para começar?</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, lineHeight: 1.2, color: '#fff', marginBottom: 16, letterSpacing: '-0.01em' }}>O primeiro passo começa com uma conversa.</h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 300, color: 'rgba(255,255,255,0.78)', marginBottom: 40 }}>Agende uma conversa de acolhimento e descubra como a terapia pode caminhar com você.</p>
          <a href="#contato" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', padding: '16px 40px', background: '#fff', color: 'var(--color-olive-600)', borderRadius: 'var(--radius-sm)', transition: 'all .3s ease' }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)'; }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <MessageCircle size={16} /> Agendar via WhatsApp
          </a>
        </div>
      </section>

      {/* Form */}
      <section id="contato" ref={ref} style={{ background: 'var(--bg-page)', padding: 'var(--section-y) 0' }}>
        <div className="contact-grid" style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(48px,6vw,96px)' }}>
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-32px)', transition: 'opacity 1s ease, transform 1s var(--ease-out-expo)' }}>
            <SectionHeading eyebrow="Contato">Vamos conversar?</SectionHeading>
            <Divider className={inView ? 'animate-line-grow' : ''} style={{ margin: '24px 0 32px' }} />
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.8, color: 'var(--text-body)', marginBottom: 40 }}>
              Preencha o formulário ou entre em contato diretamente. Respondo todas as mensagens em até 24 horas.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
              {INFO.map((it) => (
                <div key={it.label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 'var(--radius-sm)', background: 'var(--color-terra-100)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.icon}</div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 2px' }}>{it.label}</p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 300, color: 'var(--text-strong)', margin: 0 }}>{it.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <IconButton variant="soft" aria-label="Instagram" href="#"><Instagram size={18} /></IconButton>
              <IconButton variant="soft" aria-label="LinkedIn" href="#"><Linkedin size={18} /></IconButton>
            </div>
          </div>

          <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(32px)', transition: 'opacity 1s ease .2s, transform 1s var(--ease-out-expo) .2s' }}>
            {sent ? (
              <div className="animate-fade-in-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 32px', background: 'var(--color-olive-100)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-olive-200)' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--color-olive-500)', marginBottom: 16 }}>◇</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--text-strong)', marginBottom: 12 }}>Mensagem enviada!</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.7 }}>Obrigada pelo contato. Retornarei em até 24 horas.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Input placeholder="Seu nome completo" required />
                  <Input type="email" placeholder="Seu e-mail" required />
                </div>
                <Input type="tel" placeholder="WhatsApp (opcional)" />
                <Input as="select" defaultValue="" required options={[
                  { value: '', label: 'Assunto — por onde começar?' },
                  { value: 'ansiedade', label: 'Ansiedade ou estresse' },
                  { value: 'autoconhecimento', label: 'Autoconhecimento' },
                  { value: 'transicao', label: 'Transição de vida / carreira' },
                  { value: 'feminino', label: 'O despertar do feminino' },
                  { value: 'outro', label: 'Outro assunto' },
                ]} />
                <Input as="textarea" rows={5} placeholder="Conte um pouco sobre o que você está buscando…" required />
                <Button type="submit" variant="primary" size="lg" tone="light" disabled={busy} style={{ alignSelf: 'flex-start' }}>
                  {busy ? 'Enviando…' : 'Enviar mensagem'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
window.Contact = Contact;
export default Contact;
