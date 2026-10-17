/**
 * The chapter seal ("Beacon"): nested diamonds stepping in to an amber ACM
 * diamond with "acm" lettered in the centre. Drawn in the site palette as this
 * site's own mark; the official chapter logo is shown on the charter card in
 * the About section.
 *
 * Hover motion (nav only) lives in Navbar.css and targets the emblem__ classes.
 * public/seal-v3.svg is the same drawing (used as the tab icon); update both
 * together, and bump the file name so browsers drop their cached icon.
 */
const diamond = (r: number) => `M32 ${32 - r} ${32 + r} 32 32 ${32 + r} ${32 - r} 32Z`;

export default function Emblem({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path className="emblem__ping" d={diamond(30.5)} fill="none" stroke="var(--c-amber)" strokeWidth="1.6" />
      <path d={diamond(30.5)} fill="var(--c-charcoal)" stroke="currentColor" strokeWidth="1.6" />
      <path className="emblem__mid" d={diamond(26)} fill="none" stroke="var(--c-amber)" strokeWidth="1.6" />
      <path className="emblem__core" d={diamond(21.5)} fill="var(--c-amber)" />
      <text
        x="32"
        y="36.4"
        textAnchor="middle"
        fill="var(--c-charcoal)"
        fontFamily="'IBM Plex Sans', Arial, sans-serif"
        fontWeight="600"
        fontSize="13"
        letterSpacing="-0.3"
      >
        acm
      </text>
    </svg>
  );
}
