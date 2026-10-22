# ACM Student Chapter — MPSTME, Shirpur

The chapter website, live at https://mpstmeshirpur.acm.org. Two static pages built with
React, Vite and TypeScript (the scrolling home page and `upcoming.html`), plus a small
PHP admin page for upcoming events. It runs on standard cPanel shared hosting with no
database or Node.js process.

- **Design file (Figma):** https://www.figma.com/design/I71NU7dKD17i6MRPGYDA28 (colour tokens, type specimens, button components, section plan)
- **Contact address used by the site:** `contact@mpstmeshirpur.acm.org` (set in `src/data/site.ts`)

---

## Quick reference

| Task | Command |
| --- | --- |
| Install dependencies (first time) | `npm install` |
| Run locally at http://localhost:5173 | `npm run dev` |
| Build for upload | `npm run build` → output in `dist/` |
| Pack the build for cPanel | `npm run zip` → `acm-site-upload.zip` |
| Preview the build locally | `npm run preview` |
| Re-generate photos after adding new ones | `npm run images` (needs Python 3 + Pillow: `pip install Pillow`) |

Requires Node.js 18 or newer.

---

## Project layout

```text
Assets/                      Original photos, logo and documents. Local only: not in Git
                             (full resolution, may hold location data). Keep a copy safe.
scripts/process_images.py    Turns Assets/ photos into web-sized WebP files
public/
  assets/events/…            Generated event photos (640/1280/1920 px)
  assets/team/…              Generated portraits (400/800 px, 4:5 crop)
  assets/brand/…             Official chapter logo
  .htaccess                  Apache settings copied into the build
  admin/index.php            Upcoming-events admin (PHP, password-protected on the server)
  seal-v3.svg/png, favicon.ico  Tab icons (the chapter seal)
  og-image.jpg               Social-share image
src/
  data/site.ts               Chapter name, email, social links, email templates
  data/events.ts             Event archive
  data/upcoming.ts           Loads upcoming events from data/upcoming.json on the server
  data/team.ts               Office bearers and LinkedIn links
  data/image-manifest.json   Written by the image script (do not edit by hand)
  components/…               One folder per section (Navbar, Hero, About, Events, Team,
                             Membership, EventProposal, Footer) plus shared pieces
  styles/tokens.css          Colours, type sizes, spacing, motion curves
  styles/globals.css         Base styles, buttons, labels, reveal animation
  utils/mailto.ts            Builds the two pre-filled email links
```

---

## Updating the site

### Add a LinkedIn profile

Open `src/data/team.ts` and replace `null` with the full profile URL:

```ts
{
  name: 'Reshma Patil',
  role: 'Secretary',
  image: 'assets/team/reshma-patil',
  linkedin: 'https://www.linkedin.com/in/username/',
},
```

While a value is `null`, the site shows "Profile link pending" instead of a link. Rebuild and upload afterwards.

### Change an office bearer

1. Put the photo in `Assets/office bearers/`.
2. Add a line to the `TEAM` list in `scripts/process_images.py`:
   `("New Person_Role.jpg", "new-person", 0.5, 0.45, 1.0)`
   The three numbers are the focus point (x, y from 0 to 1) and how tightly to crop (1.0 is the widest 4:5 crop).
3. Run `npm run images`.
4. Edit the entry in `src/data/team.ts`. The first two entries are shown larger (currently the Faculty Sponsor and the Chair).

### Add an event

1. Put the photos in `Assets/Events/<Event name>/`.
2. Add the event to the `EVENTS` dictionary in `scripts/process_images.py`. For each photo give a source path, an output name and an optional crop box `(left, top, right, bottom)` in pixels.
3. Run `npm run images`.
4. Add a record at the **top** of the list in `src/data/events.ts` (newest first). Give it the next file number (`EV-003`) and an `id` (`ev-003`). Write alt text that describes what is in each photo.

The records index, the case file, the hero console and the "records on file" count all update from that one entry.

### Social links, certificate link, email address, email templates

All of these are in `src/data/site.ts`. The chapter is on LinkedIn and GitHub only; add another entry to `social`
with a full `https://` address if that changes. `charterCertificateUrl` points to the public copy of the
Certificate of Charter, linked from the About section and the footer.

---

## Deploying to cPanel

### Automatic (GitHub Actions)

Every push to `main` on https://github.com/acmmpstmeshirpur/website builds the site and
uploads it to `public_html` over FTPS (`.github/workflows/deploy.yml`). Progress and errors
show under the repository's **Actions** tab; a deploy takes about a minute. It can also be
run by hand there with **Run workflow**.

One-time setup:

1. cPanel → **FTP Accounts** → create an account (e.g. `deploy`) with **Directory** set to
   exactly `public_html`.
2. cPanel → FTP Accounts → that account → **Configure FTP Client**: note the FTP server name.
3. GitHub → repository **Settings → Secrets and variables → Actions** → add
   `FTP_SERVER`, `FTP_USERNAME` (the full `deploy@…` name) and `FTP_PASSWORD`.

The deploy only uploads or removes files that come from the build, so the events saved by
the admin page and the admin password stay put. The manual steps below still work.

### Manual

#### 1. Set the site address (once)

Edit `.env.production` and set the public address, without a trailing slash:

```
VITE_SITE_URL=https://your-domain.example
```

This fills in the canonical URL and social-share image, and adds `sitemap.xml` and `robots.txt` to the build. If you leave it empty the site still works, but link previews on WhatsApp, LinkedIn and similar apps may not show the image.

#### 2. Build and pack

```bash
npm run build
npm run zip
```

`acm-site-upload.zip` now holds everything in `dist/`. Use this script rather than Windows' own zip: it writes forward-slash paths and 0644/0755 permissions, without which cPanel extracts broken or world-writable files.

#### 3. Upload

1. Log in to cPanel and open **File Manager**.
2. Go to `public_html` (or the document root of the domain or sub-domain you want to use). The site uses relative paths, so it also works inside a sub-folder such as `public_html/acm/`.
3. Back up anything already there.
4. Upload `acm-site-upload.zip`, right-click it, **Extract** into the same folder, then delete the zip.
5. Turn on **Settings → Show Hidden Files** in File Manager and check that `.htaccess` is there.

#### 4. Domain and HTTPS

- For a sub-domain (for example `acm.yourcollege.edu`), create it under **Domains** in cPanel and note its document root. Upload into that folder.
- Under **SSL/TLS Status**, run AutoSSL so the domain gets a certificate.
- HTTPS is enforced by `public/.htaccess` (every `http://` request is redirected).

#### 5. Check the live site

- The page loads over `https://` with no browser warnings.
- Photos and portraits appear, and the condensed headline font loads.
- **Want to Become a Member?** opens your mail app with the subject *ACM Student Chapter - Membership Inquiry*.
- **Have an Event Idea?** opens a draft with the subject *ACM Student Chapter - Event Proposal*.
- The menu works on a phone, and every section link scrolls to the right place.
- Clicking an event photo opens the viewer; the arrow keys and Escape work.

To update the live site later: make the change, run `npm run build` and `npm run zip`, and extract the new zip over the old files. Remove old files from `static/` if you want to keep things tidy (they have hashed names, so stale ones are harmless). A redeploy never touches `data/upcoming.json` or the admin password.

---

## The two addresses

Both addresses serve the same `public_html` folder; rules in `public/.htaccess` tell them apart.

| Address | What it does |
| --- | --- |
| `https://mpstmeshirpur.acm.org` (and `www.`) | The public website. `/admin` returns "not found" here. |
| `https://mpstmeshirpur.hosting.acm.org` | For the committee: the front page opens cPanel, `/admin/` is the events admin, any other page is sent to the public site. |

## Upcoming events and the admin page

Upcoming events are not in the code. Committee members manage them at
`https://mpstmeshirpur.hosting.acm.org/admin/`, which saves them to `public_html/data/upcoming.json`.
`upcoming.html` reads that file on every visit, so changes are live immediately and past
events drop off by themselves.

- **Sign-in** is cPanel's Directory Privacy on `public_html/admin`. Add or remove admins
  there (**Create User**). The admin page refuses to run if the folder is not protected.
- **Fields:** event name, date, what will happen, and a registration form link (`https://`).
- **Backups:** download `public_html/data/upcoming.json` from File Manager.
- Locally (`npm run dev`) there is no data file, so the page shows "Nothing is scheduled".

---

## Hosting assessment

Everything except the admin page is static, and all of it runs on cPanel without changes:

| Feature | How it works | Server needed? |
| --- | --- | --- |
| Pages, photos, fonts | Static files from the Vite build, fonts self-hosted | No |
| Membership and event-proposal buttons | `mailto:` links with an encoded subject and body | No |
| Photo viewer, records console, mobile menu | Client-side React | No |
| Sitemap, robots.txt | Generated at build time | No |
| Upcoming-events admin | One PHP file writing a JSON file (PHP 7.4+) | PHP only |

The Oracle Cloud instance is not needed. It would only be worth it for features such as a form that stores submissions or sends email from the server, which this site does not use.

---

## Design notes

**Direction.** A modern archive for a retro-futuristic computing institution: the chapter's real records presented as institutional paperwork. The ACM Certificate of Charter becomes three articles, events are case files with a records index, office bearers are a personnel directory, and the two calls to action are printed requisition forms that preview the exact email draft. The hero's records console prints the chapter's real history as a `git log` (a nod to the first event, *Initial Commit*). Hover or focus a line to read the record, select it to jump to it.

**Type.** Big Shoulders Display (condensed industrial headings), IBM Plex Sans (text), IBM Plex Mono (file numbers, dates and record fields only). All three are self-hosted through Fontsource; nothing loads from a third-party CDN.

**Colour.** Charcoal `#171C1B`, olive `#292F27`, aged paper `#E9DFC6`, cream ink `#E8DCC0`, amber `#E6A34A`, burnt orange `#C66B3D`, vintage green `#93A28A`. Two tokens were adjusted from the brief's suggestions for WCAG AA contrast (green on olive, burnt orange on paper). An automated check found no text below AA.

**Retro effects.** The only scanlines on the site sit inside the console screen, at about 2% opacity. There is no flicker, glitch, chromatic aberration or blur. One amber lamp breathes slowly. The rubber-stamp dates and form facsimiles carry the period feel.

**Motion.** Sections rise into place once, staggered (transform and opacity only). Event photos unroll like a file being opened. Hover states on links, buttons and portraits. With `prefers-reduced-motion`, all movement, the lamp and smooth scrolling switch off, and content still appears.

**Logo.** The navigation seal ("Beacon") is this site's own mark: nested diamonds stepping in to an amber ACM diamond with "acm" lettered in the centre, drawn in the site palette (`src/components/shared/Emblem.tsx`, with the same drawing in `public/seal-v3.svg`; PNG and ICO copies are rendered from it). If you change it, give the icon files a new name so browsers drop their cached tab icon. The official navy chapter logo (`Assets/Logo/acm.png`) appears on the charter card in the About section, and the footer notes the difference.

**Project skills applied.** `design-taste-frontend` (subject inventory, idea-first direction, real browser inspector, screenshot critique loop), `impeccable` (craft floor: contrast, themed selection, focus and scrollbar, states), `animate` / `emil-design-eng` (curves, durations, reduced motion, no `transition: all`), `industrial-brutalist-ui` (technical framing, square corners). Some of the taste skill's house bans (monospace labels, file identifiers, thin rules, more than two typefaces) conflict with this brief, which asks for archival labels, serial numbers, technical borders and three type roles. Those were kept deliberately, as the brief takes priority.

---

## Content notes

- Event details come from `Assets/Events/*/Details.txt`. Dates and topics are as written there. At the chapter's request, Initial Commit lists Mohammad Saad Nathani as conducting the workshop and does not show attendance or the opening address.
- The SASVerse photos had a "GPS Map Camera" location stamp across the bottom third. The web versions are cropped above it. The originals in `Assets/` are untouched.
- The charter date (27 October 2025) comes from the ACM Certificate of Charter PDF.
- Names come from the photo filenames, with standard capitalisation ("RESHMA PATIL" is shown as "Reshma Patil"; "Dr Praveen Kumar Loharkar" as "Dr. Praveen Kumar Loharkar"). The Vice Chair's file was named `.dng` but is actually a JPEG and converted normally.
- The hero strip's member count (50+) and station (MPTP Shirpur) are set in `src/data/site.ts` as `memberCount` and `station`.
- LinkedIn profiles come from `links.xlsx`, plus Aditya Agrawal's link supplied separately. All eight office bearers have one.
