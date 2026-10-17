import { Fragment, useEffect, useRef, useState } from 'react';
import { navLinks, site } from '../../data/site';
import { useActiveSection } from '../../hooks/useActiveSection';
import Emblem from '../shared/Emblem';
import './Navbar.css';

const ids = navLinks.map((l) => l.id);
/** Sections without a nav link; the indicator clears while they are in view. */
const unlinked = ['propose'];
const upcomingHref = 'upcoming.html';

interface NavbarProps {
  /** On the upcoming-events page the section links lead back to the home page. */
  page?: 'home' | 'upcoming';
}

export default function Navbar({ page = 'home' }: NavbarProps) {
  const home = page === 'home';
  const sectionHref = (id: string) => (home ? `#${id}` : `./#${id}`);
  const homeHref = home ? '#top' : './';
  const upcomingCurrent = page === 'upcoming' ? ('page' as const) : undefined;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(ids, unlinked);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: lock scroll, close on Escape, keep focus inside while open.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    document.body.style.overflow = 'hidden';
    panel?.querySelector<HTMLElement>('a')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === 'Tab' && panel) {
        const focusables = [toggleRef.current, ...Array.from(panel.querySelectorAll<HTMLElement>('a'))].filter(
          Boolean,
        ) as HTMLElement[];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => window.innerWidth > 900 && setOpen(false);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}${open ? ' nav--open' : ''}`}>
      <div className="nav__bar wrap">
        <a className="nav__brand" href={homeHref} onClick={() => setOpen(false)}>
          <Emblem size={46} className="nav__emblem" />
          <span className="nav__brand-text">
            <span className="nav__brand-name">{site.chapterName}</span>
            <span className="nav__brand-sub meta">{site.institution}</span>
          </span>
          <span className="visually-hidden">, home</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          <ul>
            {navLinks.map((link) => (
              <Fragment key={link.id}>
                {link.id === 'join' && (
                  <li>
                    <a href={upcomingHref} className="nav__link nav__link--outline" aria-current={upcomingCurrent}>
                      Upcoming events
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href={sectionHref(link.id)}
                    className={`nav__link${link.id === 'join' ? ' nav__link--action' : ''}`}
                    aria-current={home && active === link.id ? 'true' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              </Fragment>
            ))}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav__toggle-label meta" aria-hidden="true">
            {open ? 'Close' : 'Menu'}
          </span>
          <span className="nav__toggle-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        className="nav__panel"
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <nav aria-label="Mobile">
          <ul className="nav__panel-list">
            {[
              { key: 'home', href: homeHref, label: 'Home', current: undefined },
              ...navLinks.flatMap((link) => {
                const item = { key: link.id, href: sectionHref(link.id), label: link.label as string, current: undefined };
                return link.id === 'events'
                  ? [item, { key: 'upcoming', href: upcomingHref, label: 'Upcoming events', current: upcomingCurrent }]
                  : [item];
              }),
            ].map((item, i) => (
              <li key={item.key}>
                <a href={item.href} aria-current={item.current} onClick={() => setOpen(false)}>
                  <span className="meta">{String(i).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="nav__panel-foot meta">
          <span className="lamp" aria-hidden="true" /> {site.email}
        </p>
      </div>
    </header>
  );
}
