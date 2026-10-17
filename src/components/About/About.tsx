import { site } from '../../data/site';
import { formatDate } from '../../utils/images';
import DocHead from '../shared/DocHead';
import { ArrowUpRight } from '../shared/Icons';
import './About.css';

const articles = [
  {
    number: 'Article I',
    title: 'The Association',
    text: 'ACM, the Association for Computing Machinery, is the world’s largest educational and scientific computing society. It brings together students, educators, researchers and practitioners through its publications, conferences and a worldwide network of chapters.',
  },
  {
    number: 'Article II',
    title: 'The Chapter',
    text: 'The MPSTME Shirpur ACM Student Chapter is an officially chartered chapter of the Association for Computing Machinery. It is run by students, supported by a faculty sponsor, and gives everyone at MPSTME, Shirpur a local way into ACM’s global computing community.',
  },
  {
    number: 'Article III',
    title: 'The Mandate',
    text: 'To close the gap between academic programming and the way computing is practised in industry, through hands-on workshops, expert sessions and collaborative work that students can carry into their projects and careers.',
  },
];

const activities = [
  {
    title: 'Technical workshops',
    text: 'Hands-on sessions on the tools, languages and platforms used across industry and research.',
  },
  {
    title: 'Talks and expert sessions',
    text: 'Faculty members and guest speakers share what they know about fields, technologies and careers in computing.',
  },
  {
    title: 'Collaboration',
    text: 'Projects, study groups and peer learning that bring students from different branches and years together.',
  },
  {
    title: 'Student development',
    text: 'Room to build skills, discover career paths and connect with ACM’s wider network of chapters, publications and conferences.',
  },
];

export default function About() {
  return (
    <section className="section on-paper about" aria-labelledby="about-title" id="about">
      <div className="wrap">
        <DocHead
          id="about-title"
          title="On the record since 2025."
          fileLines={[`${site.shortCode} / Charter`, formatDate(site.charteredOn, 'stamp')]}
        />

        <div className="about__grid">
          <div className="about__intro">
            <p className="about__statement" data-reveal>
              We are the ACM student chapter at MPSTME, Shirpur: a place to learn the tools and practices real
              computing work runs on, alongside people who care about the same things.
            </p>

            <figure className="charter" data-reveal style={{ ['--i' as string]: 1 }}>
              <div className="charter__top">
                <img
                  className="charter__logo"
                  src="assets/brand/acm-chapter-logo-256.webp"
                  srcSet="assets/brand/acm-chapter-logo-256.webp 256w, assets/brand/acm-chapter-logo-512.webp 512w"
                  sizes="112px"
                  width={256}
                  height={256}
                  alt="Official logo of the ACM Student Chapter, MPSTME Shirpur"
                  loading="lazy"
                />
                <p className="charter__kind meta">Certificate of Charter</p>
              </div>
              <dl className="charter__fields">
                <div>
                  <dt className="meta">Presented to</dt>
                  <dd>{site.fullName}</dd>
                </div>
                <div>
                  <dt className="meta">Issued by</dt>
                  <dd>Association for Computing Machinery</dd>
                </div>
                <div>
                  <dt className="meta">Chartered on</dt>
                  <dd>{formatDate(site.charteredOn)}</dd>
                </div>
              </dl>
              <figcaption className="charter__caption">
                <span>Details as recorded on the chapter’s ACM Certificate of Charter.</span>
                <a
                  className="btn btn--ink charter__view"
                  href={site.charterCertificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View the certificate
                  <ArrowUpRight className="btn__arrow" />
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </figcaption>
            </figure>
          </div>

          <div className="about__articles">
            {articles.map((a, i) => (
              <article key={a.number} className="article" data-reveal style={{ ['--i' as string]: i }}>
                <p className="article__number meta">{a.number}</p>
                <div>
                  <h3 className="article__title display">{a.title}</h3>
                  <p className="article__text">{a.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="activities" data-reveal>
          <h3 className="activities__title display">What the chapter does</h3>
          <ul className="activities__list">
            {activities.map((a) => (
              <li key={a.title} className="activity">
                <h4 className="activity__title">{a.title}</h4>
                <p>{a.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
