import 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Atuacao from './Atuacao';
import Quote from './Quote';
import Testimonials from './Testimonials';
import Contact from './Contact';
import Footer, { WhatsAppFab } from './Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Atuacao />
        <Quote />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
