# Product Requirements Document (PRD) v2

## RCCG SODP Church Website & Management System

**Version:** 2.0  
**Last Updated:** 2026-01-03  
**Status:** Production

---

## 1. Executive Summary

A comprehensive church website and administrative management system for RCCG SODP (Redeemed Christian Church of God - Seed of David Parish). The platform serves both public visitors seeking church information and authenticated administrators managing church operations.

---

## 2. Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI Library | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Backend/Auth | Supabase | - |
| Database | PostgreSQL (via Supabase) | - |
| Deployment | VPS + PM2 / Docker | - |
| CI/CD | GitHub Actions | - |

---

## 3. Core Features

### 3.1 Public Website

| Feature | Description | Route |
|---------|-------------|-------|
| **Home** | Landing page with hero, featured content, upcoming events | `/` |
| **About** | Church history, mission, vision, leadership | `/about` |
| **Ministries** | List of church ministries with leadership info | `/ministries`, `/ministries/[id]` |
| **Events** | Event calendar, details, and registration | `/events`, `/events/[id]` |
| **Sermons** | Audio/video sermon library, filtering by series/speaker | `/sermons`, `/sermons/[slug]` |
| **Blog** | Church announcements and articles | `/blog`, `/blog/[slug]` |
| **Gallery** | Photo albums from church activities | `/gallery`, `/gallery/[id]` |
| **Contact** | Contact form with email notification | `/contact` |

### 3.2 Admin Dashboard

| Module | Capabilities | Route |
|--------|--------------|-------|
| **Dashboard** | Overview stats and quick actions | `/admin` |
| **Members** | CRUD for church members | `/admin/members` |
| **Ministries** | CRUD for ministries + leader assignment | `/admin/ministries` |
| **Events** | CRUD for events + registration management | `/admin/events` |
| **Sermons** | CRUD for sermon media | `/admin/sermons` |
| **Blog** | CRUD for blog posts + draft/publish workflow | `/admin/blog` |
| **Gallery** | Album management + photo uploads | `/admin/gallery` |
| **Users** | Role management (Admin, Editor, Leader, Member) | `/admin/users` |

### 3.3 Authentication & Authorization

| Feature | Implementation |
|---------|----------------|
| Authentication Provider | Supabase Auth |
| Supported Methods | Email/Password |
| Session Management | Cookie-based via `@supabase/ssr` |
| Role-Based Access Control | Middleware + RLS policies |

**User Roles:**
- `admin` - Full system access
- `editor` - Content management (blog, sermons, events)
- `leader` - Ministry-specific management
- `member` - Basic authenticated access

---

## 4. Data Models

### 4.1 Database Tables

```
profiles          - User profiles linked to Supabase Auth
members           - Church member directory
ministries        - Ministry groups
events            - Church events
event_registrations - Event registration records
sermons           - Sermon media library
blog_posts        - Blog articles
photo_albums      - Photo album metadata
photos            - Individual photos
contact_messages  - Contact form submissions
prayer_requests   - Prayer request submissions
```

### 4.2 Key Relationships

```
profiles (1) ─────── (N) blog_posts (author)
profiles (1) ─────── (1) members (optional link)
ministries (1) ───── (N) events
ministries (1) ───── (1) members (leader)
photo_albums (1) ─── (N) photos
events (1) ───────── (N) event_registrations
```

---

## 5. API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/contact` | POST | Submit contact form |
| `/api/prayer` | POST | Submit prayer request |
| `/api/upload` | POST | Upload images to local storage |

---

## 6. Infrastructure

### 6.1 Development

```bash
npm run dev          # Start development server (port 3330)
npm run build        # Production build
npm run lint         # ESLint check
```

### 6.2 Deployment

**VPS Deployment (Primary):**
- Location: `/home/dotman/projects/church-app`
- Process Manager: PM2
- Port: 3330
- Auto-deploy: GitHub Actions on push to `main`

**Docker Deployment (Alternative):**
- Image: `<docker-username>/church-app:latest`
- Registry: Docker Hub
- Build: Multi-stage Dockerfile with standalone output

### 6.3 CI/CD Workflows

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| CI/CD Pipeline | `ci-cd.yml` | Push to main/develop, PRs | Lint, build, deploy to VPS |
| Docker Build | `docker-build.yml` | Push to main, tags | Build and push Docker image |
| DB Migrations | `db-migrations.yml` | Changes to `supabase/migrations/**` | Apply database migrations |

---

## 7. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |

### GitHub Secrets (for CI/CD)

| Secret | Purpose |
|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Build-time Supabase config |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build-time Supabase config |
| `VPS_HOST` | VPS IP for deployment |
| `VPS_USER` | SSH username |
| `VPS_SSH_KEY` | SSH private key |
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub password/token |
| `SUPABASE_PROJECT_ID` | For DB migrations |
| `SUPABASE_DB_PASSWORD` | For DB migrations |
| `SUPABASE_ACCESS_TOKEN` | For DB migrations |

---

## 8. Security Considerations

| Area | Implementation |
|------|----------------|
| Authentication | Supabase Auth with secure session management |
| Authorization | Row Level Security (RLS) policies on all tables |
| API Protection | Middleware validates sessions for protected routes |
| Input Validation | Server-side validation on all form submissions |
| XSS Prevention | React's built-in escaping + Content Security Policy |
| HTTPS | Required for production deployment |

---

## 9. Future Enhancements (Roadmap)

| Priority | Feature | Description |
|----------|---------|-------------|
| High | Email Notifications | SMTP integration for contact/prayer submissions |
| High | Sermon Transcription | AI-powered transcription via n8n integration |
| Medium | Event Reminders | Automated email reminders for registrants |
| Medium | Member Portal | Self-service profile management |
| Medium | Giving/Donations | Payment integration for tithes/offerings |
| Low | Mobile App | React Native companion app |
| Low | Multi-site Support | Multiple campus/parish support |

---

## 10. Project Structure

```
.
├── .github/workflows/     # CI/CD pipelines
├── public/                # Static assets
│   └── uploads/           # Local image storage
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── admin/         # Protected admin dashboard
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   └── [feature]/     # Public feature pages
│   ├── components/        # Shared React components
│   ├── lib/               # Utilities (Supabase clients)
│   └── types/             # TypeScript interfaces
├── supabase/
│   └── migrations/        # Database migration files
├── Dockerfile             # Docker multi-stage build
└── next.config.ts         # Next.js configuration
```

---

## 11. Getting Started

```bash
# Clone repository
git clone https://github.com/dortune10/church-sodp.git
cd church-sodp

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev

# Open http://localhost:3330
```

---

## 12. Appendix

### A. Supabase Schema Setup

The database schema should be created via Supabase migrations. Key tables and their RLS policies are managed in `supabase/migrations/`.

### B. PM2 Commands

```bash
pm2 list                    # View running processes
pm2 logs church-app         # View logs
pm2 restart church-app      # Restart application
pm2 monit                   # Real-time monitoring
```

### C. Docker Commands

```bash
docker build -t church-app .
docker run -p 3330:3330 --env-file .env church-app
```
