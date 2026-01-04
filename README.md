# RCCG SODP Church Website

A comprehensive church website and management system built with Next.js, Supabase, and Tailwind CSS.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Data Structure](#data-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)

---

## Features

### Public Website
- **Ministries**: Ministry descriptions and leadership information.
- **Sermons**: Media library for audio and video sermons.
- **Events**: Calendar and event detail pages with registration.
- **Blog**: Articles and announcements.
- **Gallery**: Photo albums.
- **Contact & Prayer**: Contact form and prayer request submission.

### Admin Dashboard
- Secure CRUD management for all content types.
- User role management (Admin, Editor, Leader, Member).
- Image upload to local storage.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS 4 |
| **Backend** | Supabase (Auth, Database, RLS) |
| **Database** | PostgreSQL |
| **Deployment** | Docker, GitHub Actions, VPS |

---

## Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                          Next.js App                              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────────┐  │
│  │ Public Pages│   │ Admin Pages │   │ API Routes              │  │
│  │ /           │   │ /admin/*    │   │ /api/contact, /api/...  │  │
│  └─────────────┘   └─────────────┘   └─────────────────────────┘  │
│         │                 │                       │               │
│         └─────────────────┼───────────────────────┘               │
│                           │                                       │
│                    ┌──────▼──────┐                                │
│                    │ Middleware  │  (Auth + Role Check)           │
│                    └──────┬──────┘                                │
└───────────────────────────┼───────────────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │   Supabase    │
                    │  (Auth + DB)  │
                    └───────────────┘
```

### Key Directories

```
src/
├── app/                 # Next.js App Router pages
│   ├── admin/           # Protected admin dashboard
│   ├── api/             # API routes (contact, prayer, upload)
│   ├── auth/            # Login, register, logout, callback
│   └── [feature]/       # Public pages (blog, events, gallery, etc.)
├── components/          # Shared React components
├── lib/                 # Utilities (Supabase clients)
└── types/               # TypeScript interfaces
```

---

## Data Structure

The database is managed via Supabase and consists of the following tables:

| Table | Description |
|-------|-------------|
| `profiles` | User profiles linked to Supabase Auth, includes role. |
| `members` | Church members (name, email, phone, address). |
| `ministries` | Ministry groups with leaders. |
| `events` | Church events with registration support. |
| `event_registrations` | Event registration records. |
| `sermons` | Sermon media (audio/video URLs, speaker, series). |
| `blog_posts` | Blog articles with author and status. |
| `photo_albums` | Photo album metadata. |
| `photos` | Individual photos linked to albums. |
| `contact_messages` | Contact form submissions. |
| `prayer_requests` | Prayer request submissions. |

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- **Public read access** for published content.
- **Admin/Editor write access** for content management.
- **User-specific access** for profiles.

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Supabase project (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/rccg-sodp.git
cd rccg-sodp

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3330](http://localhost:3330) in your browser.

---

## Deployment

### Option 1: Docker (Recommended for VPS)

#### Build and Run Locally

```bash
# Build the Docker image
docker build -t rccg-sodp .

# Run the container
docker run -p 3330:3330 --env-file .env rccg-sodp
```

#### Deploy via GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. Runs ESLint and builds the application.
2. SSHs into your VPS and deploys the latest code.

**Required GitHub Secrets:**

| Secret | Description |
|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `VPS_HOST` | Your VPS IP address or hostname |
| `VPS_USER` | SSH username for VPS |
| `VPS_SSH_KEY` | Private SSH key for VPS access |

**VPS Setup:**

```bash
# On your VPS, ensure these are installed:
# - Node.js 20+
# - npm
# - pm2 (for process management)
# - git

# Create the app directory
sudo mkdir -p /var/www/church-app
sudo chown $USER:$USER /var/www/church-app

# Clone the repo
git clone https://github.com/your-org/rccg-sodp.git /var/www/church-app

# Create .env file with your secrets
nano /var/www/church-app/.env
```

The workflow will then automatically deploy on push to `main`.

### Option 2: Docker Compose (Alternative)

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3330:3330"
    env_file:
      - .env
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

---

## License

Private
