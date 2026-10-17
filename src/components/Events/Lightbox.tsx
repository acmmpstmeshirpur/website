import { useEffect, useRef } from 'react';
import type { EventRecord } from '../../data/events';
import Photo from '../shared/Photo';
import { Chevron, Close } from '../shared/Icons';

interface LightboxProps {
  event: EventRecord | null;
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}

/** Full-screen photo viewer built on the native <dialog> element. */
export default function Lightbox({ event, index, onIndex, onClose }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const count = event?.photos.length ?? 0;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (event && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement;
      dialog.showModal();
    } else if (!event && dialog.open) {
      dialog.close();
    }
  }, [event]);

  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onIndex((index + 1) % count);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + count) % count);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [event, index, count, onIndex]);

  const photo = event?.photos[index];

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={event ? `${event.title}: photo ${index + 1} of ${count}` : 'Photo viewer'}
      onClose={() => {
        onClose();
        returnFocus.current?.focus();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {event && photo && (
        <div className="lightbox__inner">
          <div className="lightbox__bar">
            <p className="meta">
              File {event.fileNo} <span className="lightbox__dim">/</span> {event.title}{' '}
              <span className="lightbox__dim">
                / Plate {index + 1} of {count}
              </span>
            </p>
            <button type="button" className="lightbox__btn" onClick={onClose} aria-label="Close photo viewer">
              <Close />
            </button>
          </div>

          <figure className="lightbox__figure">
            <Photo key={photo.src} base={photo.src} alt={photo.alt} sizes="100vw" loading="eager" />
            <figcaption>{photo.caption}</figcaption>
          </figure>

          {count > 1 && (
            <div className="lightbox__nav">
              <button
                type="button"
                className="lightbox__btn"
                onClick={() => onIndex((index - 1 + count) % count)}
                aria-label="Previous photo"
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                className="lightbox__btn"
                onClick={() => onIndex((index + 1) % count)}
                aria-label="Next photo"
              >
                <Chevron />
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
