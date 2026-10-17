/**
 * Site-wide settings. Edit the values here; components read from this file.
 */

export const site = {
  chapterName: 'ACM Student Chapter',
  institution: 'MPSTME, Shirpur',
  fullName: 'MPSTME Shirpur ACM Student Chapter',
  shortCode: 'ACM-SHR',

  /** Contact address used by every email button on the site. */
  email: 'contact@mpstmeshirpur.acm.org',

  /** From the ACM Certificate of Charter. */
  charteredOn: '2025-10-27',

  /** Public view of the Certificate of Charter. */
  charterCertificateUrl: 'https://drive.google.com/file/d/1dCWgMd0JBi9uyY1SfL-BdhNdvPvOfhCg/view?usp=sharing',

  location: 'Shirpur, Maharashtra, India',
  /** Campus name shown as the "Station" in the hero strip and footer. */
  station: 'MPTP Shirpur',

  /** Shown in the hero strip. Update as the chapter grows. */
  memberCount: '50+',

  /**
   * Social profiles. Set `url` to a full https:// address to make the link live;
   * leave it `null` and the site shows the platform as "link pending".
   */
  social: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/acm-mpstme-shirpur-student-chapter' as string | null },
    { label: 'GitHub', url: 'https://github.com/acmmpstmeshirpur' as string | null },
  ],
};

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'events', label: 'Events' },
  { id: 'team', label: 'Team' },
  { id: 'join', label: 'Join ACM' },
  { id: 'contact', label: 'Contact' },
] as const;

/** Email drafts opened by the two call-to-action buttons. */
export const emailTemplates = {
  membership: {
    subject: 'ACM Student Chapter - Membership Inquiry',
    body: `Hello ACM Student Chapter Team,

I am interested in becoming a member of the ACM Student Chapter at MPSTME, Shirpur.

Name:
Course / Branch:
Year of Study:
Contact Number:

I would like to know more about the membership process and upcoming opportunities.

Thank you.`,
  },
  eventProposal: {
    subject: 'ACM Student Chapter - Event Proposal',
    body: `Hello ACM Student Chapter Team,

I would like to propose an event for the ACM Student Chapter.

Name:
Course / Branch:
Year of Study:

Proposed Event Title:
Event Type:
Brief Description:
Expected Audience:
Suggested Speaker / Resource Person (if any):

Additional Details:

Thank you for considering my proposal.`,
  },
};
