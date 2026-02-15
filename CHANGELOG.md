# Changelog

All notable changes to the RCCG SODP Church project will be documented in this file.

## [0.4.0] - 2026-02-13

### Added
- **Form Validation**: Implemented **Zod** schema validation for Contact and Prayer Request forms.
- **Media Hub**: Created a centralized `/media` page linking to Sermons, Blog, and Gallery.
- **Breadcrumbs**: Added navigation breadcrumbs to Sermon, Blog, and Ministry detail pages.
- **SEO Metadata**: implemented dynamic `generateMetadata` for better search visibility on detail pages.
- **Admin Features**: Added `ConfirmModal` for destructive actions and unique slug generation for blog posts.
- **Mobile Responsiveness**: Updated Admin Sidebar with a mobile toggle and slide-out animation.
- **Type-Safe Env**: Created `src/env.ts` for validated environment variable access.

### Changed
- **API Refactoring**: Refactored `contact` and `prayer` API routes to use the shared Supabase client helper.
- **Code Quality**: Centralized site settings fetching with `getSettings()` to reduce code duplication.
- **Middleware**: Removed debug console logs for cleaner production output.

### Fixed
- **Supabase Client Usage**: Corrected `createServerClient` usage in Server Components and API routes to ensure proper cookie handling.

## [0.3.0] - 2026-01-03

### Added
- **GitHub Actions CI/CD**: Consolidated pipeline (`ci-cd.yml`) with lint, build, and VPS deployment.
- **Docker Build Workflow**: Automated Docker image builds pushed to Docker Hub with Supabase build-args.
- **Database Migrations Workflow**: Automated Supabase schema migrations via `db-migrations.yml`.
- **VPS Deployment**: Automated deployment to `/home/dotman/projects/church-app` with PM2 process management.
- **Manual Workflow Triggers**: Added `workflow_dispatch` to all workflows for manual triggering.

### Changed
- **Dockerfile**: Added `ARG`/`ENV` for Supabase environment variables at build time.
- **Workflow Consolidation**: Merged `ci.yml` and `deploy.yml` into single `ci-cd.yml` pipeline.

### Infrastructure
- Installed Node.js v20.19.6, npm v10.8.2, and PM2 v6.0.14 on VPS.
- Configured GitHub repository secrets for deployment automation.

## [0.2.0] - 2026-01-03


### Added
- **Global Error Boundary**: Created `error.tsx` for graceful error handling.
- **Custom 404 Page**: Created `not-found.tsx` for better user experience.
- **Docker Deployment**: Added `Dockerfile` and `.dockerignore` for VPS deployment.
- **Centralized Types**: Created `src/types/database.ts` with interfaces for all database entities.

### Changed
- **Next.js Configuration**: Updated `next.config.ts` with `output: 'standalone'`, disabled `X-Powered-By` header, and added image remote patterns.
- **Type Safety**: Replaced `any` types with specific interfaces across 15+ files.
- **Code Cleanup**: Removed unused imports and variables throughout the codebase.

### Fixed
- **Lint Errors**: Resolved all ESLint errors (0 errors, 12 warnings remaining).
- **Schema Mismatch**: Corrected `registration_required` to `registration_enabled` in event pages.
- **Duplicate Directory**: Removed URL-encoded `%5Bid%5D` duplicate directory.

### Removed
- **Debug Endpoint**: Deleted `/api/debug-auth` route for security.

## [Unreleased] - 2025-12-31

### Added
- **Authentication UI**: Logged-in user's email is now displayed in the public header and admin sidebar.
- **Sign-out Support**: Added functional sign-out buttons to both the public header and admin interface.
- **Troubleshooting**: New `/api/debug-auth` endpoint to verify user session and profile roles.
- **User Management**: New admin interface to view users and manage roles (Admin, Editor, Leader, Member).
- **Dark Mode Support**: Integrated `next-themes` and added a theme toggle in the header.
- **Gallery Module (Phase 9)**: Local image storage and album management.
- **Sermons Module**: Admin and public views for sermon media.
- **Events Module**: Event calendar and detail pages with registration support.
- **Blog Module**: Admin and public views for blog posts and status management.
- **Members Module**: Admin pages for listing and managing church members.
- **Authentication**: Login, registration, and role-based access control via middleware.
- **GitHub Integration**: Established remote repository on GitHub and pushed initial implementation.
- **Project Documentation**: Created and updated `README.md` with features, tech stack, and setup instructions.
- **Core Infrastructure**: Next.js 15, Supabase integration, and Tailwind CSS configuration.

### Changed
- **Security Migration**: Replaced all insecure server-side `getSession()` calls with `getUser()` for authenticated data validation.
- **Cookie Management**: Updated Supabase client helpers to use the latest `@supabase/ssr` `getAll()` and `setAll()` methods, ensuring stable session persistence in Next.js 15.

### Fixed
- **Supabase Client Bundling**: Refactored client helpers into `client.ts`, `server.ts`, and `middleware.ts` to resolve build errors.
- **Next.js 15 Compatibility**: Updated cookie handling in Auth routes to be asynchronous.
- **Middleware Debugging**: Enhanced middleware with detailed logging for authentication and role check redirects.

## [Initial Setup] - 2025-12-31
- Initial project structure with Next.js, TypeScript, and Supabase schema.
- Basic Header, Footer, and Page layouts.
