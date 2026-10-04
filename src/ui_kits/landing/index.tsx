import 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Abordagem from './Abordagem';
import Atuacao from './Atuacao';
import Grupos from './Grupos';
import Projetos from './Projetos';
import Quote from './Quote';
// import Testimonials from './Testimonials';
import Contact from './Contact';
import Footer, { WhatsAppFab } from './Footer';

// Import design system CSS
import '../../styles.css';
import { Analytics } from '@vercel/analytics/react';

export default function LandingPage() {
  return (
    <>
      <Analytics />
      <style>{`
        body { background: var(--bg-page); }
        @media (max-width: 860px) {
          .about-grid, .contact-grid, .testimonial-grid, .atuacao-grid, .footer-grid { grid-template-columns: 1fr !important; }
          .testimonial-grid { gap: 48px !important; }
          .footer-grid { gap: 36px !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-burger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
        .skip-link {
          position: fixed;
          top: -100px;
          left: 16px;
          z-index: 3000;
          padding: 10px 18px;
          background: var(--color-warm-900);
          color: #fff;
          font-family: var(--font-sans);
          font-size: 0.8rem;
          text-decoration: none;
          border-radius: var(--radius-sm);
        }
        .skip-link:focus { top: 16px; }
        a:focus-visible, button:focus-visible, [role="button"]:focus-visible {
          outline: 2px solid var(--color-terra-600);
          outline-offset: 3px;
        }
        .field-input:focus-visible {
          border-color: var(--color-terra-600) !important;
          box-shadow: 0 0 0 3px rgba(124, 91, 60, 0.35) !important;
        }
      `}</style>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo" tabIndex={-1} style={{ outline: 'none' }}>
        <Hero />
        <About />
        <Quote />
        <Abordagem />
        <Grupos />
        <Atuacao />
        <Projetos />
        {/* <Testimonials /> */}
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
