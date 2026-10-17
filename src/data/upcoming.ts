/**
 * Upcoming events are managed from the admin page (admin/ on the live site),
 * which saves them to data/upcoming.json next to upcoming.html. The page reads
 * that file on every visit, so changes need no rebuild.
 *
 * The file is not part of the build: deploying a new build never overwrites
 * the events. Locally (npm run dev) there is no file, so the list is empty.
 */

export interface UpcomingEvent {
  /** Used for the page anchor, e.g. upcoming.html#up-python-basics-3f2a. */
  id: string;
  title: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** What will happen, in a sentence or two. */
  description: string;
  /** Registration form, e.g. a Google Form link. */
  formUrl: string;
}

const isEvent = (e: unknown): e is UpcomingEvent => {
  const v = e as Partial<UpcomingEvent> | null;
  return Boolean(
    v &&
      typeof v.id === 'string' &&
      typeof v.title === 'string' &&
      typeof v.date === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(v.date) &&
      typeof v.description === 'string' &&
      typeof v.formUrl === 'string' &&
      /^https:\/\//.test(v.formUrl),
  );
};

/** Fetches the saved events; a missing or broken file counts as no events. */
export async function loadUpcomingEvents(): Promise<UpcomingEvent[]> {
  try {
    const res = await fetch('data/upcoming.json', { cache: 'no-store' });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    return Array.isArray(data) ? data.filter(isEvent) : [];
  } catch {
    return [];
  }
}
