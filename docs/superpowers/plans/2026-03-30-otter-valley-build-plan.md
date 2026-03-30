# Otter Valley Rod & Gun Club — Build Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium static website for the Otter Valley Rod & Gun Club with Remotion motion graphics, interactive islands, and a heritage brand aesthetic.

**Architecture:** Astro static site generator with vanilla JS interactive islands. Remotion runs as a separate video pipeline rendering MP4s at build time. All dynamic data lives in JSON files. Deployed to Netlify.

**Tech Stack:** Astro 5.x, Remotion 4.x, Vanilla JS, Netlify, OpenWeatherMap API, Google Fonts (Playfair Display + Inter)

**Design Spec:** Read `docs/superpowers/specs/2026-03-30-otter-valley-site-design.md` for the full design decisions, brand identity, and feature list.

**GitHub:** https://github.com/MikeKapin/otter-valley-site

**CRITICAL RULES:**
- Commit after every completed task
- Read the design spec before starting — it has all brand colors, typography, page structure decisions
- Heritage/Classic brand: dark browns (#2d1b00, #3e2723), warm gold (#c9a84c), cream text (#f5e6c8), Playfair Display headings, Inter body
- All pages must be responsive (mobile-first)
- Videos are placeholder Remotion compositions for now — real content comes later
- Use stock images from Unsplash or Pexels for placeholder photos (hunting, shooting sports, outdoor nature, lodge interiors)
- Download existing club images from their WordPress site where available (URLs listed in Task 2)

---

## File Structure

```
otter-valley-site/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── netlify.toml
├── public/
│   ├── favicon.ico
│   ├── videos/                    # Remotion-rendered MP4s go here
│   ├── images/
│   │   ├── club/                  # Downloaded club photos
│   │   ├── stock/                 # Stock placeholder photos
│   │   └── logos/                 # Affiliate logos, club logo
│   └── downloads/                 # PDFs (membership forms, etc.)
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro       # Main layout: head, nav, footer
│   ├── components/
│   │   ├── Header.astro           # Navigation bar
│   │   ├── Footer.astro           # Footer with affiliates, social, newsletter
│   │   ├── HeroVideo.astro        # Full-width video hero section
│   │   ├── DisciplineCard.astro   # Card component for discipline grid
│   │   ├── EventPreview.astro     # Upcoming event card
│   │   ├── WeatherWidget.astro    # Live weather island wrapper
│   │   ├── RangeStatus.astro      # Range status board island wrapper
│   │   ├── Calendar.astro         # Interactive calendar island wrapper
│   │   ├── Gallery.astro          # Photo gallery island wrapper
│   │   ├── ResultsTable.astro     # Sortable results table island wrapper
│   │   ├── FAQ.astro              # Accordion FAQ component
│   │   └── AffiliateBar.astro     # Affiliate logos strip
│   ├── pages/
│   │   ├── index.astro            # Home page
│   │   ├── about.astro            # About / history
│   │   ├── membership.astro       # Membership info + join
│   │   ├── contact.astro          # Contact form + map
│   │   ├── can-am.astro           # CAN-AM flagship event
│   │   ├── events.astro           # Interactive calendar
│   │   ├── results.astro          # Competition results / leaderboards
│   │   ├── gallery.astro          # Photo & video gallery
│   │   ├── facilities.astro       # Ranges & facilities overview
│   │   ├── news.astro             # News & newsletter archive
│   │   ├── affiliates.astro       # Affiliate organizations
│   │   ├── rules.astro            # Rules & safety
│   │   └── disciplines/
│   │       ├── trap.astro
│   │       ├── sporting-clays.astro
│   │       ├── rifle.astro
│   │       ├── handgun.astro
│   │       ├── archery.astro
│   │       └── fishing.astro
│   ├── styles/
│   │   └── global.css             # Global styles, brand tokens, typography
│   ├── scripts/
│   │   ├── weather.js             # Weather widget client-side JS
│   │   ├── range-status.js        # Range status board client-side JS
│   │   ├── calendar.js            # Calendar widget client-side JS
│   │   ├── gallery.js             # Gallery lightbox client-side JS
│   │   ├── results-table.js       # Sortable table client-side JS
│   │   └── nav.js                 # Mobile nav toggle
│   └── data/
│       ├── events.json            # Calendar events data
│       ├── range-status.json      # Range open/closed status
│       ├── gallery.json           # Photo/video metadata
│       ├── newsletters.json       # Newsletter archive metadata
│       ├── disciplines.json       # Discipline metadata (names, slugs, specs)
│       └── results/
│           ├── can-am-2025.json
│           ├── trap-league.json
│           └── championships.json
├── remotion/
│   ├── package.json
│   ├── src/
│   │   ├── Root.tsx               # Remotion entry point
│   │   ├── compositions/
│   │   │   ├── HeroVideo.tsx      # Homepage hero composition
│   │   │   ├── DisciplineIntro.tsx # Reusable discipline title card
│   │   │   ├── FacilityMap.tsx    # Animated facility infographic
│   │   │   ├── WelcomePromo.tsx   # Recruitment promo video
│   │   │   └── TransitionWipe.tsx # Page transition effects
│   │   ├── components/
│   │   │   ├── GoldText.tsx       # Animated gold text component
│   │   │   ├── FilmGrain.tsx      # Film grain overlay
│   │   │   ├── KenBurns.tsx       # Ken Burns photo animation
│   │   │   └── CrosshairWipe.tsx  # Crosshair transition effect
│   │   └── styles/
│   │       └── theme.ts           # Brand tokens for Remotion
│   └── render.mjs                 # Script to render all compositions to MP4
└── docs/
    ├── email-draft-to-emil.md
    └── superpowers/
        ├── specs/
        │   └── 2026-03-30-otter-valley-site-design.md
        └── plans/
            └── 2026-03-30-otter-valley-build-plan.md  # This file
```

---

## Task 1: Project Scaffolding (Astro + Config)

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `netlify.toml`
- Create: `src/styles/global.css`

- [ ] **Step 1: Initialize Astro project**

```bash
cd C:/LocalProjects/apps/otter-valley-site
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

If it asks to overwrite, allow it (only the spec docs and .gitignore exist).

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install @fontsource/playfair-display @fontsource/inter
```

- [ ] **Step 3: Configure Astro**

Update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://otter-valley-preview.netlify.app',
  build: {
    assets: '_assets'
  },
  vite: {
    css: {
      preprocessorOptions: {}
    }
  }
});
```

- [ ] **Step 4: Create netlify.toml**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

- [ ] **Step 5: Create global.css with brand tokens**

Create `src/styles/global.css` with the complete heritage brand system:
- CSS custom properties for all colors: `--brown-dark: #1b0e00`, `--brown-mid: #2d1b00`, `--brown-base: #3e2723`, `--gold: #c9a84c`, `--cream: #f5e6c8`, `--red-cta: #8b0000`
- Typography: Playfair Display for headings (h1-h6), Inter for body
- Base styles: dark brown background, cream text, smooth scrolling
- Utility classes for gold accents, dividers, sections
- Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- Container max-width: 1200px, centered
- Card styles, button styles (gold border with hover fill), form inputs
- Video container styles (full-width, object-fit cover)
- Gold horizontal rule divider class

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project with heritage brand system"
```

---

## Task 2: Download Club Images + Gather Stock Photos

**Files:**
- Create: `public/images/club/` (downloaded photos)
- Create: `public/images/stock/` (placeholder stock photos)
- Create: `public/images/logos/` (affiliate logos)

- [ ] **Step 1: Download existing club photos**

Download these images from the current WordPress site to `public/images/club/`:

```
# Logo
https://ottervalleyrodandgunclub.com/wp-content/uploads/2019/03/logo.jpg

# Homepage carousel
https://ottervalleyrodandgunclub.com/wp-content/uploads/2019/09/PICT0001-e1569540939678-1024x631.jpg
https://ottervalleyrodandgunclub.com/wp-content/uploads/2019/04/2-1024x680.jpg
https://ottervalleyrodandgunclub.com/wp-content/uploads/2019/10/PICT0019a-1024x588.jpg
https://ottervalleyrodandgunclub.com/wp-content/uploads/2019/10/PICT0014-1024x576.jpg
https://ottervalleyrodandgunclub.com/wp-content/uploads/2019/05/20190518_182127-1024x768.jpg

# Rifle range (try full-size by stripping thumbnail suffix)
http://ottervalleyrodandgunclub.com/wp-content/uploads/2025/04/thumbnail_IMG_1401.jpg
http://ottervalleyrodandgunclub.com/wp-content/uploads/2025/04/thumbnail_IMG_1402.jpg
http://ottervalleyrodandgunclub.com/wp-content/uploads/2025/04/thumbnail_IMG_1400.jpg
http://ottervalleyrodandgunclub.com/wp-content/uploads/2025/04/thumbnail_IMG_1403.jpg
http://ottervalleyrodandgunclub.com/wp-content/uploads/2025/04/thumbnail_IMG_1404.jpg
http://ottervalleyrodandgunclub.com/wp-content/uploads/2019/10/PICT0018-1024x432.jpg
http://ottervalleyrodandgunclub.com/wp-content/uploads/2019/10/PICT0024-1024x576.jpg
http://ottervalleyrodandgunclub.com/wp-content/uploads/2019/04/20181014_143154.jpg
http://ottervalleyrodandgunclub.com/wp-content/uploads/2019/04/20190413_120549-e1555184578981-1024x514.jpg

# Handgun range
http://ottervalleyrodandgunclub.com/wp-content/uploads/2019/10/PICT0022-1024x576.jpg
http://ottervalleyrodandgunclub.com/wp-content/uploads/2019/10/20191004_155842-1024x768.jpg

# Archery
http://ottervalleyrodandgunclub.com/wp-content/uploads/2019/10/20191004_155659-1024x768.jpg
http://ottervalleyrodandgunclub.com/wp-content/uploads/2019/10/20191004_155631-1024x768.jpg
http://ottervalleyrodandgunclub.com/wp-content/uploads/2019/04/Archery-Target.jpg
```

Use `curl` to download. Name files descriptively (e.g., `club-logo.jpg`, `rifle-range-01.jpg`, `archery-range-01.jpg`).

- [ ] **Step 2: Source stock placeholder photos**

Find and download 8-10 high-quality stock photos from the web for areas where club photos don't exist. Search for:
- Trap/clay shooting action shots
- Sporting clays course
- Fishing pond / stocked pond
- Clubhouse interior (lodge-style)
- Forested property / Ontario woodland
- Handgun target shooting
- Group of shooters (community vibe)

Save to `public/images/stock/` with descriptive filenames.

- [ ] **Step 3: Download affiliate logos**

Download logos for each affiliate and save to `public/images/logos/`:
- CCFR logo from firearmrights.ca
- NFA Canada logo from nfa.ca
- OFAH logo from ofah.org
- Ontario government / HuntFishOntario branding

If direct logo downloads aren't possible, create clean text-based SVG placeholder logos.

- [ ] **Step 4: Commit**

```bash
git add public/images/
git commit -m "feat: add club photos, stock images, and affiliate logos"
```

---

## Task 3: Base Layout + Header + Footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/AffiliateBar.astro`
- Create: `src/scripts/nav.js`

- [ ] **Step 1: Build BaseLayout.astro**

The main layout wrapping all pages:
- HTML head with meta tags, favicon, Google Fonts links (Playfair Display 400/700, Inter 400/500/600)
- Import `global.css`
- Props: `title` (string), `description` (string, optional)
- Open Graph meta tags using title + description
- Slot for page content between Header and Footer
- Canonical URL

- [ ] **Step 2: Build Header.astro**

Heritage-styled responsive navigation:
- Club logo on left
- Navigation links: Home, About, Disciplines (dropdown), CAN-AM, Events, Membership, News, Contact
- Disciplines dropdown contains: Trap, Sporting Clays, Rifle, Handgun, Archery, Fishing Pond
- Mobile hamburger menu (toggles with nav.js)
- Sticky header with dark brown background, gold accents
- Current page indicator (gold underline)
- "Join the Club" CTA button in nav (gold border, right-aligned)

- [ ] **Step 3: Build Footer.astro**

Rich footer with multiple columns:
- Column 1: Club logo + address (9908 Plank Road, Straffordville, ON) + "No trespassing" notice
- Column 2: Quick links (all main pages)
- Column 3: Disciplines links
- Column 4: Newsletter signup form (Netlify form for now) + social links (Facebook)
- Bottom bar: copyright, "Built with care by Mike Kapin", affiliate logos strip
- Dark brown background, gold accents, cream text

- [ ] **Step 4: Build AffiliateBar.astro**

Horizontal scrolling bar of affiliate logos:
- CCFR, NFA, OFAH, HuntFishOntario
- Each logo links to the organization's website (target="_blank")
- Subtle grayscale filter, full color on hover
- Used in Footer and on the Affiliates page

- [ ] **Step 5: Build nav.js**

Mobile navigation toggle:
- Hamburger button toggles mobile menu visibility
- Close menu when a link is clicked
- Close menu when clicking outside
- Smooth slide-down animation

- [ ] **Step 6: Commit**

```bash
git add src/layouts/ src/components/Header.astro src/components/Footer.astro src/components/AffiliateBar.astro src/scripts/nav.js
git commit -m "feat: add base layout, header with nav, and footer"
```

---

## Task 4: Data Files

**Files:**
- Create: all files in `src/data/`

- [ ] **Step 1: Create disciplines.json**

Metadata for all 6 disciplines:

```json
[
  {
    "name": "Trap Shooting",
    "slug": "trap",
    "tagline": "Four fields. One target. Pure focus.",
    "specs": { "fields": 4, "type": "Trap", "equipment": "Automatic throwers" },
    "hours": "See posted schedule",
    "image": "/images/club/trap-field-01.jpg"
  },
  {
    "name": "Sporting Clays",
    "slug": "sporting-clays",
    "tagline": "10 stations through 50 acres of Ontario woodland.",
    "specs": { "stations": 10, "type": "Sporting Clays", "terrain": "Wooded course" },
    "hours": "See posted schedule",
    "image": "/images/stock/sporting-clays-01.jpg"
  },
  {
    "name": "Rifle",
    "slug": "rifle",
    "tagline": "200 yards of precision.",
    "specs": { "distance": "200 yards", "type": "Outdoor", "positions": "Bench + prone" },
    "hours": "See posted schedule",
    "image": "/images/club/rifle-range-01.jpg"
  },
  {
    "name": "Handgun",
    "slug": "handgun",
    "tagline": "Controlled. Accurate. Disciplined.",
    "specs": { "type": "Pistol range", "distances": "Various" },
    "hours": "See posted schedule",
    "image": "/images/club/handgun-range-01.jpg"
  },
  {
    "name": "Archery",
    "slug": "archery",
    "tagline": "Traditional skill. Modern range.",
    "specs": { "type": "Outdoor range", "features": "3D targets available" },
    "hours": "See posted schedule",
    "image": "/images/club/archery-range-01.jpg"
  },
  {
    "name": "Fishing Pond",
    "slug": "fishing",
    "tagline": "Cast a line. Enjoy the quiet.",
    "specs": { "type": "Stocked pond", "species": "Various" },
    "hours": "Dawn to dusk",
    "image": "/images/stock/fishing-pond-01.jpg"
  }
]
```

- [ ] **Step 2: Create events.json**

Sample events data (populate with realistic Otter Valley events):

```json
[
  {
    "id": "1",
    "title": "CAN-AM Trap Shoot",
    "date": "2026-07-19",
    "endDate": "2026-07-20",
    "category": "competition",
    "discipline": "trap",
    "description": "Annual CAN-AM international trap shooting competition. Open to all registered shooters.",
    "location": "Otter Valley Rod & Gun Club"
  },
  {
    "id": "2",
    "title": "Club Trap Championship",
    "date": "2026-10-18",
    "category": "competition",
    "discipline": "trap",
    "description": "Annual club trap shooting championship. Members only.",
    "location": "Otter Valley Rod & Gun Club"
  },
  {
    "id": "3",
    "title": "Tuesday Night Trap League",
    "date": "2026-04-08",
    "category": "league",
    "discipline": "trap",
    "description": "Weekly trap league. All skill levels welcome.",
    "recurring": "weekly",
    "location": "Otter Valley Rod & Gun Club"
  },
  {
    "id": "4",
    "title": "Spring Work Day",
    "date": "2026-04-26",
    "category": "maintenance",
    "description": "Help prepare the grounds for the season. Lunch provided.",
    "location": "Otter Valley Rod & Gun Club"
  },
  {
    "id": "5",
    "title": "Board Meeting",
    "date": "2026-04-15",
    "category": "meeting",
    "description": "Monthly board of directors meeting. Members welcome to observe.",
    "location": "Clubhouse"
  },
  {
    "id": "6",
    "title": "Annual General Meeting",
    "date": "2026-11-15",
    "category": "meeting",
    "description": "Annual general meeting for all club members. Elections and year-end review.",
    "location": "Clubhouse"
  }
]
```

Add at least 10-12 realistic events spanning April-December 2026.

- [ ] **Step 3: Create range-status.json**

```json
{
  "lastUpdated": "2026-03-30T12:00:00",
  "ranges": [
    { "name": "Rifle Range", "status": "open", "note": "" },
    { "name": "Pistol Range", "status": "open", "note": "" },
    { "name": "Trap Fields", "status": "open", "note": "Fields 1-4 available" },
    { "name": "Sporting Clays", "status": "open", "note": "Full 10-station course" },
    { "name": "Archery Range", "status": "open", "note": "" },
    { "name": "Fishing Pond", "status": "open", "note": "Catch and release" }
  ]
}
```

- [ ] **Step 4: Create gallery.json**

Metadata pointing to the downloaded club photos + stock images. Include fields: `id`, `src`, `alt`, `category` (discipline name, "event", "facility", "community"), `date`, `event` (optional).

Include entries for all downloaded club photos and stock images.

- [ ] **Step 5: Create results JSON files**

Create `src/data/results/can-am-2025.json`, `trap-league.json`, `championships.json` with realistic sample data. Each result entry needs: `rank`, `name`, `score`, `category`/`class` where applicable.

- [ ] **Step 6: Create newsletters.json**

```json
[
  {
    "id": "1",
    "title": "March 2026 Newsletter",
    "date": "2026-03-01",
    "summary": "CAN-AM preparations, spring work day announcement, new range rules.",
    "url": "#"
  },
  {
    "id": "2",
    "title": "February 2026 Newsletter",
    "date": "2026-02-01",
    "summary": "Winter shooting hours, annual meeting recap, membership renewal reminder.",
    "url": "#"
  }
]
```

Add 4-6 sample newsletter entries.

- [ ] **Step 7: Commit**

```bash
git add src/data/
git commit -m "feat: add all data files (events, ranges, gallery, results, newsletters)"
```

---

## Task 5: Home Page

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/components/HeroVideo.astro`
- Create: `src/components/DisciplineCard.astro`
- Create: `src/components/EventPreview.astro`
- Create: `src/components/WeatherWidget.astro`
- Create: `src/components/RangeStatus.astro`
- Create: `src/scripts/weather.js`
- Create: `src/scripts/range-status.js`

- [ ] **Step 1: Build HeroVideo.astro**

Full-viewport hero section:
- Background: `<video>` tag (autoplay, muted, loop, playsinline) — use a placeholder dark gradient with animated gold text for now until Remotion videos are built
- Overlay with club name "Otter Valley Rod & Gun Club" in large Playfair Display
- Tagline: "50 Acres of Tradition. Straffordville, Ontario."
- Subtle scroll indicator at bottom
- Dark gradient overlay on video for text readability
- Props: `videoSrc` (optional), `title`, `tagline`

- [ ] **Step 2: Build DisciplineCard.astro**

Visual card for each discipline:
- Background image with dark overlay
- Discipline name in gold Playfair Display
- Short tagline
- Hover effect: image scales slightly, overlay lightens
- Links to `/disciplines/{slug}/`
- Props: `name`, `slug`, `tagline`, `image`

- [ ] **Step 3: Build EventPreview.astro**

Upcoming event card:
- Date badge on left (month + day, styled prominently)
- Event title, category tag, short description
- "View Details" link
- Props: `title`, `date`, `category`, `description`

- [ ] **Step 4: Build WeatherWidget.astro + weather.js**

Live weather island:
- Astro component renders the container with loading state
- `weather.js` fetches from OpenWeatherMap API on client load
- Display: temperature (Celsius), conditions icon, wind speed + direction, humidity
- Location: Straffordville, Ontario (lat: 42.62, lon: -80.60)
- Fallback message if API fails: "Check local conditions before heading out"
- NOTE: Use a free API key or display static placeholder data. The widget should work with or without an API key (graceful fallback).
- Style: compact card with gold border, brown background

- [ ] **Step 5: Build RangeStatus.astro + range-status.js**

Range status board island:
- Reads from `/data/range-status.json` (fetched client-side)
- Shows each range with colored status indicator: green (open), red (closed), yellow (reserved)
- Displays optional note per range
- "Last updated" timestamp
- Compact grid layout, gold border

- [ ] **Step 6: Build index.astro (Home page)**

Assemble the home page:
1. HeroVideo component (full viewport)
2. "Welcome to Otter Valley" intro section — brief paragraph about the club, 50 acres, Straffordville location
3. Discipline cards grid (2x3 on desktop, 1 column mobile) using data from `disciplines.json`
4. Side-by-side: WeatherWidget + RangeStatus board
5. Upcoming events section (next 3 events from `events.json`, sorted by date)
6. AffiliateBar
7. "Join the Club" CTA section with gold button linking to `/membership/`

- [ ] **Step 7: Test locally**

```bash
npm run dev
```

Verify: home page loads, navigation works, responsive layout at mobile/tablet/desktop. Weather widget shows loading/fallback state.

- [ ] **Step 8: Commit**

```bash
git add src/pages/index.astro src/components/ src/scripts/weather.js src/scripts/range-status.js
git commit -m "feat: build home page with hero, disciplines, weather, range status"
```

---

## Task 6: All 6 Discipline Pages

**Files:**
- Create: `src/pages/disciplines/trap.astro`
- Create: `src/pages/disciplines/sporting-clays.astro`
- Create: `src/pages/disciplines/rifle.astro`
- Create: `src/pages/disciplines/handgun.astro`
- Create: `src/pages/disciplines/archery.astro`
- Create: `src/pages/disciplines/fishing.astro`

- [ ] **Step 1: Create a discipline page template pattern**

Each discipline page follows the same structure:
1. Hero banner with discipline photo + name overlay (HeroVideo component with image fallback)
2. Discipline tagline in gold
3. Facility specs section (table or spec cards showing distances, lanes, equipment, etc.)
4. Hours of operation
5. Rules specific to that discipline (pull from current site content at ottervalleyrodandgunclub.com — scrape each discipline page for the actual rules text)
6. Photo gallery section (filtered from gallery.json by discipline)
7. Related upcoming events (filtered from events.json by discipline)
8. "Back to all disciplines" link + links to other disciplines

- [ ] **Step 2: Build all 6 discipline pages**

Create each page using the template pattern. Pull real content from the existing Otter Valley site:
- **Trap** — mention 4 fields, automatic throwers, league nights
- **Sporting Clays** — 10-station course through wooded property
- **Rifle** — 200-yard outdoor range, bench and prone positions
- **Handgun** — Pistol range details
- **Archery** — Outdoor range with 3D targets
- **Fishing** — Stocked pond, catch and release policies

Scrape each discipline page from the current site for accurate details:
- https://ottervalleyrodandgunclub.com/trap-shooting/ (or similar URL)
- https://ottervalleyrodandgunclub.com/sporting-clays/
- https://ottervalleyrodandgunclub.com/rifle/
- https://ottervalleyrodandgunclub.com/handgun/
- https://ottervalleyrodandgunclub.com/archery/
- https://ottervalleyrodandgunclub.com/fishing-pond/ (or similar)

- [ ] **Step 3: Commit**

```bash
git add src/pages/disciplines/
git commit -m "feat: add all 6 discipline pages with real club content"
```

---

## Task 7: Core Content Pages (About, Membership, Contact, Rules)

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/membership.astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/rules.astro`
- Create: `src/components/FAQ.astro`

- [ ] **Step 1: Build about.astro**

- Hero section with club photo
- Club history section (write compelling narrative — established club, 50 acres near Straffordville, Ontario, promotes responsible sport of firearm and archery shooting)
- Facility overview with photo grid
- Property description (50 acres of forested land)
- Accessibility mention (Trillium Foundation Grant — handicap-accessible features)
- "Join Us" CTA

- [ ] **Step 2: Build FAQ.astro component**

Accordion component:
- Props: array of `{ question: string, answer: string }`
- Click to expand/collapse (vanilla JS, no framework)
- Gold accent on active question
- Smooth height transition animation
- Only one item open at a time

- [ ] **Step 3: Build membership.astro**

- Hero section
- Benefits list (ranges, events, community, voting rights, newsletter)
- Membership categories: Individual, Family, Junior, Senior (use realistic Ontario gun club pricing — e.g., Individual $200/year, Family $275, Junior $50, Senior $150 — mark these as "Contact for current rates")
- FAQ section using FAQ.astro component — common questions about joining, requirements (PAL), probationary period, guest policies
- Downloadable membership application (link to PDF in /downloads/)
- Contact info for membership inquiries (ovrag@hotmail.com)

- [ ] **Step 4: Build contact.astro**

- Netlify form (method="POST", data-netlify="true") with fields: name, email, phone, subject dropdown, message
- Embedded Google Maps iframe (9908 Plank Road, Straffordville, Ontario)
- Driving directions text
- Club mailing address
- Email: ovrag@hotmail.com
- Facebook link
- Hours: "Ranges open — see posted schedule. Clubhouse available for events."

- [ ] **Step 5: Build rules.astro**

- General range rules (scrape from https://ottervalleyrodandgunclub.com/rules-regulations/ for real content)
- Code of conduct
- Guest policies
- Links to discipline-specific rules on each discipline page
- Emergency procedures section
- "No trespassing. No hunting allowed." notice

- [ ] **Step 6: Commit**

```bash
git add src/pages/about.astro src/pages/membership.astro src/pages/contact.astro src/pages/rules.astro src/components/FAQ.astro
git commit -m "feat: add About, Membership, Contact, and Rules pages"
```

---

## Task 8: Events Calendar + CAN-AM Page

**Files:**
- Create: `src/pages/events.astro`
- Create: `src/pages/can-am.astro`
- Create: `src/components/Calendar.astro`
- Create: `src/scripts/calendar.js`

- [ ] **Step 1: Build Calendar.astro + calendar.js**

Interactive calendar island:
- Monthly grid view (default) + list view toggle
- Category filters: competition, league, social, maintenance, meeting (color-coded)
- Events loaded from `/data/events.json` (fetched client-side)
- Click an event to expand details
- "Add to Google Calendar" link per event (generate gcal URL from event data)
- Previous/next month navigation
- Heritage styling: gold highlights on event days, cream text on brown

- [ ] **Step 2: Build events.astro**

- Hero section: "Events & Calendar"
- Calendar component (full-width)
- Below calendar: list of all upcoming events with full details
- Past events archive section (collapsible)

- [ ] **Step 3: Build can-am.astro**

The flagship event page — give this the premium treatment:
- Large hero section with "CAN-AM" title in bold gold
- Event description: what the CAN-AM is, its history, why it matters to the club
- Next event date + registration info section
- Results archive: sortable table showing past year results (from `can-am-2025.json`)
- Photo gallery section (filtered from gallery.json for CAN-AM)
- Placeholder for Remotion highlight reel video
- CTA: "Register for CAN-AM" or "Contact us for details"
- Scrape real CAN-AM info from https://ottervalleyrodandgunclub.com/can-am/

- [ ] **Step 4: Commit**

```bash
git add src/pages/events.astro src/pages/can-am.astro src/components/Calendar.astro src/scripts/calendar.js
git commit -m "feat: add interactive events calendar and CAN-AM flagship page"
```

---

## Task 9: Results, Gallery, News, Affiliates Pages

**Files:**
- Create: `src/pages/results.astro`
- Create: `src/pages/gallery.astro`
- Create: `src/pages/news.astro`
- Create: `src/pages/affiliates.astro`
- Create: `src/pages/facilities.astro`
- Create: `src/components/ResultsTable.astro`
- Create: `src/components/Gallery.astro`
- Create: `src/scripts/results-table.js`
- Create: `src/scripts/gallery.js`

- [ ] **Step 1: Build ResultsTable.astro + results-table.js**

Sortable results table island:
- Click column headers to sort (ascending/descending toggle)
- Props: `dataFile` (path to JSON), `columns` (array of column definitions)
- Heritage styling: gold header row, alternating row shading, cream text
- Responsive: horizontal scroll on mobile

- [ ] **Step 2: Build results.astro**

- Hero section: "Results & Leaderboards"
- Filter tabs: All, CAN-AM, Trap League, Championships
- ResultsTable component for each category
- Season selector dropdown
- Data loaded from `src/data/results/*.json`

- [ ] **Step 3: Build Gallery.astro + gallery.js**

Photo/video gallery island:
- Filterable grid: All, Trap, Sporting Clays, Rifle, Handgun, Archery, Fishing, Events, Facilities
- Lazy-loaded images
- Click to open lightbox (modal overlay with previous/next navigation)
- Close on escape key or click outside
- Video thumbnails play inline on click
- Data from `gallery.json`

- [ ] **Step 4: Build gallery.astro page**

- Hero section: "Gallery"
- Filter bar (horizontal pills)
- Gallery component (masonry-style grid or uniform grid)

- [ ] **Step 5: Build news.astro**

- Hero section: "News & Newsletter"
- Newsletter signup form (Netlify form: name + email)
- Newsletter archive list (from `newsletters.json`) — date, title, summary, download/view link
- Facebook feed embed section (Facebook Page Plugin — use their Facebook page: Otter Valley Rod and Gun Club, Tillsonburg ON)
- Blog-style post area (can be empty for now with "More updates coming soon" placeholder)

- [ ] **Step 6: Build affiliates.astro**

- Hero section: "Our Affiliates & Partners"
- Large card for each affiliate:
  - **CCFR** (firearmrights.ca) — Logo, description: "The Canadian Coalition for Firearm Rights advocates for responsible firearms owners across Canada. Membership includes legal protection, insurance, and a strong voice in Ottawa."
  - **NFA Canada** (nfa.ca) — Logo, description: "Canada's National Firearms Association supports safe firearms activities, self-defense rights, and legislative advocacy. Members receive the Canadian Firearms Journal."
  - **OFAH** (ofah.org) — Logo, description: "The Ontario Federation of Anglers and Hunters is Canada's leading conservation organization, established in 1928. They represent Ontario's anglers, hunters, and outdoor enthusiasts."
  - **HuntFishOntario** (huntandfishontario.com) — Logo, description: "Ontario's official portal for hunting and fishing licences, Outdoors Cards, and regulatory information."
- Each card: logo, name, description, "Visit Website" button (opens in new tab)
- Bottom section: "Interested in partnering with Otter Valley? Contact us."

- [ ] **Step 7: Build facilities.astro**

- Hero section: "Ranges & Facilities"
- Facility overview: indoor clubhouse (kitchen, meeting area), outdoor ranges
- Per-range spec cards (from disciplines.json): name, type, specs, hours
- Range status board (RangeStatus component, same as home page)
- Location section with Google Maps embed
- Placeholder for animated facility map (Remotion video — show empty video container with "Facility map video coming soon" for now)
- Accessibility info (Trillium Foundation Grant)

- [ ] **Step 8: Commit**

```bash
git add src/pages/results.astro src/pages/gallery.astro src/pages/news.astro src/pages/affiliates.astro src/pages/facilities.astro src/components/ResultsTable.astro src/components/Gallery.astro src/scripts/results-table.js src/scripts/gallery.js
git commit -m "feat: add Results, Gallery, News, Affiliates, and Facilities pages"
```

---

## Task 10: Remotion Video Pipeline Setup

**Files:**
- Create: `remotion/package.json`
- Create: `remotion/src/Root.tsx`
- Create: `remotion/src/styles/theme.ts`
- Create: `remotion/src/components/GoldText.tsx`
- Create: `remotion/src/components/FilmGrain.tsx`
- Create: `remotion/src/components/KenBurns.tsx`
- Create: `remotion/src/compositions/HeroVideo.tsx`
- Create: `remotion/src/compositions/DisciplineIntro.tsx`
- Create: `remotion/render.mjs`

- [ ] **Step 1: Initialize Remotion project**

```bash
cd C:/LocalProjects/apps/otter-valley-site
mkdir -p remotion/src/compositions remotion/src/components remotion/src/styles
cd remotion
npm init -y
npm install remotion @remotion/cli @remotion/renderer react react-dom
npm install -D @types/react typescript
```

- [ ] **Step 2: Create theme.ts**

Brand tokens for Remotion compositions:

```typescript
export const theme = {
  colors: {
    brownDark: '#1b0e00',
    brownMid: '#2d1b00',
    brownBase: '#3e2723',
    gold: '#c9a84c',
    cream: '#f5e6c8',
    redCta: '#8b0000',
  },
  fonts: {
    heading: 'Playfair Display, Georgia, serif',
    body: 'Inter, system-ui, sans-serif',
  },
} as const;
```

- [ ] **Step 3: Build reusable Remotion components**

**GoldText.tsx** — Animated gold text with fade-in + slide-up:
- Props: `text`, `fontSize`, `delay` (in frames)
- Uses `interpolate()` for opacity and translateY
- Playfair Display font, gold color

**FilmGrain.tsx** — Subtle animated grain overlay:
- Semi-transparent noise pattern
- Animates across frames for movement
- Low opacity (0.03-0.05) for subtle heritage feel

**KenBurns.tsx** — Slow zoom + pan on a photo:
- Props: `src` (image URL), `direction` ("in" | "out"), `duration` (frames)
- Uses `interpolate()` for scale and translateX/Y
- Smooth easing

- [ ] **Step 4: Build HeroVideo composition**

Homepage hero video (10 seconds, 30fps = 300 frames):
1. Frames 0-90: Fade from black, "Otter Valley" text animates in (GoldText)
2. Frames 60-150: "Rod & Gun Club" subtitle appears below
3. Frames 120-210: Ken Burns on a club photo (use one of the downloaded images)
4. Frames 180-270: "50 Acres of Tradition" tagline fades in
5. Frames 240-300: "Straffordville, Ontario" + subtle film grain throughout
- Background: dark brown gradient
- All text in gold/cream

- [ ] **Step 5: Build DisciplineIntro composition**

Reusable title card (5 seconds, 30fps = 150 frames):
- Props: `disciplineName`, `tagline`, `backgroundImage`
- Frames 0-45: Background image with Ken Burns effect
- Frames 30-90: Discipline name slides in from left (GoldText)
- Frames 60-120: Tagline fades in below
- Frames 120-150: Hold
- Gold divider line animates width from 0 to 100px
- Film grain overlay throughout

- [ ] **Step 6: Build Root.tsx with all compositions registered**

Register compositions:
- `HeroVideo` — 1920x1080, 300 frames, 30fps
- `DisciplineIntro-Trap` through `DisciplineIntro-Fishing` — 1920x1080, 150 frames each
- Use `<Composition>` components with proper IDs

- [ ] **Step 7: Build render.mjs script**

Script that renders all compositions to `/public/videos/`:

```javascript
// Renders all registered compositions to MP4
// Run with: node remotion/render.mjs
```

Uses `@remotion/renderer` `bundle()` + `renderMedia()` for each composition.
Output files: `hero-main.mp4`, `intro-trap.mp4`, `intro-sporting-clays.mp4`, etc.

- [ ] **Step 8: Render the videos**

```bash
cd C:/LocalProjects/apps/otter-valley-site/remotion
npx remotion render src/Root.tsx HeroVideo ../public/videos/hero-main.mp4
```

Render at least the HeroVideo and 1-2 DisciplineIntro videos to verify the pipeline works. The rest can be rendered incrementally.

If Remotion rendering fails or takes too long, skip rendering for now and leave video placeholders. The compositions themselves are the important deliverable — rendering can happen separately.

- [ ] **Step 9: Update HeroVideo.astro to use the rendered MP4**

If the video was rendered successfully, update the home page HeroVideo component to point to `/videos/hero-main.mp4`.

- [ ] **Step 10: Commit**

```bash
git add remotion/ public/videos/
git commit -m "feat: add Remotion video pipeline with hero and discipline intro compositions"
```

---

## Task 11: Polish, Responsive Testing, and Final Build

- [ ] **Step 1: Responsive audit**

Run `npm run dev` and check every page at:
- Mobile (375px width)
- Tablet (768px)
- Desktop (1280px)

Fix any layout issues: overlapping text, broken grids, images overflowing, nav not collapsing.

- [ ] **Step 2: Performance check**

- Ensure all images have `width` and `height` attributes (or use Astro's `<Image>` component)
- Verify lazy loading on gallery images
- Check that video elements have `preload="metadata"` (not preloading full video)
- Verify no JS is shipped on pages that don't need it (pure static pages)

- [ ] **Step 3: SEO basics**

- Every page has unique `<title>` and `<meta name="description">`
- Open Graph tags on all pages (title, description, image)
- Semantic HTML: proper heading hierarchy (h1 → h2 → h3), nav, main, article, section, footer
- Alt text on all images

- [ ] **Step 4: Build and verify**

```bash
cd C:/LocalProjects/apps/otter-valley-site
npm run build
npx serve dist
```

Browse the built site and verify all pages, links, and functionality work.

- [ ] **Step 5: Final commit and push**

```bash
git add -A
git commit -m "feat: responsive polish, SEO, and production build verification"
git push origin master
```

---

## Task 12: Deploy to Netlify Staging

- [ ] **Step 1: Create Netlify site**

```bash
netlify sites:create --name otter-valley-preview
```

Or use the Netlify CLI / API with the token from secrets MCP.

- [ ] **Step 2: Deploy**

```bash
cd C:/LocalProjects/apps/otter-valley-site
npm run build
netlify deploy --prod --no-build --dir=dist --site=<site-id> --auth=<netlify-token>
```

Get the Netlify token from secrets MCP: `netlify.token`

- [ ] **Step 3: Verify live site**

Open https://otter-valley-preview.netlify.app and verify:
- All pages load
- Navigation works
- Images display
- Weather widget attempts to load
- Range status board shows data
- Calendar renders events
- Contact form submits (Netlify form)
- Responsive on mobile

- [ ] **Step 4: Final commit with site URL**

```bash
git add -A
git commit -m "chore: deploy to Netlify staging at otter-valley-preview.netlify.app"
git push origin master
```

---

## Completion Checklist

When done, verify:
- [ ] All 18 pages exist and have content
- [ ] Navigation links all work (no broken links)
- [ ] Heritage brand is consistent (browns, golds, Playfair Display headings, Inter body)
- [ ] Mobile responsive on all pages
- [ ] Weather widget renders (with fallback)
- [ ] Range status board renders
- [ ] Events calendar is interactive (month navigation, category filters)
- [ ] Gallery lightbox works
- [ ] Results tables are sortable
- [ ] CAN-AM page has results data
- [ ] Contact form submits via Netlify
- [ ] Affiliate links open in new tabs
- [ ] At least 1 Remotion video renders and plays on the home page
- [ ] Site is deployed to Netlify staging URL
- [ ] All changes pushed to GitHub
