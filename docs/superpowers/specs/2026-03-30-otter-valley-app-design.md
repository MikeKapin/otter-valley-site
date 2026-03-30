# Otter Valley Rod & Gun Club — Member App Spec

**Date:** 2026-03-30
**Author:** Mike Kapin (volunteer web/newsletter coordinator)
**Status:** Approved — ready for implementation planning

---

## 1. Project Overview

A Progressive Web App (PWA) for Otter Valley Rod & Gun Club members that replaces the physical range logbook with digital sign-in via QR code or manual account login. Secondary features surface key info from the club website (range status, events, rules, contact) and enable hazard reporting.

**Primary Goal:** Digital range sign-in — members check into a specific range when they arrive. The club gets real usage data and members skip the paper logbook.

**Maintainer:** Mike Kapin — sole maintainer via Claude Code.

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | **PWA (HTML/CSS/JS)** | Installable, works offline, no app store |
| Backend API | **Cloudflare Worker** | Proven pattern from DrawEdge ecosystem |
| Database | **Cloudflare D1** | Separate DB from DrawEdge, free tier |
| Email (hazard reports) | **Cloudflare Worker + MailChannels** or **Resend** | Transactional email from Worker |
| Email digest | **Worker Cron Trigger** | Scheduled daily/weekly summary |
| Hosting | **Cloudflare Pages** | Same deploy workflow as DrawEdge |

---

## 3. Brand Identity

Identical to the Otter Valley website:
- **Palette:** Dark browns (`#2d1b00`, `#3e2723`, `#1b0e00`), warm gold (`#c9a84c`), cream (`#f5e6c8`), deep red for urgent/hazard (`#8b0000`)
- **Typography:** Playfair Display (headings), Inter (body)
- **Visual style:** Heritage/Classic — warm, lodge feel
- **App icon:** Club logo on brown background with gold border

---

## 4. Ranges Tracked

| # | Range Name | ID |
|---|-----------|-----|
| 1 | Rifle Range | `rifle` |
| 2 | Outdoor Pistol Range | `outdoor-pistol` |
| 3 | Indoor Pistol Range | `indoor-pistol` |
| 4 | Archery Range | `archery` |
| 5 | Sporting Clays Range | `sporting-clays` |
| 6 | Fishing Pond | `fishing` |

---

## 5. Sign-In System

### 5.1 QR Code Flow (Primary)

1. Club prints and posts a QR code at each range entrance
2. Each QR code encodes a URL: `https://app.ottervalleyrodandgunclub.com/checkin?range=rifle` (or staging URL)
3. Member opens camera / taps QR → app opens at the check-in page with range pre-selected
4. If logged in: shows "Sign in to Rifle Range?" with confirm button. One tap.
5. If not logged in: prompts to log in first, then confirms check-in
6. Success screen: "Signed in to Rifle Range at 2:34 PM" with checkmark animation

### 5.2 Manual Account Flow (Fallback)

1. Member opens app manually
2. Taps "Sign In to Range" from home screen
3. Selects range from list of 6 (large tap targets, range icons)
4. Confirms sign-in
5. Same success screen

### 5.3 Account Registration

- Fields: First name, Last name, Email, Password
- Optional: Membership number (for club records)
- Email verification not required for V1 (keep it simple)
- Password stored hashed (bcrypt via Worker)
- JWT token stored in localStorage, auto-login on return

### 5.4 Sign-Out from Range

- Optional — member can tap "Sign Out" when leaving
- If no sign-out, visit is recorded with sign-in time only
- Sign-out adds duration data (useful for the club)

---

## 6. App Pages

### 6.1 Home / Dashboard (`/`)
- Welcome message: "Welcome back, [First Name]"
- Large "Sign In to Range" button (primary CTA)
- Current range status (open/closed per range — from JSON, same data as website)
- Next upcoming event (from events data)
- Quick links: Rules, Report Hazard, My Visits

### 6.2 Sign In to Range (`/checkin`)
- If arrived via QR: range pre-selected, just confirm
- If arrived manually: grid of 6 ranges with icons and names (large tap targets)
- Tap range → confirmation screen → success animation
- Shows current sign-in status if already checked in ("You're currently at Rifle Range since 2:34 PM — Sign out?")

### 6.3 My Visits (`/visits`)
- Personal visit history: date, range, sign-in time, duration (if signed out)
- Summary stats at top: "23 visits this season", "Most visited: Rifle Range (12 visits)"
- Filter by range or date range
- Seasonal breakdown (current season vs. all-time)

### 6.4 Range Rules (`/rules`)
- Accordion list: tap a range name to expand its rules
- General range rules section at top (applies to all ranges)
- Pull real rules from the current website (https://ottervalleyrodandgunclub.com/rules-regulations/)
- Range-specific rules for each of the 6 ranges

### 6.5 Events (`/events`)
- List of upcoming events (from shared events.json data — same as website)
- Date, title, description, category tag
- "Add to Calendar" link per event

### 6.6 Report a Hazard (`/hazard`)
- Header: "Report a Safety Hazard" with urgent styling (deep red accent)
- "What happened?" — textarea (required, min 20 characters)
- "Where?" — range selector dropdown (optional, they might not be at a range)
- "Photo" — optional camera/file upload (single image)
- Submit button: "Report Hazard"
- All reports flagged as URGENT automatically
- Sends email to ovrag@hotmail.com with subject "⚠️ URGENT: Safety Hazard Report — Otter Valley R&G"
- Email body: reporter name, range (if selected), description, photo attachment, timestamp
- Success screen: "Report submitted. Thank you for keeping our club safe."
- Reports also stored in D1 for admin dashboard

### 6.7 Contact (`/contact`)
- Club address: 9908 Plank Road (formerly Highway 19), Straffordville, Ontario
- Email: ovrag@hotmail.com
- Link to Google Maps directions
- "Between Eden and Straffordville" note
- Club Facebook link

### 6.8 Account / Profile (`/account`)
- Name, email, membership number (if entered)
- Edit profile
- Sign out button
- App version info

---

## 7. Admin System

### 7.1 Admin Dashboard (`/admin`)
- Password-protected (separate admin credentials, not member accounts)
- **Today's Activity:** Live view of who's signed in right now, which ranges
- **Visit Log:** Searchable/filterable table — date, member name, range, sign-in time, duration
- **Range Usage Stats:** Bar chart or table — visits per range (this week / this month / this season)
- **Peak Times:** Which days and times are busiest
- **Member Activity:** Visits per member (for engagement tracking)
- **Hazard Reports:** List of all reports with status (new / reviewed / resolved)
- **CSV Export:** Download visit log as CSV for any date range
- **Email Digest Settings:** Toggle daily/weekly digest, set recipient emails

### 7.2 Email Digest (Worker Cron)
- Scheduled via Cloudflare Worker Cron Trigger
- Configurable: daily (end of day) and/or weekly (Sunday evening)
- Content: total visits today/this week, busiest range, member count, any new hazard reports
- Sent to admin email(s)

---

## 8. D1 Database Schema

```sql
-- Members
CREATE TABLE members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  membership_number TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_login TEXT
);

-- Range visits (the core sign-in log)
CREATE TABLE visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL REFERENCES members(id),
  range_id TEXT NOT NULL,
  signed_in_at TEXT NOT NULL DEFAULT (datetime('now')),
  signed_out_at TEXT,
  source TEXT DEFAULT 'manual', -- 'qr' or 'manual'
  FOREIGN KEY (member_id) REFERENCES members(id)
);

-- Hazard reports
CREATE TABLE hazard_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL REFERENCES members(id),
  range_id TEXT,
  description TEXT NOT NULL,
  photo_url TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'reviewed', 'resolved'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (member_id) REFERENCES members(id)
);

-- Admin accounts (separate from members)
CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

-- Range status (open/closed)
CREATE TABLE range_status (
  range_id TEXT PRIMARY KEY,
  status TEXT DEFAULT 'open', -- 'open', 'closed', 'reserved'
  note TEXT DEFAULT '',
  updated_at TEXT DEFAULT (datetime('now'))
);
```

---

## 9. API Endpoints (Cloudflare Worker)

### Auth
- `POST /api/auth/register` — Create member account
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/auth/me` — Get current member profile

### Visits
- `POST /api/visits/checkin` — Sign in to a range `{ range_id, source }`
- `POST /api/visits/checkout` — Sign out from current range
- `GET /api/visits/current` — Get current active visit (if any)
- `GET /api/visits/history` — Get member's visit history
- `GET /api/visits/stats` — Get member's visit statistics

### Ranges
- `GET /api/ranges/status` — Get all range statuses

### Hazard Reports
- `POST /api/hazard/report` — Submit hazard report `{ range_id?, description, photo? }`

### Admin (requires admin auth)
- `GET /api/admin/visits` — All visits with filters (date, range, member)
- `GET /api/admin/stats` — Range usage statistics
- `GET /api/admin/hazards` — All hazard reports
- `PUT /api/admin/hazards/:id` — Update hazard report status
- `PUT /api/admin/ranges/:id` — Update range status (open/closed)
- `GET /api/admin/export` — CSV export of visit log

### Events (read-only, from shared data)
- `GET /api/events` — Upcoming events list

---

## 10. PWA Features

- **Service Worker:** Cache app shell for offline access. Sign-in screen works offline and syncs when back online.
- **Web App Manifest:** App name, icons, theme color (#3e2723), background color (#1b0e00), display: standalone
- **Install prompt:** "Add to Home Screen" banner on first visit
- **Offline sign-in:** If no network, queue the check-in in localStorage and sync when connection restores

---

## 11. QR Code Specs

Generate 6 QR codes, one per range:
- URL format: `https://[app-domain]/checkin?range=[range_id]`
- QR codes: high error correction, dark brown foreground on cream background (match brand)
- Print format: 4"x4" weather-resistant signs with range name above QR code
- Generate as SVGs or high-res PNGs for printing

---

## 12. Deployment

- **Staging:** Cloudflare Pages preview URL for demo
- **Production:** Subdomain of club site (e.g., `app.ottervalleyrodandgunclub.com`) or standalone domain
- **D1 Database:** New database, separate from DrawEdge
- **Worker:** Separate worker from DrawEdge (cleaner isolation)

---

## 13. Out of Scope (V1)

- Push notifications
- Native app store listing
- Payment / dues collection
- Member-to-member messaging
- GPS-based auto check-in
- Photo gallery in app
- Range booking / reservations
