# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check

# Database
npx prisma migrate dev    # Create/apply migrations locally
npx prisma db push        # Push schema without migration
npx prisma db seed        # Seed database with test data
npx prisma studio         # Open database UI

# Production database (via cloud-sql-proxy)
cloud-sql-proxy equigestion-prod-2026:europe-west9:equigestion-db --port=5433 &
DATABASE_URL="postgresql://appuser:fpwctkfg%40@localhost:5433/equigestion" npx prisma db push

# Deployment
./scripts/update.sh --migrate   # Deploy to Cloud Run with migrations
```

## Architecture

**Stack:** Next.js 16 (App Router) + TypeScript + Prisma + PostgreSQL + TailwindCSS 4

**Authentication:** NextAuth 5 (beta) with Credentials provider, JWT sessions, bcryptjs password hashing. Two roles: ADMIN (manages users) and MANAGER (manages pension data).

**Multi-tenancy:** All data entities (except Specialty) have a `userId` field. Server actions filter by authenticated user's ID to isolate data per manager.

**Key patterns:**
- Server Components by default, `"use client"` for interactive components
- Server Actions in `src/lib/actions.ts` for data mutations
- Middleware (`src/middleware.ts`) enforces auth and role-based access
- Forms use controlled components with async server action calls

## Project Structure

```
src/
├── app/
│   ├── (authenticated)/    # Protected routes with Sidebar
│   │   ├── horses/         # Horse CRUD
│   │   ├── proprietaires/  # Owner CRUD
│   │   ├── providers/      # Professional contacts
│   │   └── settings/       # Groups & specialties management
│   ├── admin/              # Admin-only (user management)
│   ├── login/              # Public login page
│   └── api/
│       ├── auth/           # NextAuth endpoints
│       └── upload/         # Image upload to GCS
├── components/             # Reusable UI components
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── auth-utils.ts       # requireAuth(), requireAdmin(), hashPassword()
│   ├── actions.ts          # Server actions (CRUD operations)
│   ├── admin-actions.ts    # Admin server actions
│   ├── db.ts               # Prisma client singleton
│   └── storage.ts          # Google Cloud Storage
└── middleware.ts           # Route protection
```

## Database Models

- **User**: Admin/Manager accounts with password and role
- **Owner**: Horse owners (per user)
- **Horse**: Horses with owner, group, health tracking
- **Group**: Location groupings for horses (per user)
- **Provider**: Vets, farriers, etc. with specialty
- **Specialty**: Shared reference data (Vétérinaire, Maréchal-ferrant, etc.)
- **Appointment**: Scheduled visits with providers
- **HealthEvent/MedicalTracking**: Health history

## Environment Variables

Required in `.env`:
```
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."  # Generate with: openssl rand -base64 32
GCS_BUCKET_NAME="..."  # For image uploads
```

## UI Conventions

- Use `font-black` for headings, `font-bold` for labels
- Border style: `border-2 border-slate-100`
- Rounded corners: `rounded-2xl` or `rounded-[2rem]`
- Primary color with shadow: `bg-primary shadow-lg shadow-primary/20`
- Buttons: `active:scale-95` for press feedback

**Responsive design:** Le site doit être pleinement utilisable sur mobile. Utiliser les breakpoints Tailwind (`sm:`, `md:`, `lg:`) pour adapter les layouts. La Sidebar se transforme en menu hamburger sur mobile. Les tableaux doivent être scrollables horizontalement (`overflow-x-auto`) ou remplacés par des cartes sur petits écrans.
