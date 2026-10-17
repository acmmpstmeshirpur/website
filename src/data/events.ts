/**
 * The event archive. Add new events to the top of the list.
 *
 * Photos: put the originals in Assets/Events/<Event>/, add them to
 * scripts/process_images.py, run `npm run images`, then reference the
 * generated base path here (without the "-640.webp" suffix).
 */

export interface EventPhoto {
  /** Base path produced by scripts/process_images.py, e.g. "assets/events/sasverse/overview". */
  src: string;
  alt: string;
  caption: string;
}

export interface EventRecord {
  /** Used for the page anchor, e.g. #ev-002. */
  id: string;
  /** Archive file number shown on the record. */
  fileNo: string;
  title: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  category: string;
  people: { role: string; name: string }[];
  attendance?: string;
  /** One sentence for the records index and the hero console. */
  summary: string;
  description: string[];
  topics: string[];
  photos: EventPhoto[];
}

export const events: EventRecord[] = [
  {
    id: 'ev-002',
    fileNo: 'EV-002',
    title: 'SASVerse',
    date: '2026-10-08',
    category: 'Introductory session',
    people: [{ role: 'Conducted by', name: 'Dr. Praveen Loharkar' }],
    summary: 'An introduction to SAS and its place in data analytics.',
    description: [
      'SASVerse introduced students to SAS (Statistical Analysis System) and its applications in data analytics, statistical analysis and data-driven decision-making. Dr. Praveen Loharkar gave an overview of SAS, its importance in industry, and its relevance to artificial intelligence, machine learning and data science.',
      'The session walked through the SAS ecosystem and its capabilities in data management, statistical computing and business analytics, and stressed the role of analytical tools in solving real-world problems. Students were encouraged to explore career opportunities in data analytics.',
    ],
    topics: ['SAS ecosystem', 'Data management', 'Statistical computing', 'Business analytics', 'Careers in data analytics'],
    photos: [
      {
        src: 'assets/events/sasverse/overview',
        alt: 'Dr. Praveen Loharkar presenting SAS Studio on the classroom display during SASVerse',
        caption: 'Dr. Praveen Loharkar introduces the SAS Studio workspace.',
      },
      {
        src: 'assets/events/sasverse/sas-studio',
        alt: 'SAS Studio open on a laptop screen, showing a plotted data series beside the task settings',
        caption: 'A SAS Studio task producing a plotted series.',
      },
      {
        src: 'assets/events/sasverse/session',
        alt: 'Dr. Praveen Loharkar explaining a slide on the classroom display during SASVerse',
        caption: 'Relating SAS to AI, machine learning and data science.',
      },
    ],
  },
  {
    id: 'ev-001',
    fileNo: 'EV-001',
    title: 'Initial Commit: AI Edition',
    date: '2026-01-29',
    category: 'Technical workshop',
    people: [{ role: 'Conducted by', name: 'Mohammad Saad Nathani' }],
    summary: 'Git and GitHub for version control in AI and ML work.',
    description: [
      'Initial Commit: AI Edition was a technical workshop on Git and GitHub as essential tools for version control in artificial intelligence and machine learning environments.',
      'The workshop set out to bridge the gap between academic programming and industry-level collaborative development, with a focus on AI/ML workflows such as model experimentation, preprocessing pipelines and reproducible research.',
    ],
    topics: ['Git', 'GitHub', 'Version control for AI/ML', 'Model experimentation', 'Preprocessing pipelines', 'Reproducible research'],
    photos: [
      {
        src: 'assets/events/initial-commit/group',
        alt: 'Participants and faculty of Initial Commit: AI Edition standing together in a tiered lecture hall',
        caption: 'Participants and faculty after the workshop.',
      },
      {
        src: 'assets/events/initial-commit/opening-address',
        alt: 'Dr. Praveen Loharkar giving the opening address beside a screen reading Git Commit -m "Initial Commit"',
        caption: 'Introducing ACM at the start of the workshop.',
      },
      {
        src: 'assets/events/initial-commit/session',
        alt: 'A speaker addressing students seated at laptops in a tiered lecture hall',
        caption: 'The workshop in session.',
      },
    ],
  },
];
