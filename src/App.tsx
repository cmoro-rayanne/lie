import './index.css';
import { Navbar } from './features/navigation/Navbar';
import { Hero } from './features/hero/Hero';
import { About } from './features/about/About';
import { Abordagem } from './features/approach/Abordagem';
import { Atuacao } from './features/services/Atuacao';
import { Projetos } from './features/projects/Projetos';
import { Grupos } from './features/groups/Grupos';
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
        <Abordagem />
        <Atuacao />
        <Projetos />
        <Grupos />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}

export default App;
