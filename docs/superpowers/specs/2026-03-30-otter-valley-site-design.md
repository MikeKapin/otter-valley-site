# Otter Valley Rod & Gun Club — Website Redesign Spec

**Date:** 2026-03-30
**Author:** Mike Kapin (volunteer web/newsletter coordinator)
**Status:** Approved — ready for implementation planning

---

## 1. Project Overview

Rebuild the Otter Valley Rod & Gun Club website from scratch, replacing the existing WordPress/Sydney theme site at ottervalleyrodandgunclub.com. The new site will be a premium static site with Remotion-rendered motion graphics videos, interactive features, and a heritage aesthetic that positions Otter Valley as a top-tier club in Ontario.

**Goals:**
- Recruit new members with a compelling first impression (hero video, facility showcase)
- Serve existing members (calendar, range status, results, newsletter)
- Build the club's reputation (CAN-AM coverage, gallery, affiliate partnerships)

**Maintainer:** Mike Kapin — sole maintainer via Claude Code. No CMS needed.

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Site generator | **Astro** | Zero-JS static pages by default, islands for interactivity |
| Video pipeline | **Remotion** | React-based MP4 rendering at build time |
| Hosting | **Netlify** | Free tier, forms, staging URLs, one-click deploy |
| Interactive islands | **Vanilla JS** (or Preact if needed) | Calendar, weather, gallery, range status |
| Newsletter | **Mailchimp or Buttondown** (free tier) | Email signup + archive |
| Weather API | **OpenWeatherMap** (free tier) | Live conditions at Straffordville |
| Source control | **GitHub** | MikeKapin/otter-valley-site |

---

## 3. Brand Identity

**Style:** Heritage / Classic — warm, trustworthy, established
**Palette:**
- Background: Dark browns (`#2d1b00`, `#3e2723`, `#1b0e00`)
- Accent: Warm gold (`#c9a84c`)
- Text: Cream (`#f5e6c8`), light gray for secondary
- Highlight: Deep red for CTAs and alerts

**Typography:**
- Headings: Playfair Display (serif) — lodge/heritage feel
- Body: Inter or Lato (sans-serif) — clean readability
- Monospace for data tables/scores

**Visual Language:**
- Subtle textures (wood grain, leather, canvas hints)
- Gold dividers and accents
- Generous whitespace
- Full-width hero video sections
- Warm photo treatments (slight warm color grade on club photos)

---

## 4. Site Structure (18 Pages)

### 4.1 Core Pages

**Home** (`/`)
- Remotion hero video (autoplay, muted, loop)
- Facility highlight cards (6 disciplines as visual cards)
- Upcoming events preview (3 next events from calendar data)
- Live weather widget (Straffordville conditions)
- Range status board (open/closed per range)
- Affiliate logos bar
- "Join the Club" CTA section

**About** (`/about/`)
- Club history narrative
- Facility overview with photo carousel
- 50-acre property description
- Accessibility features (Trillium Foundation Grant)

**Membership** (`/membership/`)
- Benefits list
- Fee tiers (individual, family, junior, senior)
- FAQ accordion
- Downloadable application forms (PDF)
- "Join" CTA with contact info

**Contact** (`/contact/`)
- Netlify-powered contact form
- Embedded Google Map (9908 Plank Road, Straffordville)
- Driving directions
- Social media links (Facebook)
- Club email (ovrag@hotmail.com)

### 4.2 Discipline Pages (6)

Each discipline page follows the same template:
- Remotion title card video intro (unique per discipline)
- Facility specs (distances, lanes, stations, equipment)
- Hours of operation
- Rules specific to that discipline
- Photo gallery section
- Related events

Pages:
- **Trap Shooting** (`/disciplines/trap/`) — 4 trap fields, league info
- **Sporting Clays** (`/disciplines/sporting-clays/`) — 10-station course
- **Rifle** (`/disciplines/rifle/`) — 200-yard outdoor range
- **Handgun** (`/disciplines/handgun/`) — Pistol range
- **Archery** (`/disciplines/archery/`) — Range + 3D targets
- **Fishing Pond** (`/disciplines/fishing/`) — Stocked pond

### 4.3 Events & Community (4)

**CAN-AM** (`/can-am/`)
- Dedicated flagship event page
- Event history and description
- Results archive (sortable tables by year)
- Photo gallery from past events
- Remotion highlight reel video
- Next event date + registration info

**Events Calendar** (`/events/`)
- Interactive calendar widget (monthly/list views)
- Event categories: competition, social, maintenance, meeting
- "Add to Google Calendar" per event
- Past event archive

**Results & Leaderboards** (`/results/`)
- Sortable results tables
- Filter by discipline, event, season
- CAN-AM scores, club championships, trap league standings
- Season history

**Gallery** (`/gallery/`)
- Filterable photo/video grid (by discipline, event, year)
- Lightbox viewer with navigation
- Lazy-loaded images
- Video playback for Remotion clips

### 4.4 Info & Resources (4)

**Ranges & Facilities** (`/facilities/`)
- Animated facility map (Remotion infographic)
- Per-range specs, hours, capacity
- Range status board (live open/closed)
- Safety rules summary

**News & Newsletter** (`/news/`)
- Blog-style post listing
- Newsletter archive (past issues)
- Email signup form (Mailchimp/Buttondown)
- Facebook feed embed

**Affiliates** (`/affiliates/`)
- CCFR (firearmrights.ca) — advocacy, insurance, legal
- NFA Canada (nfa.ca) — advocacy, Canadian Firearms Journal
- OFAH (ofah.org) — Ontario conservation, membership
- HuntFishOntario (huntandfishontario.com) — provincial licensing
- Each with logo, description, and direct link

**Rules & Safety** (`/rules/`)
- General range rules
- Code of conduct
- Discipline-specific rules (links to each discipline page)
- Guest policy
- Emergency procedures

---

## 5. Interactive Islands

| Island | Page(s) | Technology | Data Source |
|--------|---------|-----------|-------------|
| Events Calendar | `/events/`, Home preview | Vanilla JS | `data/events.json` |
| Weather Widget | Home, `/facilities/` | Vanilla JS + fetch | OpenWeatherMap API |
| Range Status Board | Home, `/facilities/` | Vanilla JS | `data/range-status.json` |
| Gallery Lightbox | `/gallery/`, discipline pages | Vanilla JS | `data/gallery.json` + image files |
| Newsletter Signup | `/news/`, footer | Netlify form or Mailchimp embed | External service |
| Facebook Feed | `/news/`, Home | Facebook Page Plugin embed | Facebook API |
| Results Tables | `/results/`, `/can-am/` | Vanilla JS (sortable) | `data/results/*.json` |
| Contact Form | `/contact/` | Netlify Forms | Netlify |

---

## 6. Remotion Video Pipeline

### 6.1 Video Categories (~25-30 assets)

| Category | Count | Description | Dimensions |
|----------|-------|-------------|------------|
| Hero/Cinematic | 3 | Homepage, About, CAN-AM page intros | 1920x1080 |
| Discipline Intros | 6 | Title card for each discipline page | 1920x1080 |
| Page Transitions | 5-8 | Crosshair wipes, scope zooms, shell reveals | 1920x300 (banner) |
| Animated Infographics | 5-6 | Range specs, facility stats, membership data | 1920x1080 |
| CAN-AM Highlight | 1-2 | Event recap with scores/photos/graphics | 1920x1080 |
| Recruitment Promo | 1 | "Welcome to Otter Valley" — shareable | 1920x1080 |

### 6.2 Video Production Workflow

1. Remotion compositions defined in `/remotion/` directory
2. Club photos + stock images used as source material
3. Videos rendered to MP4 at build time via `npx remotion render`
4. Optimized MP4s stored in `/public/videos/`
5. Astro pages embed videos with `<video>` tags (autoplay/muted/loop for backgrounds, controls for content)

### 6.3 Heritage Motion Graphics Style

- Warm color grade matching brand palette
- Gold text animations (fade + slide)
- Subtle film grain overlay
- Elegant serif typography (Playfair Display)
- Smooth Ken Burns effect on photos
- Tasteful crossfade transitions (no flashy effects)

---

## 7. Data Architecture

All dynamic data stored as JSON files in `/src/data/`, updated via Claude Code:

```
src/data/
  events.json          # Calendar events
  range-status.json    # Open/closed per range
  results/
    can-am-2025.json   # CAN-AM scores by year
    trap-league.json   # Trap league standings
    championships.json # Club championship results
  gallery.json         # Photo/video metadata + paths
  newsletters.json     # Newsletter archive metadata
```

---

## 8. Image Strategy

**Phase 1 (Launch):**
- Download existing images from current WordPress site (~20 photos)
- Strip WordPress thumbnail suffixes to get full-resolution originals
- Supplement with curated stock photos (shooting sports, outdoor/nature, lodge interiors)
- Apply warm heritage color treatment for consistency
- Astro image optimization (WebP conversion, responsive srcsets)

**Phase 2 (Post-approval):**
- Mike takes professional photos of all facilities
- Replace stock images with real club photography
- Add member-submitted photos to gallery

---

## 9. Deployment

- **Staging:** `otter-valley-preview.netlify.app` (demo for club)
- **Production:** TBD — depends on club approval, likely take over `ottervalleyrodandgunclub.com`
- **Build:** `astro build` + `remotion render` (Netlify build command)
- **GitHub:** MikeKapin/otter-valley-site

---

## 10. Content Gaps to Fill (vs Competitors)

Features no Ontario gun club currently offers:
1. Remotion motion graphics videos on any page
2. Live weather/range conditions widget
3. Interactive events calendar with "Add to Calendar"
4. Sortable competition results and leaderboards
5. Curated affiliates page (CCFR, NFA, OFAH, HuntFishOntario)
6. Animated facility map
7. Newsletter archive with email signup
8. Facebook feed integration
9. Range status board
10. CAN-AM dedicated page with highlight reel

---

## 11. Out of Scope (V1)

- Merch/swag store
- Member login portal
- Online payment/dues
- Forum or discussion board
- Mobile app
- Automated social media posting
