import { site } from '../../data/site';
import { events } from '../../data/events';
import { team } from '../../data/team';
import { membershipHref, proposalHref } from '../../utils/mailto';
import { formatDate } from '../../utils/images';
import { ArrowRight } from '../shared/Icons';
import Console from './Console';
import './Hero.css';

export default function Hero() {
  const status = [
    { label: 'Chartered', value: formatDate(site.charteredOn) },
    { label: 'Members', value: site.memberCount },
    { label: 'Records on file', value: `${events.length} events` },
    { label: 'Office bearers', value: String(team.length) },
    { label: 'Station', value: site.station },
  ];

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__h1">
            <span className="hero__ident">
              {site.chapterName} <span className="hero__ident-sep">—</span>{' '}
              <span className="hero__ident-place">{site.institution}</span>
            </span>
            <span className="hero__title display">Commit to computing.</span>
          </h1>
          <p className="hero__lead lead">
            Hands-on workshops, expert sessions and a community for students who want to take computing beyond the
            syllabus. A student chapter of the Association for Computing Machinery.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--primary" href={membershipHref}>
              Want to Become a Member?
              <ArrowRight />
            </a>
            <a className="btn btn--ghost" href={proposalHref}>
              Have an Event Idea?
            </a>
          </div>
          <p className="hero__hint">Both buttons open a pre-filled email in your mail app.</p>
        </div>

        <Console />
      </div>

      <div className="wrap">
        <dl className="hero__status">
          {status.map((s) => (
            <div key={s.label} className="hero__status-cell">
              <dt className="meta">{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
