import { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Selecione um assunto'),
  message: z.string().min(10, 'Mensagem deve ter ao menos 10 caracteres'),
});
type FormData = z.infer<typeof schema>;

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 18px',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.9rem',
  fontWeight: 300,
  color: 'var(--color-warm-800)',
  background: 'var(--color-sand-50)',
  border: '1px solid var(--color-sand-300)',
  borderRadius: 'var(--radius-sm)',
  outline: 'none',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
};

export function Contact() {
  const { ref, inView } = useInView(0.1);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    // Simulate async submit
    await new Promise((res) => setTimeout(res, 1200));
    console.log('Form submitted:', data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      {/* CTA Banner */}
      <section
        style={{
          background: 'var(--color-olive-500)',
          padding: 'clamp(60px, 8vw, 100px) 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 60%),
              radial-gradient(ellipse 40% 60% at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 50%)
            `,
          }}
        />
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.65)',
              marginBottom: '20px',
            }}
          >
            Pronto para começar?
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: '#fff',
              marginBottom: '16px',
              letterSpacing: '-0.01em',
            }}
          >
            O primeiro passo começa com uma conversa.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.75)',
              marginBottom: '40px',
            }}
          >
            Agende uma sessão de acolhimento gratuita e descubra como a terapia pode transformar sua vida.
          </p>
          <a
            href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20agendar%20uma%20consulta."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '16px 40px',
              background: '#fff',
              color: 'var(--color-olive-600)',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = 'none';
            }}
          >
            <MessageCircle size={16} />
            Agendar via WhatsApp
          </a>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section
        id="contato"
        ref={ref as React.RefObject<HTMLElement>}
        style={{
          background: 'var(--color-sand-50)',
          padding: 'clamp(80px, 10vw, 140px) 0',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 32px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(48px, 6vw, 96px)',
            }}
            className="contact-grid"
          >
            {/* Info Column */}
            <div
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(-32px)',
                transition: 'opacity 1s ease, transform 1s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--color-terra-400)',
                  marginBottom: '16px',
                }}
              >
                Contato
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 400,
                  lineHeight: 1.15,
                  color: 'var(--color-warm-800)',
                  marginBottom: '24px',
                  letterSpacing: '-0.01em',
                }}
              >
                Vamos conversar?
              </h2>
              <div
                style={{
                  width: '48px',
                  height: '1px',
                  background: 'linear-gradient(90deg, var(--color-terra-300), transparent)',
                  marginBottom: '32px',
                  transformOrigin: 'left',
                  transform: inView ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 1s ease 0.4s',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: 'var(--color-warm-700)',
                  marginBottom: '40px',
                }}
              >
                Preencha o formulário ou entre em contato diretamente. Respondo todas as mensagens em até 24 horas.
              </p>

              {/* Contact Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                {[
                  { icon: <Phone size={18} />, label: 'Telefone / WhatsApp', value: '+55 (11) 99999-9999' },
                  { icon: <Mail size={18} />, label: 'E-mail', value: 'contato@elianalino.com.br' },
                  { icon: <MapPin size={18} />, label: 'Endereço', value: 'Av. Paulista, 1000 — São Paulo, SP' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        flexShrink: 0,
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-terra-100)',
                        color: 'var(--color-terra-500)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-warm-600)', marginBottom: '2px' }}>
                        {item.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 300, color: 'var(--color-warm-800)' }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-terra-200)',
                    background: 'var(--color-terra-100)',
                    color: 'var(--color-terra-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = 'var(--color-terra-400)';
                    el.style.color = '#fff';
                    el.style.borderColor = 'var(--color-terra-400)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = 'var(--color-terra-100)';
                    el.style.color = 'var(--color-terra-500)';
                    el.style.borderColor = 'var(--color-terra-200)';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Form Column */}
            <div
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(32px)',
                transition: 'opacity 1s ease 0.2s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.2s',
              }}
            >
              {submitted ? (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '60px 32px',
                    background: 'var(--color-olive-100)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-olive-200)',
                    animation: 'fadeInUp 0.6s ease',
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🌿</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--color-warm-800)', marginBottom: '12px' }}>
                    Mensagem enviada!
                  </h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 300, color: 'var(--color-warm-600)', lineHeight: 1.7 }}>
                    Obrigada pelo contato. Retornarei em até 24 horas.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                  noValidate
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row">
                    <div>
                      <input
                        {...register('name')}
                        id="name"
                        placeholder="Seu nome completo"
                        style={inputStyle}
                        onFocus={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = 'var(--color-terra-400)';
                          (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(192,140,80,0.1)';
                        }}
                        onBlur={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = 'var(--color-sand-300)';
                          (e.target as HTMLInputElement).style.boxShadow = 'none';
                        }}
                      />
                      {errors.name && (
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#c0392b', marginTop: '6px' }}>
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        {...register('email')}
                        id="email"
                        type="email"
                        placeholder="Seu e-mail"
                        style={inputStyle}
                        onFocus={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = 'var(--color-terra-400)';
                          (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(192,140,80,0.1)';
                        }}
                        onBlur={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = 'var(--color-sand-300)';
                          (e.target as HTMLInputElement).style.boxShadow = 'none';
                        }}
                      />
                      {errors.email && (
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#c0392b', marginTop: '6px' }}>
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <input
                      {...register('phone')}
                      id="phone"
                      type="tel"
                      placeholder="WhatsApp (opcional)"
                      style={inputStyle}
                      onFocus={(e) => {
                        (e.target as HTMLInputElement).style.borderColor = 'var(--color-terra-400)';
                        (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(192,140,80,0.1)';
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLInputElement).style.borderColor = 'var(--color-sand-300)';
                        (e.target as HTMLInputElement).style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <select
                      {...register('subject')}
                      id="subject"
                      style={{ ...inputStyle, color: 'var(--color-warm-700)', appearance: 'none', cursor: 'pointer' }}
                      onFocus={(e) => {
                        (e.target as HTMLSelectElement).style.borderColor = 'var(--color-terra-400)';
                        (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px rgba(192,140,80,0.1)';
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLSelectElement).style.borderColor = 'var(--color-sand-300)';
                        (e.target as HTMLSelectElement).style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Assunto — por onde começar?</option>
                      <option value="ansiedade">Ansiedade ou estresse</option>
                      <option value="autoconhecimento">Autoconhecimento</option>
                      <option value="transição">Transição de vida/carreira</option>
                      <option value="relacionamentos">Relacionamentos</option>
                      <option value="depressão">Depressão ou luto</option>
                      <option value="burnout">Burnout</option>
                      <option value="outro">Outro assunto</option>
                    </select>
                    {errors.subject && (
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#c0392b', marginTop: '6px' }}>
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <textarea
                      {...register('message')}
                      id="message"
                      placeholder="Conte um pouco sobre o que você está buscando..."
                      rows={5}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                      onFocus={(e) => {
                        (e.target as HTMLTextAreaElement).style.borderColor = 'var(--color-terra-400)';
                        (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(192,140,80,0.1)';
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLTextAreaElement).style.borderColor = 'var(--color-sand-300)';
                        (e.target as HTMLTextAreaElement).style.boxShadow = 'none';
                      }}
                    />
                    {errors.message && (
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#c0392b', marginTop: '6px' }}>
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      padding: '16px 40px',
                      background: isSubmitting
                        ? 'var(--color-sand-300)'
                        : 'linear-gradient(135deg, var(--color-terra-400), var(--color-terra-500))',
                      color: isSubmitting ? 'var(--color-warm-600)' : '#fff',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.35s ease',
                      alignSelf: 'flex-start',
                    }}
                    onMouseEnter={(e) => {
                      if (isSubmitting) return;
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.transform = 'translateY(-2px)';
                      el.style.boxShadow = '0 12px 40px rgba(160,105,60,0.35)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.transform = 'translateY(0)';
                      el.style.boxShadow = 'none';
                    }}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .contact-grid { grid-template-columns: 1fr !important; }
            .form-row { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  );
}
