# prd to implement the full site for a church 

Below is a concise Product Requirements Document (PRD) for your full church website + management system using Next.js, Supabase (DB/auth), Tailwind, VPS hosting, and VPS-based image storage.[^1][^2]

***

## 1. Product overview

The product is a combined **church website** and **church management system (ChMS)**.
It includes a public site (home, ministries, sermons/media, events, blog, gallery, contact) and a secure admin panel for staff to manage content, members, events, media, and communication.[^3][^1]

Primary users:

- Visitors and members (public site)
- Admins/pastors/staff/ministry leaders (admin panel)[^4][^3]

***

## 2. Goals \& non‑goals

**Goals**

- Present clear information about the church (who, where, when, what to expect).[^5][^1]
- Provide an archive of sermons and media for streaming and download.[^6][^7]
- Share upcoming events, news, and blog posts.[^8][^1]
- Offer a gallery of event photos organized by albums.[^9][^10]
- Enable admins to manage members, ministries, events, content, and messages from a central panel.[^11][^3]
- Use Supabase for auth and relational data; host app and images on a VPS.[^2][^12]

**Non‑goals (v1)**

- Online giving/payment processing.
- Mobile native app.
- Complex automation (workflows, advanced analytics).

***

## 3. User roles \& permissions

Define roles in `profiles` (linked to Supabase `auth.users`):[^2][^3]

- Visitor (unauthenticated):
    - View all public pages (home, about, ministries, sermons, events, blog, gallery, contact).
    - Submit contact \& prayer request forms.
- Member (authenticated basic user):
    - Same as visitor.
    - Post comments on blog (if enabled).
- Ministry Leader:
    - Manage events and content for assigned ministries.
    - View assigned members’ profiles (limited fields).
- Editor:
    - Manage all content (pages, blog, sermons, events, gallery).
- Admin:
    - Full access: members, ministries, events, content, gallery, messages, settings, user role assignment.[^3][^11]

RLS (Supabase): enforce read/write policies based on role and ownership for comments, albums, etc.[^13][^14]

***

## 4. Functional requirements – public site

### 4.1 Home (`/`)

- Display: hero with church name, tagline, CTAs (“Plan a Visit”, “Watch Latest Sermon”).[^1][^8]
- Show service times and location with map link.
- Display featured ministries, upcoming events (3–5), latest sermon, latest blog posts, optionally a featured gallery album.


### 4.2 About (`/about`)

- Content sections: mission/story, beliefs, values, leadership grid with photos and roles.[^5][^1]
- Editable via CMS (admin Pages module).


### 4.3 Ministries (`/ministries`, `/ministries/[slug]`)

- Index: list/grid of ministries with name, summary, meeting time.[^4][^5]
- Detail: description, schedule, leader info, contact, related events and gallery albums.


### 4.4 Sermons \& media (`/sermons`, `/sermons/[slug]`)

- Index page:[^15][^6]
    - Filters by series, speaker, year; search by title/passage.
    - Featured sermon at top.
    - Responsive grid/list of sermons with thumbnail, title, date, speaker, series.
- Detail page:
    - Embedded video/audio player.[^7][^16]
    - Title, date, speaker, passage, series.
    - Description, notes/attachments, share links.
    - Related sermons in same series.


### 4.5 Events (`/events`, `/events/[id]`)

- Index: upcoming events list or calendar with filtering by ministry/tag.[^1][^5]
- Detail: title, description, date/time, location, host ministry, “Add to calendar”.
- Optional registration form (stores to `event_registrations`).


### 4.6 Blog (`/blog`, `/blog/[slug]`)

- Index: search + category/tag filters; list of posts (title, excerpt, date, tag).[^8][^1]
- Detail: full post with author, date, tags.
- Comments for logged‑in users; admin moderation tools.


### 4.7 Gallery (`/gallery`, `/gallery/[slug]`)

- Albums index: grid of album cards (cover image, title, date, description, photo count).[^10][^9]
- Album detail: responsive photo grid with lightbox viewer, captions.[^17][^18]


### 4.8 Contact (`/contact`)

- Show address, phone, email, map embed.[^5][^1]
- Contact form → `contact_messages`.
- Prayer request form → `prayer_requests` (with “share only with prayer team” option).

***

## 5. Functional requirements – admin panel

Admin base: `/admin` (authenticated, role checked via middleware).[^19][^20]

### 5.1 Dashboard (`/admin`)

- Summary cards: counts for members, ministries, upcoming events, new messages.[^11]
- Recent activity: latest members, sermons, blog posts, messages.
- Quick actions: “Add event”, “New sermon”, “New album”.


### 5.2 Members (`/admin/members`)

- View paginated list with filters and search.[^11]
- Create/edit member profiles (name, contact, status, family links, ministries).
- View detail: notes, attendance (if added later), involvement.


### 5.3 Ministries (`/admin/ministries`)

- CRUD for ministries: name, slug, description, category, schedule, leader.[^4]
- Assign members and link events.


### 5.4 Events (`/admin/events`)

- List view, filters by date/ministry.
- CRUD: title, description, ministry, start/end, location, capacity, show-on-home toggle.
- View registrations for events with registration enabled.


### 5.5 Sermons (`/admin/sermons`)

- Sermon list with status (draft/published), date, series.[^6][^15]
- CRUD: title, slug, date, speaker, passage, series, description, media URLs, attachments, featured toggle.


### 5.6 Blog (`/admin/blog`)

- List: title, author, status, publish date.[^1]
- CRUD posts: title, slug, excerpt, thumbnail, tags, rich text body, scheduled publish date.
- Comment moderation: approve, hide, delete, block user.


### 5.7 Pages (`/admin/pages`)

- Manage static pages (Home sections, About, Beliefs, custom pages).[^5][^1]
- Editor: structured sections (headline, body, images) or rich text.


### 5.8 Gallery (`/admin/gallery`)

- Albums list: album title, date, linked event, photo count, visibility.[^9][^10]
- Album CRUD: title, slug, description, date range, cover image, related event/ministry, public/private.
- Photo management: upload to VPS, set captions, reorder, set cover, delete.


### 5.9 Messages (`/admin/messages`)

- Tabs: Contact, Prayer.
- List with filters by status.
- Detail view with internal notes and resolution state.


### 5.10 Settings (`/admin/settings`)

- Church profile: name, logo, address, service times.[^5]
- Navigation ordering \& visibility.
- Users \& roles: assign roles in `profiles` based on Supabase user.[^3]

***

## 6. Technical requirements

### 6.1 Stack \& deployment

- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS.[^21][^2]
- Backend: Next.js API routes, Supabase database and auth.[^20][^22]
- Hosting: VPS (e.g., Ubuntu, Docker) running Node + reverse proxy (Nginx).[^12][^23]
- Images: stored on VPS under `/uploads/...`, served via Nginx static file config.[^24][^12]


### 6.2 Data model (summary)

Key tables in Supabase:[^25][^3]

- `profiles`, `members`, `families`, `ministries`, `events`, `event_registrations`.
- `sermons`, `blog_posts`, `blog_comments`, `pages`.
- `photo_albums`, `photos` (with `storage_path` pointing to `/uploads/...`).
- `contact_messages`, `prayer_requests`.


### 6.3 Security \& auth

- Supabase email/password auth; optional social later.[^26][^27]
- RLS policies by role for each table (read/write restrictions).[^14][^13]
- Admin routes protected by middleware that checks `profiles.role`.


### 6.4 Performance \& SEO

- Use SSR/SSG for main public pages (home, sermons, events, blog, gallery).[^2]
- Optimize images via Next `<Image>` plus responsive sizes.[^28][^21]
- Basic SEO: meta titles/descriptions, open graph tags, canonical URLs, sitemaps.[^29][^1]

***

## 7. UX \& design requirements

- Mobile‑first, responsive layouts for all pages.[^30][^21]
- Accessible contrast and text sizes; keyboard navigation; alt text on images.[^31][^30]
- Clean, minimal navigation; consistent branding (colors, typography).[^29][^5]
- Admin UI: sidebar navigation, clear tables, modals for edit forms, confirmation dialogs for destructive actions.[^19][^20]

***

## 8. Milestones (high level)

1. **Foundation**: project setup, Supabase schema, auth, base layouts.[^20][^2]
2. **Public core**: Home, About, Ministries, Contact + forms.
3. **Sermons \& Events**: sermons index/detail, events index/detail.
4. **Blog \& Comments**.
5. **Gallery \& VPS uploads**.
6. **Admin panel**: all modules wired, RLS and role checks.
7. **Polish**: design refinement, SEO, performance, monitoring.

If you want, the next step can be a more implementation‑ready checklist (e.g., per‑milestone tasks for your Git repo) based on this PRD.

<div align="center">⁂</div>

[^1]: https://get.tithe.ly/blog/free-websites-for-churches-and-ministries

[^2]: https://nextjs.org/docs/app/getting-started/project-structure

[^3]: https://gracely.io/the-ultimate-guide-to-church-management-software/

[^4]: https://theleadpastor.com/church-leadership/how-to-set-up-church-administration/

[^5]: https://www.wix.com/blog/beautiful-church-websites

[^6]: https://reachrightstudios.com/blog/perfect-church-sermons-page/

[^7]: https://sermonboss.com

[^8]: https://get.tithe.ly/blog/5-examples-of-great-church-websites-and-why-we-think-theyre-awesome

[^9]: https://www.churchplantmedia.com/websites

[^10]: https://help.churchspring.com/article/72-how-to-create-a-photo-gallery

[^11]: https://churchesadmin.com

[^12]: https://dev.to/ardunster/deploying-a-nextjs-website-to-a-virtual-private-server-gpm

[^13]: https://www.leanware.co/insights/supabase-best-practices

[^14]: https://cursorrules.org/article/supabase-cursor-mdc-file

[^15]: https://millingtonbaptist.org/knowledge-base/sermon-archive-template-guide/

[^16]: https://moonlitmedia.com/how-to-embed-livestreams-and-sermon-videos-on-your-church-website/

[^17]: https://www.sliderrevolution.com/design/church-website-design/

[^18]: https://www.youtube.com/watch?v=ha1ECFXW1w4

[^19]: https://dribbble.com/shots/26020580-GoChurch-Church-Management-Dashboard

[^20]: https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure

[^21]: https://tailwindcss.com/docs/responsive-design

[^22]: https://divjoy.com/guide/next-supabase-db-tailwind

[^23]: https://www.davidtran.dev/blogs/self-hosting-nextjs-on-vps-end-to-end

[^24]: https://www.digitalocean.com/community/questions/best-way-to-optimize-image-heavy-websites-on-a-vps

[^25]: https://dashboard.formaloo.com/templates/church-management-system

[^26]: https://vercel.com/templates/authentication/supabase

[^27]: https://supabase.com/blog/supabase-auth-build-vs-buy

[^28]: https://www.facebook.com/groups/274791304282884/posts/842133034215372/

[^29]: https://epiic.com/blog/church-website-design

[^30]: https://www.hostinger.com/tutorials/church-website-examples

[^31]: https://churchspring.com/blog/best-practices-image-rich-church-websites/

