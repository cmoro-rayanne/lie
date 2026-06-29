import './index.css';
import { Navbar } from './features/navigation/Navbar';
import { Hero } from './features/hero/Hero';
import { About } from './features/about/About';
import { Atuacao } from './features/services/Atuacao';
import { Quote } from './features/quote/Quote';
import { Testimonials } from './features/testimonials/Testimonials';
import { Contact } from './features/contact/Contact';
import { Footer } from './features/contact/Footer';
import { WhatsAppFab } from './shared/WhatsAppFab';

function App() {
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

export default App;
