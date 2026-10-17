import { useEffect, useState } from 'react';

/**
 * Returns the id of the navigation section currently at the reading line
 * (40% down the viewport), or null when the visitor is above the first one
 * or inside a section that has no navigation link.
 */
export function useActiveSection(ids: readonly string[], extra: readonly string[] = []) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const all = [...ids, ...extra];
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      let currentTop = -Infinity;
      for (const id of all) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line && top > currentTop) {
          current = id;
          currentTop = top;
        }
      }
      setActive(current && ids.includes(current) ? current : null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids, extra]);

  return active;
}
