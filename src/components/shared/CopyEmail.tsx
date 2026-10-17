import { useEffect, useRef, useState } from 'react';
import { Copy } from './Icons';

/** Copies an address to the clipboard, for visitors without a mail app set up. */
export default function CopyEmail({ email, className = '' }: { email: string; className?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState('copied');
    } catch {
      setState('failed');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2600);
  }

  const label =
    state === 'copied' ? 'Address copied' : state === 'failed' ? `Copy failed: ${email}` : 'Copy email address';

  return (
    <button type="button" className={`copy-email ${className}`} onClick={copy}>
      <Copy className="copy-email__icon" />
      <span aria-live="polite">{label}</span>
    </button>
  );
}
