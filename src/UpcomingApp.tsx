import Navbar from './components/Navbar/Navbar';
import Upcoming from './components/Upcoming/Upcoming';
import { useReveal } from './hooks/useReveal';

/** upcoming.html: a standalone page, separate from the scrolling home page. */
export default function UpcomingApp() {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar page="upcoming" />
      <main id="main">
        <Upcoming />
      </main>
    </>
  );
}
