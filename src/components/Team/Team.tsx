import { site } from '../../data/site';
import { team, type TeamMember } from '../../data/team';
import DocHead from '../shared/DocHead';
import Photo from '../shared/Photo';
import { LinkedIn } from '../shared/Icons';
import './Team.css';

function recordNo(i: number) {
  return `PR-${String(i + 1).padStart(2, '0')}`;
}

function ProfileLink({ member }: { member: TeamMember }) {
  if (!member.linkedin) {
    return <span className="person__link person__link--pending meta">Profile link pending</span>;
  }
  return (
    <a className="person__link" href={member.linkedin} target="_blank" rel="noopener noreferrer">
      <LinkedIn className="person__link-icon" />
      LinkedIn
      <span className="visually-hidden"> profile of {member.name} (opens in a new tab)</span>
    </a>
  );
}

function Person({ member, index, featured }: { member: TeamMember; index: number; featured?: boolean }) {
  return (
    <li
      className={`person${featured ? ' person--featured' : ''}`}
      data-reveal
      style={{ ['--i' as string]: featured ? index : index - 2 }}
    >
      <p className="person__strip meta" aria-hidden="true">
        <span>{recordNo(index)}</span>
        <span className="person__leader" />
        <span>{site.shortCode}</span>
      </p>
      <div className="person__frame">
        <Photo
          base={member.image}
          alt={`Portrait of ${member.name}, ${member.role}`}
          sizes={featured ? '(max-width: 640px) 34vw, (max-width: 1000px) 40vw, 330px' : '(max-width: 640px) 34vw, (max-width: 1100px) 30vw, 220px'}
          className="person__img"
        />
      </div>
      <div className="person__details">
        <p className="person__role meta">{member.role}</p>
        <h3 className="person__name display">{member.name}</h3>
        {member.email && (
          <a className="person__email" href={`mailto:${member.email}`}>
            {/* Break after "@" first, so the domain stays on one line. */}
            {member.email.split('@')[0]}@<wbr />
            {member.email.split('@').slice(1).join('@')}
            <span className="visually-hidden"> (email {member.name})</span>
          </a>
        )}
        <ProfileLink member={member} />
      </div>
    </li>
  );
}

export default function Team() {
  const featured = team.slice(0, 2);
  const registry = team.slice(2);

  return (
    <section className="section on-paper team" id="team" aria-labelledby="team-title">
      <div className="wrap">
        <DocHead
          id="team-title"
          title="Personnel directory."
          fileLines={[`${site.shortCode} / Personnel`, `${team.length} office bearers`]}
        />

        <p className="team__intro lead" data-reveal>
          The office bearers who run the chapter, and the faculty sponsor who stands behind it.
        </p>

        <ul className="team__featured">
          {featured.map((m, i) => (
            <Person key={m.name} member={m} index={i} featured />
          ))}
        </ul>

        <ul className="team__registry">
          {registry.map((m, i) => (
            <Person key={m.name} member={m} index={i + featured.length} />
          ))}
        </ul>
      </div>
    </section>
  );
}
