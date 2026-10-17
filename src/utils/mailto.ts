import { emailTemplates, site } from '../data/site';

/**
 * Builds a mailto: link with an encoded subject and body.
 * Line breaks are sent as CRLF (%0D%0A), which every mail client accepts.
 */
export function buildMailto(to: string, subject: string, body: string): string {
  const params = [
    `subject=${encodeURIComponent(subject)}`,
    `body=${encodeURIComponent(body.replace(/\r?\n/g, '\r\n'))}`,
  ];
  return `mailto:${to}?${params.join('&')}`;
}

/** Pre-filled draft for the "Want to Become a Member?" buttons. */
export const membershipHref = buildMailto(site.email, emailTemplates.membership.subject, emailTemplates.membership.body);

/** Pre-filled draft for the "Have an Event Idea?" buttons. */
export const proposalHref = buildMailto(
  site.email,
  emailTemplates.eventProposal.subject,
  emailTemplates.eventProposal.body,
);
