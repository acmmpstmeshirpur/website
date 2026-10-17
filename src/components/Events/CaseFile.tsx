import { useState } from 'react';
import type { EventRecord } from '../../data/events';
import { formatDate, imageSet } from '../../utils/images';
import Photo from '../shared/Photo';

interface CaseFileProps {
  event: EventRecord;
  flip?: boolean;
  /** Opened inside the records ledger: the ledger row already carries the anchor,
      file number and date, and the file mounts after the reveal observer has run. */
  nested?: boolean;
  onOpenPhoto: (index: number) => void;
}

/** One event, presented as an archival case file with a plate viewer. */
export default function CaseFile({ event, flip = false, nested = false, onOpenPhoto }: CaseFileProps) {
  const [active, setActive] = useState(0);
  const photo = event.photos[active];
  const dims = imageSet(photo.src);
  const portrait = Boolean(dims.width && dims.height && dims.height > dims.width);
  const titleId = `${event.id}-title`;
  const reveal = nested ? {} : { 'data-reveal': true };

  return (
    <article
      id={nested ? undefined : event.id}
      className={`case${flip ? ' case--flip' : ''}${nested ? ' case--nested' : ''}`}
      aria-labelledby={titleId}
    >
      {!nested && (
        <header className="case__tab" {...reveal}>
          <p className="meta">
            File {event.fileNo} <span className="case__tab-sep">/</span> {event.category}
          </p>
          <p className="case__stamp meta" aria-label={`Filed ${formatDate(event.date)}`}>
            <span>On record</span>
            <time dateTime={event.date}>{formatDate(event.date, 'stamp')}</time>
          </p>
        </header>
      )}

      <div className="case__grid">
        <div className="case__media" {...reveal} style={{ ['--i' as string]: 1 }}>
          <button
            type="button"
            className={`case__plate${portrait ? ' case__plate--portrait' : ''}`}
            onClick={() => onOpenPhoto(active)}
            aria-label={`Enlarge photo: ${photo.alt}`}
          >
            <Photo
              key={photo.src}
              base={photo.src}
              alt=""
              sizes="(max-width: 1000px) 100vw, 58vw"
              className="case__plate-img"
            />
            <span className="case__enlarge meta" aria-hidden="true">
              Enlarge
            </span>
          </button>

          <div className="case__plate-info">
            <p className="case__caption">
              <span className="meta">
                Plate {active + 1}/{event.photos.length}
              </span>{' '}
              {photo.caption}
            </p>
          </div>

          {event.photos.length > 1 && (
            <ul className="case__strip" aria-label={`Photos from ${event.title}`}>
              {event.photos.map((p, i) => (
                <li key={p.src}>
                  <button
                    type="button"
                    className="case__thumb"
                    aria-pressed={i === active}
                    aria-label={`Show photo ${i + 1}: ${p.caption}`}
                    onClick={() => setActive(i)}
                  >
                    <Photo base={p.src} alt="" sizes="160px" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="case__body" {...reveal} style={{ ['--i' as string]: 2 }}>
          <h3 id={titleId} className="case__title display">
            {event.title}
          </h3>

          <dl className="case__meta">
            <div>
              <dt className="meta">Date</dt>
              <dd>
                <time dateTime={event.date}>{formatDate(event.date)}</time>
              </dd>
            </div>
            <div>
              <dt className="meta">Type</dt>
              <dd>{event.category}</dd>
            </div>
            {event.people.map((p) => (
              <div key={p.role + p.name}>
                <dt className="meta">{p.role}</dt>
                <dd>{p.name}</dd>
              </div>
            ))}
            {event.attendance && (
              <div>
                <dt className="meta">Attendance</dt>
                <dd>{event.attendance}</dd>
              </div>
            )}
          </dl>

          <div className="case__desc prose">
            {event.description.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>

          <div className="case__topics">
            <p className="meta">Covered</p>
            <ul>
              {event.topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
