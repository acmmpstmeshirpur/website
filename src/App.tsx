import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Events from './components/Events/Events';
import Team from './components/Team/Team';
import Membership from './components/Membership/Membership';
import EventProposal from './components/EventProposal/EventProposal';
import Footer from './components/Footer/Footer';
import { useReveal } from './hooks/useReveal';

export default function App() {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Events />
        <Team />
        <Membership />
        <EventProposal />
      </main>
      <Footer />
    </>
  );
}
