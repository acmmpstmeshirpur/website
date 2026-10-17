import { useState } from 'react';
import { events } from '../../data/events';
import { site } from '../../data/site';
import { formatDate } from '../../utils/images';

interface LogEntry {
  key: string;
  code: string;
  date: string | null;
  title: string;
  lines: string[];
  href: string;
  action: string;
  pending?: boolean;
}

/**
 * The records console: the chapter's history printed as a commit log.
 * Each line is a real link; hovering or focusing it shows the record's details
 * in the readout below.
 */
export default function Console() {
  const entries: LogEntry[] = [
    {
      key: 'pending',
      code: 'PENDING',
      date: null,
      title: 'Your event idea',
      lines: ['Branch open for proposals', 'Workshops, talks, sessions: pitch one to the chapter.'],
      href: '#propose',
      action: 'Draft a proposal',
      pending: true,
    },
    ...events.map((e) => ({
      key: e.id,
      code: e.fileNo,
      date: e.date,
      title: e.title,
      lines: [
        [e.category, ...e.people.map((p) => `${p.role} ${p.name}`)].join(' · '),
        e.attendance ? `${e.summary} ${e.attendance}.` : e.summary,
      ],
      href: `#${e.id}`,
      action: 'Open case file',
    })),
    {
      key: 'charter',
      code: 'CHARTER',
      date: site.charteredOn,
      title: 'Chapter chartered',
      lines: [
        'Certificate of Charter · Association for Computing Machinery',
        'Presented to the MPSTME Shirpur ACM Student Chapter.',
      ],
      href: '#about',
      action: 'Read the charter',
    },
  ];

  const [selected, setSelected] = useState(entries[1]?.key ?? entries[0].key);
  const current = entries.find((e) => e.key === selected) ?? entries[0];

  return (
    <div className="console" aria-labelledby="console-title">
      <div className="console__head">
        <p id="console-title" className="meta">
          Records console <span className="console__unit">Unit {site.shortCode}</span>
        </p>
        <p className="console__lamps" aria-hidden="true">
          <span className="lamp lamp--green" />
          <span className="lamp lamp--pulse" />
          <span className="lamp lamp--off" />
        </p>
      </div>

      <div className="console__screen">
        <p className="console__prompt">
          <span className="console__caret">$</span> git log --chapter --graph
        </p>

        <ol className="console__log">
          {entries.map((entry, i) => (
            <li
              key={entry.key}
              className={`console__row${entry.pending ? ' console__row--pending' : ''}`}
              style={{ ['--row' as string]: i }}
            >
              <a
                href={entry.href}
                className="console__entry"
                data-selected={entry.key === selected ? '' : undefined}
                onMouseEnter={() => setSelected(entry.key)}
                onFocus={() => setSelected(entry.key)}
              >
                <span className="console__node" aria-hidden="true" />
                <span className="console__code">{entry.code}</span>
                <span className="console__date">{entry.date ? formatDate(entry.date, 'stamp') : '--.--.----'}</span>
                <span className="console__title">{entry.title}</span>
              </a>
            </li>
          ))}
        </ol>

        <div className="console__readout" key={current.key}>
          <p className="console__readout-title">&gt; {current.title}</p>
          {current.lines.map((line) => (
            <p key={line} className="console__readout-line">
              {line}
            </p>
          ))}
          <a className="console__readout-action" href={current.href} tabIndex={-1} aria-hidden="true">
            {current.action} <span aria-hidden="true">↵</span>
          </a>
        </div>
      </div>

      <div className="console__foot" aria-hidden="true">
        <span className="meta">Select a record to open its file</span>
        <svg className="console__vent" viewBox="0 0 120 16">
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={i * 12} y="0" width="6" height="16" />
          ))}
        </svg>
      </div>
    </div>
  );
}
