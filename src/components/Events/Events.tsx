import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { events, type EventRecord } from '../../data/events';
import { site } from '../../data/site';
import { formatDate } from '../../utils/images';
import DocHead from '../shared/DocHead';
import CaseFile from './CaseFile';
import Lightbox from './Lightbox';
import './Events.css';

/** Earlier records listed before the "show older" button. */
const SHOWN_RECORDS = 6;

export default function Events() {
  const [latest, ...older] = events;
  const [viewer, setViewer] = useState<{ event: EventRecord; index: number } | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  // Row to bring into view once it has rendered open: always for a link
  // (#ev-001 from the console or a shared URL; instantly on page load), only
  // if it moved off screen for a click (closing a longer file above shifts it up).
  const pendingScroll = useRef<{ id: string; via: 'load' | 'link' | 'click' } | null>(null);

  useEffect(() => {
    const openFromHash = (via: 'load' | 'link') => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const index = older.findIndex((e) => e.id === id);
      if (index === -1) return;
      if (index >= SHOWN_RECORDS) setShowAll(true);
      setOpenId(id);
      pendingScroll.current = { id, via };
    };
    const onHashChange = () => openFromHash('link');
    openFromHash('load');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
    // `older` comes from static data, so this only needs to run once.
  }, []);

  useLayoutEffect(() => {
    const pending = pendingScroll.current;
    if (!pending || pending.id !== openId) return;
    pendingScroll.current = null;
    const row = document.getElementById(pending.id);
    if (!row) return;
    const offset = parseFloat(getComputedStyle(row).scrollMarginTop) || 0;
    if (pending.via === 'load') {
      row.scrollIntoView({ block: 'start', behavior: 'instant' });
    } else if (pending.via === 'link' || row.getBoundingClientRect().top < offset) {
      row.scrollIntoView({ block: 'start' });
    }
  }, [openId, showAll]);

  const toggle = (id: string) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    if (next) pendingScroll.current = { id: next, via: 'click' };
    // Keep the URL shareable without triggering a jump.
    history.replaceState(null, '', `#${next ?? 'events'}`);
  };

  const listed = showAll ? older : older.slice(0, SHOWN_RECORDS);
  const hidden = older.length - listed.length;

  return (
    <section className="section on-olive events" id="events" aria-labelledby="events-title">
      <div className="wrap">
        <DocHead
          id="events-title"
          title="The event archive."
          fileLines={[`${site.shortCode} / Records`, `${events.length} files on record`]}
        />

        <div className="events__intro">
          <p className="lead" data-reveal>
            Every session the chapter runs is filed here: what it covered, who led it and what it looked like on the
            day.
          </p>
        </div>

        {latest && (
          <div className="events__latest">
            <p className="events__label meta" data-reveal>
              Latest record
            </p>
            <CaseFile event={latest} onOpenPhoto={(index) => setViewer({ event: latest, index })} />
          </div>
        )}

        {older.length > 0 && (
          <div className="events__records">
            <div className="events__records-head" data-reveal>
              <h3 id="records-title" className="events__label meta">
                Earlier records
              </h3>
              <p className="meta">{older.length} on file</p>
            </div>

            <div className="ledger" data-reveal style={{ ['--i' as string]: 1 }}>
              <div className="ledger__head meta" aria-hidden="true">
                <span>File</span>
                <span>Date</span>
                <span>Event</span>
                <span>Type</span>
              </div>

              <ol aria-labelledby="records-title">
                {listed.map((e) => {
                  const open = e.id === openId;
                  const panelId = `${e.id}-file`;
                  return (
                    <li key={e.id} id={e.id} className="ledger__row" data-open={open || undefined}>
                      <button
                        type="button"
                        className="ledger__toggle"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => toggle(e.id)}
                      >
                        <span className="ledger__file meta">{e.fileNo}</span>
                        <span className="ledger__date">
                          <time dateTime={e.date}>{formatDate(e.date, 'stamp')}</time>
                        </span>
                        <span className="ledger__title">{e.title}</span>
                        <span className="ledger__type">{e.category}</span>
                        <svg className="ledger__icon" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M3 10h14" />
                          <path className="ledger__icon-v" d="M10 3v14" />
                        </svg>
                      </button>

                      <div id={panelId} className="ledger__panel" hidden={!open}>
                        {open && (
                          <CaseFile event={e} nested onOpenPhoto={(index) => setViewer({ event: e, index })} />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {hidden > 0 && (
              <button type="button" className="btn btn--ghost events__more" onClick={() => setShowAll(true)}>
                Show {hidden} older {hidden === 1 ? 'record' : 'records'}
              </button>
            )}
          </div>
        )}
      </div>

      <Lightbox
        event={viewer?.event ?? null}
        index={viewer?.index ?? 0}
        onIndex={(index) => setViewer((v) => (v ? { ...v, index } : v))}
        onClose={() => setViewer(null)}
      />
    </section>
  );
}
