<div align="center">

# BariBasa — Housing & Roommate Platform

**Find a room, meet a compatible roommate, book a viewing, apply and pay rent, all in one place.**

[**Live site**](https://ph-frontend-assignment-7.vercel.app/) ·
[**Live API**](https://ph-backend-assignment-6.vercel.app/) ·
[**API docs (Swagger)**](https://ph-backend-assignment-6.vercel.app/api/docs) ·
[**Frontend repo**](https://github.com/AbulBashar38/ph-frontend-assignment-7) ·
[**Backend repo**](https://github.com/AbulBashar38/ph-backend-assignment-6)

</div>

BariBasa is a rental marketplace for Bangladesh with three kinds of users. **Tenants** search flats and rooms, get
matched with roommates by budget, area and lifestyle, request viewings, apply and pay rent online. **Owners** list
properties and rooms, review viewing requests and applications, and track their earnings. **Admins** moderate users
and listings and monitor every booking and payment. This repository is the Next.js frontend; it talks to the
[Express + Prisma backend](https://github.com/AbulBashar38/ph-backend-assignment-6).

## Try it in one click

The [login page](https://ph-frontend-assignment-7.vercel.app/login) has a **Quick demo login** card for each role,
so you don't need to sign up. The same accounts work with the normal form:

| Role | Email | Password |
|---|---|---|
| Admin | `admin.demo@example.com` | `Demo@Admin123` |
| Tenant | `tenant.demo@example.com` | `Demo@Tenant123` |
| Owner | `owner.demo@example.com` | `Demo@Owner123` |

Payments run on Stripe **test mode**: pay a rent bill with card `4242 4242 4242 4242`, any future date and any CVC.

## Screenshots

### Public site

| Home | Property search |
|---|---|
| ![Home page with search](docs/screenshots/home.jpg) | ![Property search with filters](docs/screenshots/properties.jpg) |
| **Property details** | **Room search** |
| ![Property details with rooms and booking card](docs/screenshots/property-detail.jpg) | ![Room search](docs/screenshots/rooms.jpg) |

| Login with quick demo login | Phone |
|---|---|
| ![Login page with demo login cards](docs/screenshots/login.jpg) | ![Home page on a phone](docs/screenshots/mobile-home.jpg) |

### Tenant

| Dashboard | Roommate compatibility |
|---|---|
| ![Tenant dashboard](docs/screenshots/tenant-dashboard.jpg) | ![Roommate profile with compatibility score](docs/screenshots/roommate-profile.jpg) |
| **Shortlist compare** | **Payments (Stripe)** |
| ![Shortlisted properties side by side](docs/screenshots/shortlist-compare.jpg) | ![Rent bills with pay and receipt](docs/screenshots/tenant-payments.jpg) |

### Owner

| Earnings | My properties |
|---|---|
| ![Owner earnings charts](docs/screenshots/owner-earnings.jpg) | ![Owner properties table](docs/screenshots/owner-properties.jpg) |
| **Add property wizard** | **Rooms and photos** |
| ![Multi-step add property wizard](docs/screenshots/add-property-wizard.jpg) | ![Rooms tab of a property](docs/screenshots/owner-rooms.jpg) |
| **Viewing requests** | **Earnings on a phone** |
| ![Viewing requests with actions](docs/screenshots/owner-viewings.jpg) | ![Owner earnings on a phone](docs/screenshots/mobile-owner-earnings.jpg) |

### Admin

| Platform analytics | Users |
|---|---|
| ![Admin analytics](docs/screenshots/admin-analytics.jpg) | ![User management](docs/screenshots/admin-users.jpg) |
| **Audit logs** | |
| ![Audit logs](docs/screenshots/admin-audit-logs.jpg) | |

## Features

**Everyone**
- Property and room search with filters (area, type, rent, people, amenities, available date), sorting and
  pagination, all kept in the URL so any search can be bookmarked or shared
- Property and room pages with a photo gallery, amenities, rooms and the owner
- Sign up as a tenant or an owner, email verification with a one-time code, password reset, and Google sign-in
- About, services, FAQ and a contact form that emails the team

**Tenants**
- Dashboard with upcoming viewings, application status, the current rental and rent due
- Request viewings and apply for rooms; follow, cancel or withdraw them
- Pay rent with Stripe Checkout, see the result on a success or cancel page, and download PDF receipts
- Roommate profile, matches scored out of 100 (budget, location, move-in date, lifestyle, smoking, pets, sleep),
  connection requests and connections with contact details
- Shortlist properties with a heart and compare them side by side

**Owners**
- Six-step "Add property" wizard (details, location, amenities, photos, rooms and rent, review) that keeps the
  draft if the page is refreshed
- Edit listings, publish or hide them, manage rooms and their status, and upload photos with a progress bar
- Approve, reschedule, decline, cancel or complete viewings; approve or decline applications
- Rentals, payments and an earnings page with charts (monthly revenue, revenue per property, bills, rooms)

**Admins**
- Platform analytics with charts
- Users: search, filter, block with a reason or reactivate (the super admin can also add admins)
- Listing moderation: suspend with a reason, or restore
- Every application, rental and payment, plus a filterable audit log of who changed what

**Throughout**
- Role-based access: protected areas are checked on the server (`src/proxy.ts`) and again in the browser
- Notifications with an unread badge, instant "mark as read" and links to the related page
- Loading skeletons, empty states, error pages and toast messages with the server's own wording
- Responsive from phone to desktop, keyboard friendly, light theme

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Server Components), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui (Base UI), Lucide icons, Motion |
| Data | TanStack Query (caching, optimistic updates), ofetch |
| Forms | TanStack Form with Zod validation |
| Client state | Zustand (property wizard draft, shortlist, UI preferences) |
| Charts | Recharts |
| Notifications | Sonner |
| Payments | Stripe Checkout (through the backend) |
| Tooling | Yarn 1, Biome |

## Getting started

### Prerequisites

- Node.js 20 or newer and Yarn 1 (`npm i -g yarn`)
- The backend running locally or the live API URL. To run it locally, follow the
  [backend README](https://github.com/AbulBashar38/ph-backend-assignment-6): it starts on
  `http://localhost:5050`, and `npm run seed:demo` creates the demo accounts and sample data.

### 1. Clone and install

```bash
git clone https://github.com/AbulBashar38/ph-frontend-assignment-7.git
cd ph-frontend-assignment-7
yarn install
```

### 2. Environment variables

Copy the template and fill it in:

```bash
cp .env.example .env.local
```

| Variable | What it is |
|---|---|
| `API_URL` | The backend's address, used on the server only. `http://localhost:5050` locally, or `https://ph-backend-assignment-6.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | This site's address, for links in shared previews (`http://localhost:3000` locally) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google sign-in client ID, the same one the backend uses |
| `NEXT_PUBLIC_DEMO_ADMIN_EMAIL` / `_PASSWORD` | The demo admin account for the quick-login card |
| `NEXT_PUBLIC_DEMO_TENANT_EMAIL` / `_PASSWORD` | The demo tenant account |
| `NEXT_PUBLIC_DEMO_OWNER_EMAIL` / `_PASSWORD` | The demo owner account |

The browser never calls the backend directly: requests go to `/api/v1/*` on this site, which forwards them to
`API_URL`. That keeps the login cookies on this site's domain.

### 3. Run

```bash
yarn dev      # http://localhost:3000
```

### Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Development server |
| `yarn build` | Type check and production build |
| `yarn start` | Serve the production build |
| `yarn lint` | Biome lint and format check |
| `yarn format` | Format the code with Biome |

## Project structure

```text
src/
  app/            routes: (public) site and auth pages, (dashboard) tenant, owner and admin areas
  proxy.ts        route protection by role
  api/            one function per backend endpoint
  hooks/          TanStack Query hooks and shared hooks (useAuth, useUrlState, useUploadWithProgress…)
  components/
    ui/           shadcn/ui building blocks
    shared/       DataTable, StatCard, StatusBadge, EmptyState, ImagePicker, charts…
    form/         forms, including the add-property wizard
    modules/      feature screens (properties, rooms, viewings, payments, roommates, admin…)
  validation/     Zod schemas matching the backend's rules
  store/          Zustand stores
  types/          API types
```

## Deployment

The site is deployed on Vercel. Set the same environment variables in the Vercel project, with `API_URL`
pointing to the live backend and `NEXT_PUBLIC_SITE_URL` to the site's own address.
