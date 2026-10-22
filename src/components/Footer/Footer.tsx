import { navLinks, site } from '../../data/site';
import CopyEmail from '../shared/CopyEmail';
import Emblem from '../shared/Emblem';
import { ArrowUpRight } from '../shared/Icons';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="footer__contact">
          <h2 id="contact-title" className="display footer__title" data-reveal>
            Contact
          </h2>
          <div className="footer__mail" data-reveal style={{ ['--i' as string]: 1 }}>
            <a className="footer__email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <CopyEmail email={site.email} className="copy-email--cream" />
          </div>
        </div>

        <div className="footer__grid">
          <div className="footer__col">
            <h3 className="meta footer__label">Chapter</h3>
            <p>{site.fullName}</p>
            <p>{site.location}</p>
            <ul className="footer__docs">
              <li>
                <a href={site.charterCertificateUrl} target="_blank" rel="noopener noreferrer">
                  Certificate of Charter
                  <ArrowUpRight className="footer__ext" />
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={site.constitutionUrl} target="_blank" rel="noopener noreferrer">
                  Constitution
                  <ArrowUpRight className="footer__ext" />
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>

          <nav className="footer__col" aria-label="Footer">
            <h3 className="meta footer__label">Sections</h3>
            <ul>
              <li>
                <a href="#top">Home</a>
              </li>
              {navLinks
                .filter((l) => l.id !== 'contact')
                .map((l) => (
                  <li key={l.id}>
                    <a href={`#${l.id}`}>{l.label}</a>
                  </li>
                ))}
              <li>
                <a href="#propose">Propose an event</a>
              </li>
            </ul>
          </nav>

          <div className="footer__col">
            <h3 className="meta footer__label">Elsewhere</h3>
            <ul>
              {site.social.map((s) =>
                s.url ? (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                      <ArrowUpRight className="footer__ext" />
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </li>
                ) : (
                  <li key={s.label} className="footer__pending">
                    {s.label} <span className="meta">link pending</span>
                  </li>
                ),
              )}
              <li>
                <a href="https://www.acm.org/" target="_blank" rel="noopener noreferrer">
                  acm.org
                  <ArrowUpRight className="footer__ext" />
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="footer__wordmark display" aria-hidden="true">
          ACM <span>Shirpur</span>
        </p>

        <div className="footer__base">
          <p className="footer__signoff meta">
            <Emblem size={28} className="footer__emblem" />
            End of record <span className="footer__dim">/</span> {site.shortCode}{' '}
            <span className="footer__dim">/</span> {site.station}
          </p>
          <p className="footer__legal">
            © {year} {site.fullName}. ACM and the ACM logo are trademarks of the Association for Computing Machinery.
            The diamond seal is this site’s own mark; the official chapter logo appears on the charter card.
          </p>
        </div>
      </div>
    </footer>
  );
}
