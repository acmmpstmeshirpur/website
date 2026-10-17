import { useEffect, useState } from 'react';
import { loadUpcomingEvents, type UpcomingEvent } from '../../data/upcoming';
import { site } from '../../data/site';
import { formatDate } from '../../utils/images';
import { ArrowUpRight } from '../shared/Icons';
import './Upcoming.css';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const pad = (n: number) => String(n).padStart(2, '0');
const isoDay = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

/** The visitor's current month as weeks of day numbers (null pads the edges), Monday first. */
function monthGrid(year: number, month: number) {
  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function weekday(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' });
}

export default function Upcoming() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = isoDay(year, month, now.getDate());
  const monthLabel = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  // null while data/upcoming.json is loading.
  const [events, setEvents] = useState<UpcomingEvent[] | null>(null);

  useEffect(() => {
    let live = true;
    loadUpcomingEvents().then((list) => live && setEvents(list));
    return () => {
      live = false;
    };
  }, []);

  // The list renders after the fetch, so a shared #event link needs a manual jump.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (events && id) document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [events]);

  const upcoming = (events ?? []).filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const byDay = new Map<string, UpcomingEvent[]>();
  for (const e of upcoming) byDay.set(e.date, [...(byDay.get(e.date) ?? []), e]);

  return (
    <section className="section upcoming" aria-labelledby="upcoming-title">
      <div className="wrap">
        <header className="doc-head" data-reveal>
          <h1 id="upcoming-title" className="display h2">
            Upcoming events.
          </h1>
          <p className="doc-head__id meta">
            <span>{site.shortCode} / Schedule</span>
            <span>{events ? `${upcoming.length} scheduled` : 'Loading'}</span>
          </p>
        </header>

        <div className="upcoming__grid">
          <div className="cal" data-reveal style={{ ['--i' as string]: 1 }}>
            <div className="cal__head">
              <h2 className="cal__month display">{monthLabel}</h2>
              {upcoming.some((e) => e.date.startsWith(today.slice(0, 7))) && (
                <p className="cal__key meta">
                  <span className="cal__swatch" aria-hidden="true" /> Event day
                </p>
              )}
            </div>

            <table className="cal__table">
              <caption className="visually-hidden">Calendar for {monthLabel}</caption>
              <thead>
                <tr>
                  {WEEKDAYS.map((d) => (
                    <th key={d} scope="col" className="meta">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthGrid(year, month).map((week, w) => (
                  <tr key={w}>
                    {week.map((day, i) => {
                      if (day === null) return <td key={i} className="cal__day cal__day--empty" />;
                      const iso = isoDay(year, month, day);
                      const onDay = byDay.get(iso);
                      const cls = `cal__day${iso < today ? ' cal__day--past' : ''}${iso === today ? ' cal__day--today' : ''}${onDay ? ' cal__day--event' : ''}`;
                      return (
                        <td key={i} className={cls} aria-current={iso === today ? 'date' : undefined}>
                          {onDay ? (
                            <a href={`#${onDay[0].id}`}>
                              <span>{day}</span>
                              <span className="visually-hidden">: {onDay.map((e) => e.title).join(', ')}</span>
                            </a>
                          ) : (
                            <span>{day}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="upcoming__list" data-reveal style={{ ['--i' as string]: 2 }}>
            {events === null ? (
              <p className="upcoming__empty">Loading events…</p>
            ) : upcoming.length === 0 ? (
              <p className="upcoming__empty">
                Nothing is scheduled right now. New events are posted here as soon as they are confirmed.
              </p>
            ) : (
              <ol>
                {upcoming.map((e) => (
                  <li key={e.id} id={e.id} className="up-item">
                    <p className="up-item__date meta">
                      <time dateTime={e.date}>{formatDate(e.date, 'stamp')}</time>
                      <span className="up-item__sep">/</span>
                      {weekday(e.date)}
                    </p>
                    <h2 className="up-item__title display">{e.title}</h2>
                    <p className="up-item__desc">{e.description}</p>
                    <a className="btn btn--primary up-item__cta" href={e.formUrl} target="_blank" rel="noopener noreferrer">
                      Register
                      <ArrowUpRight className="btn__arrow" />
                      <span className="visually-hidden"> for {e.title} (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
