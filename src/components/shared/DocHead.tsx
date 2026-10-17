import type { ReactNode } from 'react';

interface DocHeadProps {
  id: string;
  title: ReactNode;
  /** Identifier lines shown at the right end of the header rule. */
  fileLines: string[];
  className?: string;
}

/** Section header set like a document header: title left, file identifier right. */
export default function DocHead({ id, title, fileLines, className = '' }: DocHeadProps) {
  return (
    <header className={`doc-head ${className}`} data-reveal>
      <h2 id={id} className="display h2">
        {title}
      </h2>
      <p className="doc-head__id meta">
        {fileLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>
    </header>
  );
}
