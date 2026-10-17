type IconProps = { className?: string };

export function ArrowRight({ className = 'btn__arrow' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M6 14 14.5 5.5M7 5h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

export function Chevron({ className, dir = 'right' }: IconProps & { dir?: 'left' | 'right' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        d={dir === 'right' ? 'M7.5 4 13.5 10 7.5 16' : 'M12.5 4 6.5 10 12.5 16'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Close({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M4.5 4.5 15.5 15.5M15.5 4.5 4.5 15.5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function LinkedIn({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="18" height="18" fill="currentColor" />
      <path
        d="M5 8h2.4v7H5zM6.2 4.5a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8zM9 8h2.3v1c.4-.7 1.3-1.2 2.4-1.2 2 0 2.6 1.3 2.6 3.1V15h-2.4v-3.6c0-.9-.2-1.6-1.1-1.6-1 0-1.4.7-1.4 1.7V15H9z"
        fill="var(--icon-cut, #e9dfc6)"
      />
    </svg>
  );
}

export function Copy({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M7 7h9v9H7zM4 13V4h9" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
