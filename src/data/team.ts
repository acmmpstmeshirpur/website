/**
 * Office bearers, in display order. The first two entries are shown larger.
 *
 * To add a LinkedIn profile, replace `null` with the full URL, e.g.
 *   linkedin: 'https://www.linkedin.com/in/username/'
 * While it is `null`, the site shows "Profile link pending" instead of a link.
 *
 * Photos: add the original to Assets/office bearers/, list it in
 * scripts/process_images.py, run `npm run images`, then set `image` to the
 * generated base path (without the "-400.webp" suffix).
 */

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin: string | null;
}

export const team: TeamMember[] = [
  {
    name: 'Dr. Praveen Kumar Loharkar',
    role: 'Faculty Sponsor',
    image: 'assets/team/praveen-kumar-loharkar',
    linkedin: 'https://www.linkedin.com/in/praveenkumarloharkar/',
  },
  {
    name: 'Mohammad Saad Nathani',
    role: 'Chair',
    image: 'assets/team/mohammad-saad-nathani',
    linkedin: 'https://www.linkedin.com/in/saad-nathani/',
  },
  {
    name: 'Shashwat Jain',
    role: 'Vice Chair',
    image: 'assets/team/shashwat-jain',
    linkedin: 'https://www.linkedin.com/in/shashwatjain01/',
  },
  {
    name: 'Reshma Patil',
    role: 'Secretary',
    image: 'assets/team/reshma-patil',
    linkedin: 'https://www.linkedin.com/in/reshma-patil-2392wdsf/',
  },
  {
    name: 'Pranav Mundhra',
    role: 'Treasurer',
    image: 'assets/team/pranav-mundhra',
    linkedin: 'https://www.linkedin.com/in/pranavmundhra/',
  },
  {
    name: 'Anushka Sharma',
    role: 'Executive Advisor',
    image: 'assets/team/anushka-sharma',
    linkedin: 'https://www.linkedin.com/in/anushka-sharma-210495284/',
  },
  {
    name: 'Riddhima Sharma',
    role: 'Membership Chair',
    image: 'assets/team/riddhima-sharma',
    linkedin: 'https://www.linkedin.com/in/riddhima-sharma-204709262/',
  },
  {
    name: 'Aditya Agrawal',
    role: 'Web Master',
    image: 'assets/team/aditya-agrawal',
    linkedin: 'https://www.linkedin.com/in/aditya-agrawal-79a628240/',
  },
];
