
## Phase 1 – Project \& infrastructure setup

### 1.1 Repo and Next.js base

- Create Next.js app with TypeScript and Tailwind (`create-next-app` with App Router).[^3][^4]
- Initialize Git repo, `.editorconfig`, `.gitignore`, basic README.[^1]
- Configure Tailwind (content paths, base styles, custom theme).[^5][^3]
- Set up base `app/layout.tsx` and `app/page.tsx` with placeholder header/footer.[^6][^1]


### 1.2 VPS \& deployment pipeline

- Provision VPS (Ubuntu); install Node, Nginx, Docker if you use containers.[^7][^8]
- Configure Nginx as reverse proxy (domain, SSL with Let’s Encrypt).[^9][^7]
- Add deployment workflow (simple SSH script or CI/CD) to build and restart app on push.[^10][^7]

***

## Phase 2 – Supabase \& core data model

### 2.1 Supabase project \& connection

- Create Supabase project; copy URL, anon key, service key.[^2][^11]
- Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in `.env`.[^11][^2]
- Set up Supabase client helpers for server and client components.[^2]


### 2.2 Tables \& initial schema

Create tables in Supabase Table Editor or via SQL:[^12][^2]

Core:

- `profiles` (extends `auth.users`), `members`, `families`.
- `ministries`, `events`, `event_registrations`.
Content:
- `sermons`, `blog_posts`, `blog_comments`, `pages`.
Media:
- `photo_albums`, `photos`.
Communication:
- `contact_messages`, `prayer_requests`.


### 2.3 Roles \& RLS

- Add `role` field to `profiles` (enum: admin, editor, leader, member).[^13]
- Write RLS policies for each table (who can read/write).[^14][^15]
- Seed one admin profile for yourself.

***

## Phase 3 – Auth and protected admin shell

### 3.1 Auth screens

- Implement `/auth/login` and `/auth/register` using Supabase Auth.[^11][^2]
- Add password reset flow (Supabase magic link or reset emails).


### 3.2 Role-aware session handling

- On login, fetch `profiles.role` and store in session or context.[^2]
- Implement middleware or server-side checks to protect `/admin` routes based on role.[^16][^17]


### 3.3 Admin layout

- Create `app/admin/layout.tsx` with sidebar and top bar.[^18][^16]
- Add base `app/admin/page.tsx` (Dashboard placeholder).

***

## Phase 4 – Global UI \& basic public pages

### 4.1 Global layout \& navigation

- Build `<Header>` with nav links (Home, About, Ministries, Sermons, Events, Blog, Gallery, Contact, Login).[^19][^20]
- Build `<Footer>` with address, service times, social links.[^21][^19]
- Apply responsive Tailwind styling and dark-on-light church-friendly theme.[^22][^23]


### 4.2 Home, About, Contact (static content)

- Home: hero, basic service times, temporary placeholders for latest sermon/events/posts.[^24][^19]
- About: mission, beliefs, leadership grid (hard-coded first, CMS later).[^19][^21]
- Contact: contact info, map embed, forms for contact and prayer requests.[^21][^19]


### 4.3 Form handling

- Implement API routes for contact \& prayer forms → insert into `contact_messages`/`prayer_requests`.[^25]
- Add validation (e.g., Zod or simple checks) and success/error UI.

***

## Phase 5 – Members \& ministries (data backbone)

### 5.1 Admin – Members

- `/admin/members` list: fetch from `members`, display table with basic filters.[^26]
- Member create/edit form: name, contact, status, notes.
- Optional: link member ↔ profile if you want login-linked members.


### 5.2 Admin – Ministries

- `/admin/ministries` list and CRUD forms (name, description, schedule, leader).[^27]
- Add ability to assign members to ministries.


### 5.3 Public – Ministries pages

- `/ministries` index: grid of ministries from DB.[^27][^21]
- `/ministries/[slug]`: detail page with ministry info and related events.

***

## Phase 6 – Events module

### 6.1 Supabase \& data

- Confirm `events` schema: title, description, ministry_id, start/end, location, show_on_home, capacity, registration_enabled.


### 6.2 Admin – Events

- `/admin/events` list: sortable, filterable by date and ministry.[^26]
- Event create/edit form with validation.
- Optional: view registrations per event.


### 6.3 Public – Events

- `/events` index: upcoming events (list or calendar view).[^19][^21]
- `/events/[id]` detail: info, host ministry, optional registration form.
- Hook registration form to `event_registrations`.

***

## Phase 7 – Sermons \& media

### 7.1 Supabase – Sermons schema

- Ensure `sermons` has: title, slug, date, speaker, passage, series, description, video_url, audio_url, notes_url, featured.[^28][^29]


### 7.2 Admin – Sermons

- `/admin/sermons` list with status and filters.[^28]
- Sermon CRUD form with media URLs and attachments.


### 7.3 Public – Sermons index \& detail

- `/sermons` with hero + featured sermon, filters (series, speaker, year), searchable grid.[^24][^28]
- `/sermons/[slug]` with media player, metadata, notes, related sermons.[^30][^31]

***

## Phase 8 – Blog \& comments

### 8.1 Supabase – Blog tables

- Confirm `blog_posts` (title, slug, excerpt, body, thumbnail, tags, status, publish_at).
- Confirm `blog_comments` (post_id, author_profile_id, body, status).


### 8.2 Admin – Blog

- `/admin/blog` list with filters (status, date).[^19]
- Blog post editor with rich text (pick a simple editor library).
- Comment moderation view (approve/hide/delete).


### 8.3 Public – Blog

- `/blog` index with filters and pagination.[^24][^19]
- `/blog/[slug]` detail with content and comment section (auth-only posting).

***

## Phase 9 – Gallery with VPS image storage

### 9.1 Server file storage setup

- On VPS, create `/var/www/church-app/uploads/gallery`.[^32][^7]
- Configure Nginx `location /uploads` to serve static files from that directory.[^8][^7]
- Ensure permissions for the Node process to write to that path.


### 9.2 Supabase – Media tables

- `photo_albums`: id, slug, title, description, date_range, cover_photo_id, event_id, ministry_id, is_public.
- `photos`: id, album_id, storage_path, caption, taken_at, position, created_by.[^33][^34]


### 9.3 Upload API

- Create Next.js API route `app/api/gallery/upload/route.ts` that:[^35]
    - Validates auth \& role (editor/admin).
    - Accepts file(s) via `FormData`.
    - Writes to `/uploads/gallery/{album_id}/{uuid}.jpg`.
    - Inserts row(s) into `photos`.


### 9.4 Admin – Gallery

- `/admin/gallery/albums` list and CRUD for albums.[^36]
- `/admin/gallery/albums/[id]/photos` photo manager with upload zone, captions, reordering, delete, set cover.


### 9.5 Public – Gallery

- `/gallery` albums index with cards.[^37][^36]
- `/gallery/[slug]` album detail: responsive image grid + lightbox.[^38][^39]

***

## Phase 10 – Pages CMS \& home integration

### 10.1 Pages CMS

- Implement `pages` table and admin UI to edit Home, About, Beliefs content blocks.[^21][^19]
- Fetch those blocks server-side for public pages.


### 10.2 Home page dynamic sections

- Replace placeholders with real data: latest sermon, upcoming events, recent posts, featured album.[^24][^19]

***

## Phase 11 – Settings, polish, and hardening

### 11.1 Settings \& navigation

- Implement `/admin/settings` for church profile and nav order.[^13][^21]
- Use settings in header/footer (logo, church name, service times).


### 11.2 Validation, errors, and UX polish

- Add form validation (Zod or similar) to all create/edit forms.[^40]
- Add loading and error states using `loading.tsx` and `error.tsx` in key routes.[^16]
- Improve empty states (e.g., “No sermons yet”).


### 11.3 Performance \& SEO

- Ensure SSR/SSG where appropriate; enable image optimization.[^41][^5]
- Add metadata/SEO helpers for title/description/open graph.[^23][^19]
- Generate sitemap and robots.txt.


### 11.4 Security \& go‑live checklist

- Review all RLS rules and admin route protections.[^15][^14]
- Enable HTTPS, secure cookies, and environment variable management on VPS.[^10][^7]
- Set up backups for Supabase database and VPS uploads.[^42][^32]

***

## Phase 12 – Post‑launch improvements (optional)

- Add giving/integration with payment provider.[^19]
- Add attendance tracking, volunteer scheduling, or SMS/email campaigns.[^13][^27]
- Add basic analytics for content engagement (sermon views, event interest).

