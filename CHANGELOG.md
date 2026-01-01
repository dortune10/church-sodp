# Changelog

All notable changes to the RCCG SODP Church project will be documented in this file.

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
