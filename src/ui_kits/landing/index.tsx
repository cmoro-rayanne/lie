import 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Abordagem from './Abordagem';
import Atuacao from './Atuacao';
import Grupos from './Grupos';
import Projetos from './Projetos';
import Quote from './Quote';
import Testimonials from './Testimonials';
import Contact from './Contact';
import Footer, { WhatsAppFab } from './Footer';

// Import design system CSS
import '../../styles.css';

export default function LandingPage() {
  return (
    <>
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
      `}</style>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Quote />
        <Abordagem />
        <Atuacao />
        <Grupos />
        <Projetos />
        {/* <Testimonials /> */}
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
