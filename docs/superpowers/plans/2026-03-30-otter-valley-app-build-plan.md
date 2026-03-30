# Otter Valley R&G Club App — Build Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a PWA for Otter Valley Rod & Gun Club members with digital range sign-in (QR code + manual), visit tracking, range rules, events, hazard reporting, and an admin dashboard.

**Architecture:** Cloudflare Pages (PWA frontend) + Cloudflare Worker (API) + D1 database. Same architectural pattern as the DrawEdge ecosystem.

**Tech Stack:** HTML/CSS/JS PWA, Cloudflare Worker, D1 (SQLite), JWT auth, MailChannels/Resend for email

**Design Spec:** Read `docs/superpowers/specs/2026-03-30-otter-valley-app-design.md` for the full design decisions, database schema, API endpoints, and page specs.

**CRITICAL RULES:**
- Commit after every completed task
- Read the app design spec before starting — it has all decisions, schema, and API definitions
- Heritage/Classic brand: dark browns (#2d1b00, #3e2723), warm gold (#c9a84c), cream text (#f5e6c8), deep red for hazard (#8b0000)
- Typography: Playfair Display headings, Inter body (Google Fonts)
- Mobile-first responsive design — this is primarily a phone app
- The app lives in a NEW directory: `C:\LocalProjects\apps\otter-valley-app\`
- Create a NEW GitHub repo: `MikeKapin/otter-valley-app`
- Create a NEW D1 database (separate from DrawEdge)

---

## File Structure

```
otter-valley-app/
├── wrangler.toml                 # Worker + D1 config
├── package.json
├── frontend/
│   ├── index.html                # Landing / login page
│   ├── app.html                  # Main app (authenticated)
│   ├── admin.html                # Admin dashboard
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service worker
│   ├── assets/
│   │   ├── app.js                # Main app logic (auth, routing, UI)
│   │   ├── admin.js              # Admin dashboard logic
│   │   ├── style.css             # Heritage brand styles
│   │   ├── icons/
│   │   │   ├── icon-192.png      # PWA icon
│   │   │   └── icon-512.png      # PWA icon
│   │   └── qr-codes/             # Generated QR code images for printing
│   │       ├── qr-rifle.svg
│   │       ├── qr-outdoor-pistol.svg
│   │       ├── qr-indoor-pistol.svg
│   │       ├── qr-archery.svg
│   │       ├── qr-sporting-clays.svg
│   │       └── qr-fishing.svg
│   ├── _headers                  # Cloudflare Pages headers
│   ├── _redirects                # SPA routing
│   ├── robots.txt
│   └── sitemap.xml
├── worker/
│   ├── index.js                  # Worker entry — route dispatcher
│   ├── auth.js                   # Registration, login, JWT
│   ├── visits.js                 # Check-in, check-out, history, stats
│   ├── ranges.js                 # Range status API
│   ├── hazard.js                 # Hazard report submission + email
│   ├── admin.js                  # Admin endpoints (visits, stats, export, hazards)
│   ├── events.js                 # Events data endpoint
│   ├── email.js                  # Email helper (hazard alerts + digest)
│   └── cron.js                   # Cron trigger for email digest
├── schema/
│   └── seed.sql                  # D1 schema + seed data
└── docs/
    └── (specs and plans copied/linked from otter-valley-site)
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `wrangler.toml`, `schema/seed.sql`
- Create: GitHub repo

- [ ] **Step 1: Create project directory and initialize**

```bash
mkdir -p C:/LocalProjects/apps/otter-valley-app
cd C:/LocalProjects/apps/otter-valley-app
git init
npm init -y
npm install -D wrangler
```

- [ ] **Step 2: Create GitHub repo**

```bash
gh repo create MikeKapin/otter-valley-app --public --description "Otter Valley Rod & Gun Club — member PWA with digital range sign-in"
git remote add origin https://github.com/MikeKapin/otter-valley-app.git
```

- [ ] **Step 3: Create D1 database**

```bash
npx wrangler d1 create otter-valley-app-db
```

Note the database ID from the output — use it in wrangler.toml.

- [ ] **Step 4: Create wrangler.toml**

```toml
name = "otter-valley-app"
main = "worker/index.js"
compatibility_date = "2024-01-01"

[triggers]
crons = ["0 22 * * *"]  # Daily digest at 10 PM ET

[[d1_databases]]
binding = "DB"
database_name = "otter-valley-app-db"
database_id = "<ID_FROM_STEP_3>"

[vars]
CLUB_EMAIL = "ovrag@hotmail.com"
APP_NAME = "Otter Valley R&G Club"
JWT_SECRET = "CHANGE_THIS_TO_RANDOM_SECRET"
```

After creating, update the `database_id` with the actual ID from Step 3. Also generate a real JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use `wrangler secret put JWT_SECRET` to store it securely instead of in wrangler.toml.

- [ ] **Step 5: Create seed.sql**

Full schema from the design spec:

```sql
-- Members
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  membership_number TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_login TEXT
);

-- Range visits
CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  range_id TEXT NOT NULL,
  signed_in_at TEXT NOT NULL DEFAULT (datetime('now')),
  signed_out_at TEXT,
  source TEXT DEFAULT 'manual',
  FOREIGN KEY (member_id) REFERENCES members(id)
);

-- Hazard reports
CREATE TABLE IF NOT EXISTS hazard_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  range_id TEXT,
  description TEXT NOT NULL,
  photo_url TEXT,
  status TEXT DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (member_id) REFERENCES members(id)
);

-- Admin accounts
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

-- Range status
CREATE TABLE IF NOT EXISTS range_status (
  range_id TEXT PRIMARY KEY,
  status TEXT DEFAULT 'open',
  note TEXT DEFAULT '',
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Seed range status
INSERT OR IGNORE INTO range_status (range_id, status, note) VALUES
  ('rifle', 'open', ''),
  ('outdoor-pistol', 'open', ''),
  ('indoor-pistol', 'open', ''),
  ('archery', 'open', ''),
  ('sporting-clays', 'open', ''),
  ('fishing', 'open', 'Catch and release');
```

- [ ] **Step 6: Apply schema to D1**

```bash
npx wrangler d1 execute otter-valley-app-db --file=schema/seed.sql
```

- [ ] **Step 7: Create .gitignore**

```
node_modules/
.wrangler/
.dev.vars
```

- [ ] **Step 8: Commit and push**

```bash
git add -A
git commit -m "feat: scaffold project with D1 schema, wrangler config"
git push -u origin master
```

---

## Task 2: Worker API — Auth Module

**Files:**
- Create: `worker/index.js`, `worker/auth.js`

- [ ] **Step 1: Build worker/index.js (route dispatcher)**

Route dispatcher pattern (same as DrawEdge):
- Parse URL path and method
- Route `/api/auth/*` → `auth.js`
- Route `/api/visits/*` → `visits.js`
- Route `/api/ranges/*` → `ranges.js`
- Route `/api/hazard/*` → `hazard.js`
- Route `/api/admin/*` → `admin.js`
- Route `/api/events` → `events.js`
- Handle CORS headers (Access-Control-Allow-Origin, Methods, Headers)
- Handle `scheduled` event for cron triggers → `cron.js`
- 404 for unknown routes
- JSON error responses with proper status codes

- [ ] **Step 2: Build worker/auth.js**

Authentication module:
- **`POST /api/auth/register`**: Takes `{ first_name, last_name, email, password, membership_number? }`. Hash password with Web Crypto API (PBKDF2 — Workers don't have bcrypt, use PBKDF2 with SHA-256, 100000 iterations). Insert into `members` table. Return JWT.
- **`POST /api/auth/login`**: Takes `{ email, password }`. Verify password hash. Update `last_login`. Return JWT with `{ id, email, first_name }` payload.
- **`GET /api/auth/me`**: Requires JWT in Authorization header. Returns member profile.
- **JWT helper functions**: `signJWT(payload, secret)`, `verifyJWT(token, secret)` using Web Crypto API (HMAC SHA-256). Token expiry: 30 days.
- **`requireAuth(request, env)` middleware**: Extracts and verifies JWT, returns member object or 401.

IMPORTANT: Cloudflare Workers do NOT have Node.js crypto. Use the Web Crypto API (`crypto.subtle`) for all hashing and JWT signing.

- [ ] **Step 3: Test auth endpoints**

```bash
npx wrangler dev
```

Test with curl:
```bash
# Register
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@test.com","password":"testpass123"}'

# Login
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"testpass123"}'
```

Verify: register returns JWT, login returns JWT, `/api/auth/me` with JWT returns profile.

- [ ] **Step 4: Commit**

```bash
git add worker/
git commit -m "feat: add Worker route dispatcher and auth module (register, login, JWT)"
```

---

## Task 3: Worker API — Visits Module

**Files:**
- Create: `worker/visits.js`

- [ ] **Step 1: Build worker/visits.js**

Visit tracking endpoints (all require auth):

- **`POST /api/visits/checkin`**: Takes `{ range_id, source }`. Validates range_id is one of the 6 valid IDs. Checks member doesn't already have an active visit (no `signed_out_at`). Inserts visit row. Returns visit record with success message.
- **`POST /api/visits/checkout`**: Finds member's active visit (where `signed_out_at IS NULL`). Sets `signed_out_at` to now. Returns updated visit with duration.
- **`GET /api/visits/current`**: Returns member's active visit (if any) or `null`.
- **`GET /api/visits/history`**: Returns member's visit history, ordered by date descending. Supports query params: `?range=rifle`, `?limit=50`, `?offset=0`.
- **`GET /api/visits/stats`**: Returns member's statistics:
  - Total visits (all-time and current season — season = April 1 to March 31)
  - Visits per range (counts)
  - Most visited range
  - Last visit date

Valid range IDs: `rifle`, `outdoor-pistol`, `indoor-pistol`, `archery`, `sporting-clays`, `fishing`

- [ ] **Step 2: Test visits endpoints**

Using the JWT from Task 2 testing:
```bash
# Check in
curl -X POST http://localhost:8787/api/visits/checkin \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"range_id":"rifle","source":"manual"}'

# Current visit
curl http://localhost:8787/api/visits/current \
  -H "Authorization: Bearer <JWT>"

# Check out
curl -X POST http://localhost:8787/api/visits/checkout \
  -H "Authorization: Bearer <JWT>"

# History
curl http://localhost:8787/api/visits/history \
  -H "Authorization: Bearer <JWT>"

# Stats
curl http://localhost:8787/api/visits/stats \
  -H "Authorization: Bearer <JWT>"
```

- [ ] **Step 3: Commit**

```bash
git add worker/visits.js
git commit -m "feat: add visits module (checkin, checkout, history, stats)"
```

---

## Task 4: Worker API — Ranges, Events, Hazard Modules

**Files:**
- Create: `worker/ranges.js`, `worker/events.js`, `worker/hazard.js`, `worker/email.js`

- [ ] **Step 1: Build worker/ranges.js**

- **`GET /api/ranges/status`**: Public endpoint (no auth). Returns all rows from `range_status` table as JSON array.

- [ ] **Step 2: Build worker/events.js**

- **`GET /api/events`**: Public endpoint. Returns a hardcoded or D1-stored events array. For V1, hardcode the same events data as the website (copy from the website's `events.json`). Return only future events, sorted by date ascending.

- [ ] **Step 3: Build worker/email.js**

Email helper module:
- **`sendHazardEmail(env, report)`**: Sends urgent hazard report email to `env.CLUB_EMAIL`.
  - Subject: `⚠️ URGENT: Safety Hazard Report — Otter Valley R&G`
  - Body: Reporter name, range (if selected), description, photo URL (if any), timestamp
  - Use Resend API (or MailChannels if available on the Cloudflare plan). For V1, if email service isn't configured, log to console and store in D1 only — the admin dashboard shows reports regardless.
- **`sendDigestEmail(env, data)`**: Sends daily digest summary.
  - Subject: `Otter Valley R&G — Daily Activity Summary`
  - Body: Total visits today, per-range breakdown, any new hazard reports

NOTE on email: Cloudflare Workers can send email via MailChannels (free, requires SPF DNS record) or Resend ($0 for 100 emails/day). If neither is configured during build, make the email functions no-ops that just log — the hazard report still saves to D1 and shows in admin dashboard. Email can be wired up later.

- [ ] **Step 4: Build worker/hazard.js**

- **`POST /api/hazard/report`**: Requires auth. Takes `{ range_id?, description, photo? }`. Validates description min 20 characters. Inserts into `hazard_reports` table with status `'new'`. Calls `sendHazardEmail()`. Returns success.
- For photo upload: Accept base64-encoded image in the JSON body for V1. Store as data URL in `photo_url` column. (R2 storage can be added later for proper file storage.)

- [ ] **Step 5: Commit**

```bash
git add worker/ranges.js worker/events.js worker/hazard.js worker/email.js
git commit -m "feat: add ranges, events, hazard reporting, and email modules"
```

---

## Task 5: Worker API — Admin Module + Cron

**Files:**
- Create: `worker/admin.js`, `worker/cron.js`

- [ ] **Step 1: Build worker/admin.js**

Admin endpoints (require admin auth — separate from member auth):

- **Admin auth**: `POST /api/admin/login` — checks `admins` table, returns admin JWT. Use a separate JWT claim `{ role: 'admin' }` to distinguish from member tokens.
- **`requireAdmin(request, env)` middleware**: Verifies JWT has admin role.
- **`GET /api/admin/visits`**: All visits with filters. Query params: `?date=2026-03-30`, `?range=rifle`, `?member=John`, `?from=2026-03-01&to=2026-03-31`, `?limit=100&offset=0`. Returns visits joined with member names.
- **`GET /api/admin/stats`**: Range usage statistics. Query params: `?period=week|month|season`. Returns: visits per range, visits per day (for chart data), total unique members, peak day/time.
- **`GET /api/admin/hazards`**: All hazard reports with reporter name, ordered by date descending. Filter: `?status=new|reviewed|resolved`.
- **`PUT /api/admin/hazards/:id`**: Update hazard report status to `reviewed` or `resolved`.
- **`PUT /api/admin/ranges/:id`**: Update range status. Takes `{ status, note }`. Updates `range_status` table + `updated_at`.
- **`GET /api/admin/export`**: CSV export. Query params: `?from=2026-03-01&to=2026-03-31`. Returns CSV with headers: Date, Time, Member Name, Range, Duration, Source. Set `Content-Type: text/csv` and `Content-Disposition: attachment`.

- [ ] **Step 2: Seed an admin account**

Add to seed.sql or run directly:
```sql
-- Default admin (password: change-me-immediately)
-- Hash this password using the same PBKDF2 method from auth.js
INSERT INTO admins (username, password_hash) VALUES ('admin', '<HASHED_PASSWORD>');
```

The build should generate the hash programmatically and insert it. Or: create a one-time setup endpoint `POST /api/admin/setup` that creates the first admin account (disabled after first use).

- [ ] **Step 3: Build worker/cron.js**

Cron trigger handler:
- Runs on the schedule defined in wrangler.toml (`0 22 * * *` = daily 10 PM UTC)
- Queries today's visits from D1
- Queries new hazard reports
- Calls `sendDigestEmail()` with the summary
- If email isn't configured, just log the digest to console (visible in Worker logs)

- [ ] **Step 4: Commit**

```bash
git add worker/admin.js worker/cron.js
git commit -m "feat: add admin dashboard API, CSV export, and cron email digest"
```

---

## Task 6: Frontend — PWA Shell, Styles, Service Worker

**Files:**
- Create: `frontend/manifest.json`, `frontend/sw.js`, `frontend/assets/style.css`
- Create: `frontend/_headers`, `frontend/_redirects`, `frontend/robots.txt`

- [ ] **Step 1: Create manifest.json**

```json
{
  "name": "Otter Valley Rod & Gun Club",
  "short_name": "OV R&G",
  "description": "Member sign-in and range information",
  "start_url": "/app.html",
  "display": "standalone",
  "background_color": "#1b0e00",
  "theme_color": "#3e2723",
  "icons": [
    { "src": "/assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 2: Create PWA icons**

Generate app icons (192x192 and 512x512) — use the club logo on a dark brown (#3e2723) background with gold (#c9a84c) border. If the club logo can't be processed into an icon easily, create a simple text-based icon: "OV" in gold Playfair Display on dark brown.

- [ ] **Step 3: Create style.css**

Complete heritage brand stylesheet for the app:
- CSS custom properties matching the website: `--brown-dark`, `--brown-mid`, `--brown-base`, `--gold`, `--cream`, `--red-urgent`
- Google Fonts: Playfair Display (headings), Inter (body)
- Mobile-first layout (app is primarily used on phones)
- Bottom navigation bar (Home, Sign In, Visits, Rules, More) — fixed at bottom, gold active indicator
- Card components with gold borders
- Range status indicators (green/red/yellow dots)
- Large tap targets (min 48px) for sign-in buttons
- Form styles (inputs with gold focus border)
- Success animation (checkmark) CSS
- Hazard report styling (red accent border, urgent feel)
- Loading spinner (gold)
- Toast notification styles (success green, error red)
- Admin dashboard styles (data tables, stat cards, charts placeholder)

- [ ] **Step 4: Create service worker (sw.js)**

Cache-first strategy for app shell:
- Cache: `index.html`, `app.html`, `style.css`, `app.js`, fonts, icons
- Network-first for API calls
- Offline fallback: show cached app with "You're offline — sign-ins will sync when connected" banner
- Offline sign-in queue: store pending check-ins in localStorage, replay on reconnect
- Cache name with version for busting: `ov-app-v1`

- [ ] **Step 5: Create _headers and _redirects**

`_headers`:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff

/manifest.json
  Content-Type: application/json

/sw.js
  Content-Type: application/javascript
  Cache-Control: no-cache
```

`_redirects`: Not needed for multi-page app (index.html and app.html are separate files).

- [ ] **Step 6: Create robots.txt**

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
```

- [ ] **Step 7: Commit**

```bash
git add frontend/manifest.json frontend/sw.js frontend/assets/style.css frontend/_headers frontend/robots.txt
git commit -m "feat: add PWA shell, heritage styles, and service worker"
```

---

## Task 7: Frontend — Login / Registration Page

**Files:**
- Create: `frontend/index.html`

- [ ] **Step 1: Build index.html**

The landing/login page (unauthenticated state):
- Club logo + "Otter Valley Rod & Gun Club" header in gold Playfair Display
- "Member Sign-In" subtitle
- Tab toggle: "Login" / "Register"
- **Login form:** Email, password, "Sign In" button, "Forgot password?" link (just shows "Contact ovrag@hotmail.com")
- **Register form:** First name, last name, email, password, confirm password, membership number (optional), "Create Account" button
- Form validation (client-side): required fields, email format, password match, password min 6 chars
- On success: store JWT in localStorage, redirect to `app.html`
- If already logged in (valid JWT in localStorage): auto-redirect to `app.html`
- "Install App" prompt / instructions at bottom
- Heritage styling: dark brown background, gold accents, cream text

All auth API calls inline in script tags within index.html (keep it simple — no build step).

- [ ] **Step 2: Commit**

```bash
git add frontend/index.html
git commit -m "feat: add login/registration page with JWT auth"
```

---

## Task 8: Frontend — Main App (app.html + app.js)

**Files:**
- Create: `frontend/app.html`, `frontend/assets/app.js`

This is the core of the app — a single-page app with client-side routing using hash fragments.

- [ ] **Step 1: Build app.html**

The authenticated app shell:
- Auth check: if no JWT in localStorage, redirect to `index.html`
- App header: "OV R&G" logo/text + member first name + sign-out icon
- Page content area (swapped by hash router)
- Bottom navigation bar (fixed): Home, Sign In, My Visits, Rules, More
- "More" shows: Events, Report Hazard, Contact, Account
- Link `app.js` and `style.css`
- Register service worker

- [ ] **Step 2: Build app.js — Router and core structure**

Hash-based SPA router:
- `#home` → Dashboard view
- `#checkin` → Sign in to range (with optional `?range=X` from QR)
- `#visits` → My visit history
- `#rules` → Range rules
- `#events` → Upcoming events
- `#hazard` → Report a hazard
- `#contact` → Contact info
- `#account` → Profile / sign out
- Default: `#home`

Core utilities:
- `api(path, options)` — fetch wrapper that adds JWT Authorization header, handles 401 (redirect to login)
- `showToast(message, type)` — success/error toast notifications
- `formatDate(iso)`, `formatTime(iso)` — date formatting helpers
- Range name mapping: `{ rifle: 'Rifle Range', 'outdoor-pistol': 'Outdoor Pistol Range', ... }`

- [ ] **Step 3: Build app.js — Home / Dashboard view**

Render function for `#home`:
- "Welcome back, [First Name]" greeting
- Large "Sign In to Range" button (gold, prominent) → navigates to `#checkin`
- If currently signed in: show "You're at [Range] since [time]" card with "Sign Out" button
- Range status grid: 6 ranges with green/red/yellow status dots (fetched from `/api/ranges/status`)
- Next upcoming event card (fetched from `/api/events`, show first future event)
- Quick links row: Rules, Report Hazard, My Visits

- [ ] **Step 4: Build app.js — Check-in view**

Render function for `#checkin`:
- Parse `?range=X` from URL (from QR code)
- If range pre-selected (QR flow): show confirmation screen immediately — "[Range Name]" + "Confirm Sign-In" button + "Cancel"
- If no range pre-selected (manual flow): show grid of 6 ranges as large tappable cards with icons and names
- Tap a range → confirmation screen
- On confirm: `POST /api/visits/checkin` with `{ range_id, source: 'qr' or 'manual' }`
- Success: animated checkmark + "Signed in to [Range] at [Time]" + "Done" button back to home
- Error handling: already checked in (offer to sign out first), invalid range, network error (queue offline)

Range icons: use simple SVG icons or emoji for each range type (crosshair for rifle, target for pistol, bow for archery, fish for pond, clay disc for sporting clays)

- [ ] **Step 5: Build app.js — My Visits view**

Render function for `#visits`:
- Stats summary at top: total visits (season), most visited range, last visit
- Fetched from `/api/visits/stats`
- Visit history list below: date, range name, time in/out, duration
- Fetched from `/api/visits/history`
- Filter pills: All, Rifle, Outdoor Pistol, Indoor Pistol, Archery, Sporting Clays, Fishing
- "Load more" pagination (50 at a time)

- [ ] **Step 6: Build app.js — Range Rules view**

Render function for `#rules`:
- General rules section at top (always visible)
- Accordion for each range's specific rules (tap to expand/collapse)
- Pull real rules content from the current Otter Valley website — scrape https://ottervalleyrodandgunclub.com/rules-regulations/ for the actual text
- Each range section: range name header + rules text
- Gold accent on active/expanded section
- "No trespassing. No hunting allowed." notice at bottom

- [ ] **Step 7: Build app.js — Events, Hazard, Contact, Account views**

**Events (`#events`):**
- List of upcoming events from `/api/events`
- Date badge, title, description, category tag
- "Add to Google Calendar" link per event (construct gcal URL)

**Report a Hazard (`#hazard`):**
- Red accent border on entire form section
- "Report a Safety Hazard" header in deep red (#8b0000)
- "What happened?" textarea (required, min 20 chars, placeholder: "Describe the unsafe condition or act...")
- "Where?" dropdown: [Not at a range, Rifle Range, Outdoor Pistol Range, Indoor Pistol Range, Archery Range, Sporting Clays Range, Fishing Pond]
- "Add Photo" button — opens file picker / camera (accept="image/*" with capture="environment")
- Photo preview thumbnail after selection
- "Submit Report" button (red background)
- On submit: `POST /api/hazard/report` — show spinner then success message: "Report submitted. Thank you for keeping our club safe."
- Validation: description required, min 20 chars

**Contact (`#contact`):**
- Club name in gold header
- Address: 9908 Plank Road (formerly Highway 19), Straffordville, Ontario
- "Between Eden and Straffordville"
- Email: ovrag@hotmail.com (mailto link)
- Facebook link (external)
- "Get Directions" button (opens Google Maps in new tab)

**Account (`#account`):**
- Member name, email, membership number
- "Edit Profile" — inline edit for name and membership number
- "Sign Out" button (clears JWT, redirects to index.html)
- App version: "Otter Valley R&G App v1.0"

- [ ] **Step 8: Test the full app flow locally**

```bash
npx wrangler dev
```

Open `http://localhost:8787/index.html`:
1. Register a test account
2. Login → redirected to app.html
3. Check in to a range (manual flow)
4. View visit in My Visits
5. Check out
6. View range rules
7. Submit a test hazard report
8. View events
9. Check contact page
10. Sign out

- [ ] **Step 9: Commit**

```bash
git add frontend/app.html frontend/assets/app.js
git commit -m "feat: build complete member app with sign-in, visits, rules, hazard reporting"
```

---

## Task 9: Frontend — Admin Dashboard

**Files:**
- Create: `frontend/admin.html`, `frontend/assets/admin.js`

- [ ] **Step 1: Build admin.html**

Separate page for club admins:
- Admin login form (username + password)
- Once logged in, shows dashboard with tabs: Activity, Ranges, Hazards, Export

- [ ] **Step 2: Build admin.js**

**Activity tab (default):**
- "Today's Activity" — cards showing: total visits today, currently signed in (count + names), visits by range (bar-style breakdown using CSS, no chart library)
- Recent visits table: time, member name, range, duration, source (QR/manual)
- Date picker to view past days
- Search by member name

**Ranges tab:**
- Grid of 6 ranges with current status
- Tap a range to change status: dropdown (open/closed/reserved) + note field + save button
- This is how the club updates range status — admin changes it here, the app and website both reflect it

**Hazards tab:**
- List of all hazard reports, newest first
- Each report: reporter name, date/time, range, description, photo (if any), status badge
- Status update buttons: Mark Reviewed, Mark Resolved
- Filter by status: New, Reviewed, Resolved, All

**Export tab:**
- Date range picker (from/to)
- "Download CSV" button → calls `/api/admin/export` → triggers file download
- Preview of row count before downloading

**Stats section (within Activity tab or separate):**
- This week / this month / this season summary
- Visits per range breakdown (horizontal bars with percentages)
- Busiest day of week
- Total unique members who visited

- [ ] **Step 3: Commit**

```bash
git add frontend/admin.html frontend/assets/admin.js
git commit -m "feat: add admin dashboard with activity, range control, hazard management, CSV export"
```

---

## Task 10: QR Codes + Print-Ready Signs

**Files:**
- Create: 6 QR code SVGs in `frontend/assets/qr-codes/`
- Create: `frontend/assets/qr-codes/print-signs.html` (printable sheet)

- [ ] **Step 1: Generate QR codes**

Generate 6 QR codes as SVG files. Each QR code encodes the URL:
- `https://otter-valley-app.pages.dev/app.html#checkin?range=rifle`
- `https://otter-valley-app.pages.dev/app.html#checkin?range=outdoor-pistol`
- `https://otter-valley-app.pages.dev/app.html#checkin?range=indoor-pistol`
- `https://otter-valley-app.pages.dev/app.html#checkin?range=archery`
- `https://otter-valley-app.pages.dev/app.html#checkin?range=sporting-clays`
- `https://otter-valley-app.pages.dev/app.html#checkin?range=fishing`

Use a QR code generation library (e.g., `qrcode` npm package) or the `api.qrserver.com` service. QR colors: dark brown (#3e2723) foreground on cream (#f5e6c8) background. High error correction.

NOTE: Use the Cloudflare Pages preview URL for now. These URLs will be updated when the final domain is decided.

- [ ] **Step 2: Create print-ready signs page**

`print-signs.html` — a printable HTML page containing 6 range signs:
- Each sign is 4"x6" (or letter-size, 1 per page)
- Club logo at top
- Range name in large Playfair Display
- QR code centered (3"x3")
- "Scan to Sign In" instruction text
- "Download the app at [URL]" small text at bottom
- Print-optimized CSS (@media print)
- Club's heritage color scheme

- [ ] **Step 3: Commit**

```bash
git add frontend/assets/qr-codes/
git commit -m "feat: add QR codes and printable range signs for all 6 ranges"
```

---

## Task 11: Offline Support + Polish

- [ ] **Step 1: Implement offline sign-in queue**

In `app.js`, add offline handling:
- Before API calls, check `navigator.onLine`
- If offline during check-in: store pending check-in in localStorage key `ov_pending_checkins` as array
- Show success with note: "Signed in (offline) — will sync when connected"
- On `online` event: replay all pending check-ins via API, clear queue, show toast "Visits synced"
- Show offline indicator banner when disconnected: "You're offline — sign-ins will sync when connected"

- [ ] **Step 2: QR code handling from URL**

Ensure the check-in page properly reads the range from the URL when opened via QR code:
- QR URLs use hash params: `#checkin?range=rifle`
- Parse hash and query string on route change
- If `range` param exists and is valid, skip range selection and go straight to confirmation
- Set `source: 'qr'` in the check-in API call

- [ ] **Step 3: Responsive and mobile polish**

Test on mobile viewport (375px width):
- All tap targets at least 48px
- Bottom nav doesn't overlap content
- Forms are full-width with proper input sizes
- Success/error toasts are visible and don't block content
- QR confirmation card is centered and large
- Admin dashboard tables scroll horizontally on mobile

- [ ] **Step 4: Test full flow end-to-end**

```bash
npx wrangler dev
```

Complete test:
1. Open index.html → Register → Login → Redirected to app
2. Navigate all views (home, checkin, visits, rules, events, hazard, contact, account)
3. Manual check-in → verify in My Visits → Check out
4. QR check-in: open `app.html#checkin?range=rifle` → verify pre-selected
5. Submit hazard report
6. Open admin.html → Login → verify visit appears in Activity
7. Change range status in admin → verify it updates in member app
8. Update hazard status in admin
9. Export CSV
10. Test offline: disconnect network → check in → reconnect → verify sync

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add offline support, QR handling, and mobile polish"
```

---

## Task 12: Deploy

- [ ] **Step 1: Deploy Worker**

```bash
cd C:/LocalProjects/apps/otter-valley-app
npx wrangler deploy
```

Note the Worker URL from output.

- [ ] **Step 2: Deploy frontend to Cloudflare Pages**

```bash
npx wrangler pages project create otter-valley-app --production-branch=main
npx wrangler pages deploy frontend --project-name=otter-valley-app --branch=main
```

Note the Pages URL (e.g., `otter-valley-app.pages.dev`).

- [ ] **Step 3: Update QR code URLs**

If the Pages URL differs from what was used in the QR codes, regenerate the QR codes with the correct production URL. Update `print-signs.html` with the correct URL.

- [ ] **Step 4: Update Worker API URL in frontend**

Make sure `app.js` and `admin.js` point API calls to the deployed Worker URL (not localhost). Use relative paths if Worker and Pages are on the same domain, or configure the Worker URL as a constant at the top of `app.js`.

If using Cloudflare Pages Functions or Worker routes on the same domain, API calls can use relative `/api/*` paths. Otherwise, configure CORS on the Worker to allow the Pages domain.

- [ ] **Step 5: Create initial admin account**

Run against production D1:
```bash
npx wrangler d1 execute otter-valley-app-db --command "INSERT INTO admins (username, password_hash) VALUES ('admin', '<HASH>');"
```

Or use a setup endpoint if one was created.

- [ ] **Step 6: Verify live deployment**

Open the Pages URL:
1. Register → Login → Check in to a range
2. Open admin dashboard → verify visit appears
3. Submit hazard report → verify in admin
4. Test QR code URL directly

- [ ] **Step 7: Final commit and push**

```bash
git add -A
git commit -m "chore: deploy to Cloudflare Pages + Worker"
git push origin master
```

---

## Completion Checklist

When done, verify:
- [ ] Registration and login work
- [ ] Manual range sign-in works for all 6 ranges
- [ ] QR code URL pre-selects the correct range
- [ ] Sign-out records duration
- [ ] My Visits shows history and stats
- [ ] Range rules display real club rules
- [ ] Events list shows upcoming events
- [ ] Hazard report submits and stores in D1
- [ ] Contact page has correct club info
- [ ] Admin login works
- [ ] Admin sees today's activity and visits
- [ ] Admin can change range status (and it reflects in member app)
- [ ] Admin can update hazard report status
- [ ] CSV export downloads correctly
- [ ] PWA installs to home screen (manifest + service worker)
- [ ] Offline check-in queues and syncs
- [ ] Heritage brand consistent throughout (browns, golds, Playfair Display)
- [ ] Mobile responsive (375px viewport)
- [ ] All changes pushed to GitHub
